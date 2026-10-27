import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import { mkdtemp, rm, stat } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { setTimeout as delay } from "node:timers/promises";
export async function runtime() {
  const binary = process.env.REDIS_SERVER || "redis-server";
  assert.match(
    execFileSync(binary, ["--version"], { encoding: "utf8" }),
    /v=8\.2\.2\b/,
    "Use official Redis 8.2.2",
  );
  const directory = await mkdtemp(
      path.join(process.platform === "darwin" ? "/tmp" : tmpdir(), "sc-app-"),
    ),
    socket = path.join(directory, "redis.sock");
  let server = null,
    closed = null,
    stopping = null;
  const stop = () => {
    if (stopping) return stopping;
    if (!server) return Promise.resolve();
    const process = server;
    server = null;
    stopping = (async () => {
      if (process.exitCode === null) process.kill("SIGTERM");
      const force = setTimeout(() => process.kill("SIGKILL"), 2000);
      try {
        await closed;
      } finally {
        clearTimeout(force);
        stopping = null;
      }
    })();
    return stopping;
  };
  const start = async () => {
    if (stopping) await stopping;
    assert.equal(server, null, "Owned Redis is already running");
    await rm(socket, { force: true });
    server = spawn(
      binary,
      [
        "--port",
        "0",
        "--unixsocket",
        socket,
        "--unixsocketperm",
        "700",
        "--save",
        "",
        "--appendonly",
        "no",
        "--dir",
        directory,
        "--maxmemory",
        "16mb",
        "--maxmemory-policy",
        "allkeys-lru",
      ],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
    let output = "";
    server.stdout.on("data", (d) => (output += d));
    server.stderr.on("data", (d) => (output += d));
    closed = new Promise((resolve, reject) => {
      server.once("close", resolve);
      server.once("error", reject);
    });
    for (let i = 0; i < 100; i++) {
      if (server.exitCode !== null) throw new Error(output);
      if (await stat(socket).catch(() => null)) return;
      await delay(20);
    }
    throw new Error("Private Redis did not start");
  };
  return {
    directory,
    socket,
    start,
    stop,
    close: async () => {
      await stop();
      await rm(directory, { recursive: true, force: true });
    },
  };
}
