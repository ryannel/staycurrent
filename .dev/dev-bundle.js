#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/generators/workspace-dev-cli/cli-src/src/index.ts
var fs11 = __toESM(require("fs"));

// src/generators/workspace-dev-cli/cli-src/src/registry.ts
var path9 = __toESM(require("path"));

// src/generators/workspace-dev-cli/cli-src/src/commands/lifecycle.ts
var fs4 = __toESM(require("fs"));

// src/generators/workspace-dev-cli/cli-src/src/util/context.ts
var CliError = class extends Error {
  constructor(message, action) {
    super(message);
    this.action = action;
    this.name = "CliError";
  }
};
var UsageError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "UsageError";
  }
};
function elapsedSince(startMs) {
  return `${Math.round((Date.now() - startMs) / 1e3)}s`;
}

// src/generators/workspace-dev-cli/cli-src/src/util/proc.ts
var import_child_process = require("child_process");
var http = __toESM(require("http"));
function run(cmd, args, opts = {}) {
  const r = (0, import_child_process.spawnSync)(cmd, args, { stdio: "inherit", ...opts });
  return r.status ?? 1;
}
function capture(cmd, args, opts = {}) {
  const r = (0, import_child_process.spawnSync)(cmd, args, { encoding: "utf8", ...opts });
  return {
    status: r.status ?? (r.error ? 127 : 1),
    stdout: r.stdout ?? "",
    stderr: r.stderr ?? ""
  };
}
function commandExists(cmd) {
  const safe = cmd.replace(/[^a-zA-Z0-9._-]/g, "");
  const probe = process.platform === "win32" ? `where ${safe}` : `command -v ${safe}`;
  const r = (0, import_child_process.spawnSync)(probe, { shell: true, stdio: "ignore" });
  return (r.status ?? 1) === 0;
}
var COMPOSE = ["compose"];
function dockerComposeCapture(args) {
  return capture("docker", [...COMPOSE, ...args]);
}
function dockerComposeRun(args) {
  return run("docker", [...COMPOSE, ...args]);
}
function spawnBackground(command, logStream, opts = {}) {
  const child = (0, import_child_process.spawn)("bash", ["-c", command], {
    stdio: ["ignore", logStream, logStream],
    detached: true,
    cwd: opts.cwd,
    env: opts.env
  });
  child.unref();
  return child.pid ?? -1;
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function httpProbe(url, timeoutMs = 3e3) {
  return new Promise((resolve) => {
    let settled = false;
    const done = (code) => {
      if (settled) return;
      settled = true;
      resolve(code);
    };
    try {
      const req = http.get(url, (res) => {
        const code = res.statusCode ?? 0;
        res.resume();
        done(code);
      });
      req.setTimeout(timeoutMs, () => {
        req.destroy();
        done(0);
      });
      req.on("error", () => done(0));
    } catch {
      done(0);
    }
  });
}

// src/generators/workspace-dev-cli/cli-src/src/util/services.ts
var fs3 = __toESM(require("fs"));
var path2 = __toESM(require("path"));

// src/generators/workspace-dev-cli/cli-src/src/util/paths.ts
var path = __toESM(require("path"));
var fs = __toESM(require("fs"));
var ROOT = (() => {
  if (process.env.DEV_ROOT) return process.env.DEV_ROOT;
  let dir = process.cwd();
  for (let i = 0; i < 12; i += 1) {
    if (fs.existsSync(path.join(dir, "dev")) || fs.existsSync(path.join(dir, "docker-compose.yml")) || fs.existsSync(path.join(dir, ".groundwork"))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
})();
var DEV_DIR = path.join(ROOT, ".dev");
var PID_DIR = path.join(DEV_DIR, "pids");
var LOG_DIR = path.join(DEV_DIR, "logs");
var SERVICES_DIR = path.join(ROOT, "services");
var TESTS_DIR = path.join(ROOT, "tests");
var DOCS_DIR = path.join(ROOT, "docs");
var CONFIG_PATH = path.join(DEV_DIR, "dev.config.json");
var GROUNDWORK_SURFACES_FILE = path.join(ROOT, ".groundwork", "surfaces.json");
function ensureDirs() {
  fs.mkdirSync(PID_DIR, { recursive: true });
  fs.mkdirSync(LOG_DIR, { recursive: true });
}
function pidFile(svc) {
  return path.join(PID_DIR, `${svc}.pid`);
}
function logFile(svc) {
  return path.join(LOG_DIR, `${svc}.log`);
}

// src/generators/workspace-dev-cli/cli-src/src/util/runners.ts
var fs2 = __toESM(require("fs"));
function parseRunners(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const r = item;
    if (typeof r.name !== "string" || typeof r.cmd !== "string") continue;
    out.push({
      name: r.name,
      kind: r.kind === "surface" ? "surface" : r.kind === "sidecar" ? "sidecar" : void 0,
      cmd: r.cmd,
      cwd: typeof r.cwd === "string" ? r.cwd : void 0,
      env: r.env && typeof r.env === "object" && !Array.isArray(r.env) ? r.env : void 0,
      health: r.health ?? null,
      autostart: r.autostart === false ? false : true
    });
  }
  return out;
}
function loadRunners() {
  try {
    if (!fs2.existsSync(CONFIG_PATH)) return [];
    const raw = JSON.parse(fs2.readFileSync(CONFIG_PATH, "utf8"));
    return parseRunners(raw.runners);
  } catch {
    return [];
  }
}
function runnerNames() {
  return new Set(loadRunners().map((r) => r.name));
}

// src/generators/workspace-dev-cli/cli-src/src/util/services.ts
var composeServicesCache;
function getComposeServices() {
  if (composeServicesCache !== void 0) return composeServicesCache;
  const r = capture("docker", ["compose", "config", "--services"]);
  composeServicesCache = r.status === 0 ? new Set(
    r.stdout.split("\n").map((s) => s.trim()).filter(Boolean)
  ) : null;
  return composeServicesCache;
}
function getAppServices() {
  if (!fs3.existsSync(SERVICES_DIR)) return [];
  const runners = runnerNames();
  const dirs = fs3.readdirSync(SERVICES_DIR, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).filter((d) => !runners.has(d)).sort();
  const compose = getComposeServices();
  if (compose === null) return dirs;
  return dirs.filter((d) => compose.has(d));
}
function getInfraServices() {
  const app = new Set(getAppServices());
  const r = capture("docker", ["compose", "config", "--services"]);
  if (r.status !== 0) return [];
  return r.stdout.split("\n").map((s) => s.trim()).filter(Boolean).filter((s) => !app.has(s));
}
function serviceDir(svc) {
  return path2.join(SERVICES_DIR, svc);
}
function detectType(svc) {
  const dir = serviceDir(svc);
  if (fs3.existsSync(path2.join(dir, ".air.toml"))) return "go";
  if (fs3.existsSync(path2.join(dir, "package.json"))) return "node";
  if (fs3.existsSync(path2.join(dir, "pyproject.toml"))) return "python";
  return "unknown";
}
function findPythonConfig(dir) {
  const src = path2.join(dir, "src");
  if (!fs3.existsSync(src)) return null;
  const stack = [src];
  while (stack.length > 0) {
    const cur = stack.pop();
    let entries;
    try {
      entries = fs3.readdirSync(cur, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const full = path2.join(cur, e.name);
      if (e.isDirectory()) stack.push(full);
      else if (e.name === "config.py") return full;
    }
  }
  return null;
}
function servicePort(svc) {
  const dir = serviceDir(svc);
  switch (detectType(svc)) {
    case "go": {
      const env = path2.join(dir, ".env");
      if (fs3.existsSync(env)) {
        const m = fs3.readFileSync(env, "utf8").match(/^(?:PORT|SERVER_PORT)=(\d+)/m);
        if (m) return parseInt(m[1], 10);
      }
      return null;
    }
    case "node": {
      const pkg = path2.join(dir, "package.json");
      if (fs3.existsSync(pkg)) {
        const m = fs3.readFileSync(pkg, "utf8").match(/next dev --port (\d+)/);
        if (m) return parseInt(m[1], 10);
      }
      return null;
    }
    case "python": {
      const cfg = findPythonConfig(dir);
      if (cfg) {
        const m = fs3.readFileSync(cfg, "utf8").match(/server_port:\s*int\s*=\s*(\d+)/);
        if (m) return parseInt(m[1], 10);
      }
      return null;
    }
    default:
      return null;
  }
}
function serviceHealthPath(svc) {
  return detectType(svc) === "node" ? "/api/healthz" : "/health";
}
function bootCommand(svc) {
  const dir = serviceDir(svc);
  switch (detectType(svc)) {
    case "go":
      return `cd ${JSON.stringify(dir)} && air`;
    case "node":
      return `cd ${JSON.stringify(dir)} && ([ -d node_modules ] || npm install --legacy-peer-deps) && npm run dev`;
    case "python":
      return `cd ${JSON.stringify(dir)} && uv run python src/main.py`;
    default:
      return null;
  }
}
function readPid(svc) {
  const f = pidFile(svc);
  if (!fs3.existsSync(f)) return null;
  const n = parseInt(fs3.readFileSync(f, "utf8").trim(), 10);
  return Number.isFinite(n) ? n : null;
}
function pidAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}
function isRunning(svc) {
  const pid = readPid(svc);
  if (pid === null) return false;
  if (pidAlive(pid)) return true;
  fs3.rmSync(pidFile(svc), { force: true });
  return false;
}
function isDead(svc) {
  const pid = readPid(svc);
  return pid !== null && !pidAlive(pid);
}
function writePid(svc, pid) {
  fs3.mkdirSync(PID_DIR, { recursive: true });
  fs3.writeFileSync(pidFile(svc), `${pid}
`);
}
function removePid(svc) {
  fs3.rmSync(pidFile(svc), { force: true });
}
async function killTree(pid) {
  const r = capture("pgrep", ["-P", String(pid)]);
  const children = r.stdout.split("\n").map((s) => parseInt(s.trim(), 10)).filter((n) => Number.isFinite(n));
  for (const child of children) {
    await killTree(child);
  }
  try {
    process.kill(pid, "SIGTERM");
  } catch {
  }
  await sleep(1e3);
  if (pidAlive(pid)) {
    try {
      process.kill(pid, "SIGKILL");
    } catch {
    }
  }
}

// src/generators/workspace-dev-cli/cli-src/src/commands/lifecycle.ts
var path3 = __toESM(require("path"));
async function start(ctx) {
  const { r } = ctx;
  const docker = ctx.args.includes("--docker");
  ensureDirs();
  const startMs = Date.now();
  if (docker) {
    r.startSpinner("Starting ALL services via Docker");
    if (dockerComposeRun(["up", "-d"]) !== 0) {
      r.failSpinner("Failed to start services");
      throw new CliError("docker compose up failed", "Run './dev doctor' to verify Docker is running.");
    }
    r.stopSpinner("All services started via Docker", elapsedSince(startMs));
    return 0;
  }
  const infra = getInfraServices();
  const services = getAppServices();
  const autostartRunners = ctx.runners.filter((x) => x.autostart !== false);
  if (infra.length === 0 && services.length === 0 && autostartRunners.length === 0) {
    r.warn("Nothing to start: no containerized services, native services, or runners are registered.");
    r.info("Wire this app into ./dev so `start` runs it: register a runner in .dev/dev.config.json");
    r.info("(name + launch command), or add a project command under .dev/commands/. See docs/architecture/infrastructure.md.");
    return 0;
  }
  if (infra.length > 0) {
    r.startSpinner("Starting Infrastructure (Docker)");
    if (dockerComposeRun(["up", "-d", ...infra]) !== 0) {
      r.failSpinner("Failed to start infrastructure");
      throw new CliError("docker compose up failed", "Run './dev doctor' to verify Docker is running.");
    }
    r.stopSpinner("Infrastructure started");
  }
  for (const svc of services) {
    if (isRunning(svc)) {
      r.substep(`${svc} is already running`);
      continue;
    }
    const cmd = bootCommand(svc);
    if (!cmd) {
      r.warn(`Unknown service type for ${svc}. Skipping.`);
      continue;
    }
    r.startSpinner(`Booting ${svc}`);
    const fd = fs4.openSync(logFile(svc), "a");
    const pid = spawnBackground(cmd, fd);
    fs4.closeSync(fd);
    writePid(svc, pid);
    await sleep(500);
    if (readPid(svc) !== null && !isRunning(svc)) {
      r.failSpinner(`${svc} failed to start`);
      r.errorCard(`${svc} exited immediately`, `Check .dev/logs/${svc}.log for the cause.`);
    } else {
      r.stopSpinner(`${svc} started natively (PID ${pid})`);
    }
  }
  for (const runner of autostartRunners) {
    if (isRunning(runner.name)) {
      r.substep(`${runner.name} is already running`);
      continue;
    }
    r.startSpinner(`Booting ${runner.name}`);
    const fd = fs4.openSync(logFile(runner.name), "a");
    const env = runner.env ? { ...process.env, ...runner.env } : process.env;
    const cwd = runner.cwd ? path3.join(ROOT, runner.cwd) : ROOT;
    const pid = spawnBackground(runner.cmd, fd, { cwd, env });
    fs4.closeSync(fd);
    writePid(runner.name, pid);
    await sleep(500);
    if (readPid(runner.name) !== null && !isRunning(runner.name)) {
      r.failSpinner(`${runner.name} failed to start`);
      r.errorCard(`${runner.name} exited immediately`, `Check .dev/logs/${runner.name}.log for the cause.`);
    } else {
      r.stopSpinner(`${runner.name} started natively (PID ${pid})`);
    }
  }
  const parts = [];
  if (infra.length) parts.push(`${infra.length} infra`);
  if (services.length) parts.push(`${services.length} service${services.length > 1 ? "s" : ""}`);
  if (autostartRunners.length) parts.push(`${autostartRunners.length} runner${autostartRunners.length > 1 ? "s" : ""}`);
  r.success(`Development environment started \u2014 ${parts.join(", ")}. (${elapsedSince(startMs)})`);
  r.info("Run './dev logs' to read service output.");
  return 0;
}
async function stop(ctx) {
  const { r } = ctx;
  const startMs = Date.now();
  r.startSpinner("Stopping environment");
  for (const svc of getAppServices()) {
    const pid = readPid(svc);
    if (pid !== null && isRunning(svc)) {
      await killTree(pid);
    }
    removePid(svc);
  }
  for (const runner of ctx.runners) {
    const pid = readPid(runner.name);
    if (pid !== null && isRunning(runner.name)) {
      await killTree(pid);
    }
    removePid(runner.name);
  }
  if (dockerComposeRun(["down"]) !== 0) {
  }
  r.stopSpinner("Environment stopped", elapsedSince(startMs));
  return 0;
}
async function clean(ctx) {
  const { r } = ctx;
  const hard = ctx.args.includes("--hard");
  const startMs = Date.now();
  r.startSpinner("Stopping services & wiping native state");
  for (const svc of getAppServices()) {
    const pid = readPid(svc);
    if (pid !== null && isRunning(svc)) {
      await killTree(pid);
    }
  }
  for (const runner of ctx.runners) {
    const pid = readPid(runner.name);
    if (pid !== null && isRunning(runner.name)) {
      await killTree(pid);
    }
  }
  fs4.rmSync(PID_DIR, { recursive: true, force: true });
  fs4.rmSync(LOG_DIR, { recursive: true, force: true });
  ensureDirs();
  r.stopSpinner("Wiped native state (.dev/pids, .dev/logs)");
  r.startSpinner("Cleaning Docker environment");
  if (hard) {
    dockerComposeRun(["down", "-v", "--remove-orphans"]);
    r.stopSpinner("Docker environment destroyed (volumes wiped)");
  } else {
    dockerComposeRun(["down", "--remove-orphans"]);
    r.stopSpinner("Docker environment stopped (volumes preserved)");
  }
  r.success(`Workspace clean complete. (${elapsedSince(startMs)})`);
  return 0;
}
async function reset(ctx) {
  const { r } = ctx;
  r.logo("Resetting Environment");
  r.info("Full cycle: stop \u2192 clean (wipe volumes) \u2192 start \u2192 migrate.");
  await stop(ctx);
  await clean({ ...ctx, args: ["--hard"] });
  await start(ctx);
  await migrate(ctx);
  r.success("Environment reset complete.");
  return 0;
}
async function probeService(svc) {
  const port = servicePort(svc);
  if (port === null) return { service: svc, port: null, status: "unknown", code: 0 };
  const code = await httpProbe(`http://localhost:${port}${serviceHealthPath(svc)}`);
  return { service: svc, port, status: code === 200 ? "healthy" : "down", code };
}
function healthLabel(row) {
  if (row.status === "unknown") return [row.service, "unknown port", "skipped"];
  if (row.status === "healthy") return [row.service, "healthy", row.port ? `:${row.port}` : ""];
  const detail = row.code ? `down (${row.code})` : "down";
  return [row.service, detail, row.port ? `:${row.port}` : ""];
}
async function health(ctx) {
  const { r } = ctx;
  const json = ctx.json || ctx.args.includes("--json");
  const services = await Promise.all(getAppServices().map(probeService));
  const jcode = await httpProbe("http://localhost:16686/api/services");
  const jaeger = {
    service: "jaeger",
    port: 16686,
    status: jcode === 200 ? "healthy" : "down",
    code: jcode
  };
  const unhealthy = [...services, jaeger].filter((row) => row.status !== "healthy").length;
  if (json) {
    process.stdout.write(
      JSON.stringify({ ok: unhealthy === 0, services, observability: [jaeger] }, null, 2) + "\n"
    );
    return unhealthy === 0 ? 0 : 1;
  }
  r.logo("Service Health");
  r.table("App Services", services.length ? services.map(healthLabel) : []);
  r.table("Observability", [healthLabel(jaeger)]);
  if (unhealthy === 0) {
    r.success("All services healthy.");
    return 0;
  }
  r.errorCard(
    `${unhealthy} endpoint(s) unhealthy.`,
    "Run './dev start' (or './dev start --docker') and retry."
  );
  return 1;
}
async function migrate(ctx) {
  const { r } = ctx;
  const composeServices = capture("docker", ["compose", "config", "--services"]);
  const hasDb = composeServices.status === 0 && composeServices.stdout.split("\n").map((s) => s.trim()).includes("db");
  if (!hasDb) {
    r.info("No database in this workspace; nothing to migrate.");
    return 0;
  }
  const db = `${ctx.projectPrefix}-db`;
  r.startSpinner(`Waiting for database (${db})`);
  let ready = false;
  for (let i = 0; i < 120; i += 1) {
    const res = capture("docker", ["inspect", "--format={{.State.Health.Status}}", db]);
    if (res.status === 0 && res.stdout.trim() === "healthy") {
      ready = true;
      break;
    }
    await sleep(1e3);
  }
  if (!ready) {
    r.failSpinner("Database did not become healthy");
    throw new CliError(`Database ${db} not healthy after 120s`, "Run './dev start' and check 'docker compose ps'.");
  }
  r.stopSpinner("Database ready");
  for (const svc of getAppServices()) {
    const dbName = svc;
    r.step(`Migrating ${svc} (db: ${dbName})`);
    const exists = capture("docker", [
      "exec",
      db,
      "psql",
      "-U",
      "postgres",
      "-tc",
      `SELECT 1 FROM pg_database WHERE datname='${dbName}'`
    ]);
    if (exists.status === 0 && /\b1\b/.test(exists.stdout)) {
      r.substep(`Database '${dbName}' already exists.`);
    } else {
      const created = capture("docker", ["exec", db, "psql", "-U", "postgres", "-c", `CREATE DATABASE "${dbName}";`]);
      if (created.status === 0) {
        r.substep(`Created database '${dbName}'.`);
      } else {
        r.warn(`Could not create database '${dbName}' (continuing).`);
      }
    }
    const schemaScript = path3.join(serviceDir(svc), "scripts", "apply-schema.sh");
    if (fs4.existsSync(schemaScript)) {
      r.startSpinner(`Applying schema for ${svc}`);
      const url = `postgres://postgres:postgres@localhost:5432/${dbName}?sslmode=disable`;
      const applied = run("bash", ["scripts/apply-schema.sh"], {
        cwd: serviceDir(svc),
        env: { ...process.env, DATABASE_URL: url }
      });
      if (applied === 0) {
        r.stopSpinner(`Schema applied for ${svc}`);
      } else {
        r.failSpinner(`Schema failed for ${svc}`);
        throw new CliError(`apply-schema.sh failed for ${svc}`, "Check the schema script and database connectivity.");
      }
    } else {
      r.substep(`No apply-schema.sh for ${svc}; database created only.`);
    }
  }
  r.success("Migrations complete.");
  return 0;
}
function composeServiceExists(name) {
  const res = dockerComposeCapture(["config", "--services"]);
  if (res.status !== 0) return false;
  return res.stdout.split("\n").map((s) => s.trim()).includes(name);
}
async function logs(ctx) {
  const { r } = ctx;
  const follow = ctx.args.includes("--follow") || ctx.args.includes("-f");
  const target = ctx.args.find((a) => !a.startsWith("-"));
  if (target) {
    const f = logFile(target);
    if (fs4.existsSync(f)) {
      if (follow) {
        if (!r.painter.caps.isTTY) {
          throw new CliError(
            "logs --follow requires an interactive terminal",
            `Omit --follow to print recent logs, or read .dev/logs/${target}.log directly.`
          );
        }
        r.info(`Streaming logs: ${target} (Ctrl+C to stop)...`);
        return run("tail", ["-f", f]);
      }
      const tail = fs4.readFileSync(f, "utf8").split("\n").slice(-40).join("\n");
      r.step(`${target} (last 40 lines)`);
      process.stdout.write(tail + "\n");
      return 0;
    }
    if (composeServiceExists(target)) {
      if (follow) {
        if (!r.painter.caps.isTTY) {
          throw new CliError(
            "logs --follow requires an interactive terminal",
            "Omit --follow to print recent logs and exit."
          );
        }
        return dockerComposeRun(["logs", "-f", target]);
      }
      return dockerComposeRun(["logs", "--tail", "40", target]);
    }
    throw new CliError(`Unknown service: ${target}`, "Run './dev status' to list known services.");
  }
  if (!follow) {
    for (const svc of [...getAppServices(), ...ctx.runners.map((x) => x.name)]) {
      const f = logFile(svc);
      if (fs4.existsSync(f)) {
        const lines = fs4.readFileSync(f, "utf8").split("\n");
        const tail = lines.slice(-40).join("\n");
        r.step(`${svc} (last 40 lines)`);
        process.stdout.write(tail + "\n");
      }
    }
    dockerComposeRun(["logs", "--tail", "40"]);
    return 0;
  }
  if (!r.painter.caps.isTTY) {
    throw new CliError("logs --follow requires an interactive terminal", "Omit --follow to print recent logs and exit, or read .dev/logs/*.log directly.");
  }
  r.info("Streaming logs (Ctrl+C to stop)...");
  return dockerComposeRun(["logs", "-f"]);
}
function collectStatus(runners) {
  const composePs = dockerComposeCapture(["ps", "--format", "{{.Service}}|{{.Status}}|{{.Ports}}"]);
  const docker = composePs.stdout.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
    const [service = "", stat = "", ports = ""] = l.split("|");
    return { service, status: stat, ports };
  });
  const native = [];
  for (const svc of getAppServices()) {
    if (isRunning(svc)) native.push({ service: svc, status: "running", pid: readPid(svc) });
  }
  for (const runner of runners) {
    if (isRunning(runner.name)) native.push({ service: runner.name, status: "running", pid: readPid(runner.name) });
  }
  return { docker, native };
}
function renderStatusTables(r, data, runners) {
  r.table(
    "Docker Containers",
    data.docker.map((d) => {
      const ports = d.ports.length > 15 ? d.ports.slice(0, 12) + "..." : d.ports;
      return [d.service, d.status, ports];
    })
  );
  const nativeRows = [];
  const running = new Set(data.native.map((n) => n.service));
  for (const n of data.native) nativeRows.push([n.service, `PID ${n.pid}`, "native"]);
  for (const svc of getAppServices()) {
    if (!running.has(svc) && isDead(svc)) nativeRows.push([svc, "dead", "native"]);
  }
  for (const runner of runners) {
    if (running.has(runner.name)) continue;
    const label = runner.kind ?? "runner";
    if (isDead(runner.name)) nativeRows.push([runner.name, "dead", label]);
    else if (runner.autostart === false) nativeRows.push([runner.name, "not started", label]);
    else nativeRows.push([runner.name, "stopped", label]);
  }
  r.table("Native Processes", nativeRows);
}
async function status(ctx) {
  const { r } = ctx;
  const json = ctx.json || ctx.args.includes("--json");
  const watch = ctx.args.includes("--watch");
  if (json) {
    const data = collectStatus(ctx.runners);
    const runners = ctx.runners.map((rn) => ({
      name: rn.name,
      kind: rn.kind ?? null,
      state: isRunning(rn.name) ? "running" : isDead(rn.name) ? "dead" : "stopped",
      pid: isRunning(rn.name) ? readPid(rn.name) : null,
      autostart: rn.autostart !== false
    }));
    process.stdout.write(JSON.stringify({ ...data, runners }, null, 2) + "\n");
    return 0;
  }
  if (watch && r.painter.caps.isTTY) {
    return watchStatus(ctx);
  }
  if (watch && !r.painter.caps.isTTY) {
    r.info("--watch requires an interactive terminal; printing a single snapshot.");
  }
  const ro = r.asStream(process.stdout);
  ro.logo("Local Status");
  renderStatusTables(ro, collectStatus(ctx.runners), ctx.runners);
  return 0;
}
async function watchStatus(ctx) {
  const { r } = ctx;
  const readline2 = await import("readline");
  const out = process.stderr;
  out.write("\x1B[?1049h");
  out.write("\x1B[?25l");
  readline2.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  process.stdin.resume();
  let stop2 = false;
  const restore = () => {
    if (process.stdin.isTTY) process.stdin.setRawMode(false);
    process.stdin.pause();
    out.write("\x1B[?25h");
    out.write("\x1B[?1049l");
  };
  const onKey = (_s, key) => {
    if (key.name === "q" || key.ctrl && key.name === "c") stop2 = true;
  };
  process.stdin.on("keypress", onKey);
  try {
    while (!stop2) {
      out.write("\x1B[2J\x1B[H");
      r.logo("Live Status");
      renderStatusTables(r, collectStatus(ctx.runners), ctx.runners);
      out.write(`
  ${r.painter.dim("Refreshing every 2s \u2014 press q or Ctrl+C to exit")}
`);
      for (let i = 0; i < 20 && !stop2; i += 1) await sleep(100);
    }
  } finally {
    process.stdin.removeListener("keypress", onKey);
    restore();
  }
  return 0;
}

// src/generators/workspace-dev-cli/cli-src/src/commands/quality.ts
var fs5 = __toESM(require("fs"));
var path4 = __toESM(require("path"));
function hasSystemTests() {
  return fs5.existsSync(path4.join(TESTS_DIR, "system"));
}
async function test(ctx) {
  const { r } = ctx;
  const positional = ctx.args.filter((a) => !a.startsWith("-"));
  const keep = ctx.args.includes("--keep");
  const integrationFlag = ctx.args.includes("--integration");
  const mode = positional[0];
  if (!hasSystemTests()) {
    r.logo("Tests");
    r.info("No system tests found.");
    return 0;
  }
  if (mode === "integration") {
    r.logo("Running Integration Tests");
    await start(ctx);
    await migrate(ctx);
    r.step("Running System Tests (pytest, REQUIRE_* enabled)");
    const code2 = run("uv", ["run", "pytest", "system/"], {
      cwd: TESTS_DIR,
      env: { ...process.env, GROUNDWORK_REQUIRE_SERVICES: "1", GROUNDWORK_REQUIRE_TRACES: "1" }
    });
    if (!keep) await stop(ctx);
    if (code2 !== 0) throw new CliError("Integration tests failed", "Inspect the pytest output above.");
    r.success("Integration tests passed.");
    return 0;
  }
  if (mode === "bet") {
    const slug = positional[1];
    if (!slug) throw new CliError("Usage: ./dev test bet <slug>");
    const betDir = path4.join(TESTS_DIR, "bets", slug);
    if (!fs5.existsSync(betDir)) throw new CliError(`Bet suite not found: tests/bets/${slug}`);
    if (integrationFlag) {
      r.logo(`Running Bet Integration Tests \u2014 ${slug}`);
      await start(ctx);
      await migrate(ctx);
      const usesPlaywright = fs5.readdirSync(betDir).filter((f) => f.endsWith(".py")).some((f) => /playwright/.test(fs5.readFileSync(path4.join(betDir, f), "utf8")));
      if (usesPlaywright) {
        r.step("Installing Playwright browser (chromium)");
        run("uv", ["run", "playwright", "install", "chromium"], { cwd: TESTS_DIR });
      }
      r.step(`Running bet-progress suite: bets/${slug}/ (REQUIRE_SERVICES enabled)`);
      const code3 = run("uv", ["run", "pytest", `bets/${slug}/`], {
        cwd: TESTS_DIR,
        env: { ...process.env, GROUNDWORK_REQUIRE_SERVICES: "1" }
      });
      if (!keep) await stop(ctx);
      if (code3 !== 0) throw new CliError(`Bet integration tests failed: ${slug}`);
      r.success(`Bet integration tests passed: ${slug}`);
      return 0;
    }
    r.logo(`Running Bet Tests \u2014 ${slug}`);
    r.step(`Running bet-progress suite: bets/${slug}/`);
    const code2 = run("uv", ["run", "pytest", `bets/${slug}/`], { cwd: TESTS_DIR });
    if (code2 === 0) r.success(`Bet tests passed: ${slug}`);
    return code2;
  }
  r.logo("Running Tests");
  r.step("Running System Tests (pytest)");
  const code = run("uv", ["run", "pytest", "system/"], { cwd: TESTS_DIR });
  if (code === 0) r.success("Tests passed.");
  return code;
}
async function lint(ctx) {
  const { r } = ctx;
  r.logo("Running Linters");
  let last = 0;
  for (const svc of getAppServices()) {
    const dir = serviceDir(svc);
    const type = detectType(svc);
    if (type === "go" || fs5.existsSync(path4.join(dir, ".golangci.yml"))) {
      r.step(`Linting Go service: ${svc}`);
      if (commandExists("golangci-lint")) {
        const code = run("golangci-lint", ["run"], { cwd: dir });
        if (code !== 0) last = code;
      } else {
        r.warn("golangci-lint not installed \u2014 skipping. Install: https://golangci-lint.run");
      }
    } else if (type === "node") {
      r.step(`Linting Next.js service: ${svc}`);
      if (commandExists("npm")) {
        const code = run("npm", ["run", "lint"], { cwd: dir });
        if (code !== 0) last = code;
      } else {
        r.warn("npm not installed \u2014 skipping. Install Node.js (includes npm).");
      }
    } else if (type === "python") {
      r.step(`Linting Python service: ${svc}`);
      if (commandExists("uv")) {
        const ruff = run("uv", ["run", "ruff", "check", "."], { cwd: dir });
        const black = run("uv", ["run", "black", "--check", "."], { cwd: dir });
        if (ruff !== 0) last = ruff;
        if (black !== 0) last = black;
      } else {
        r.warn("uv not installed \u2014 skipping ruff/black. Install: https://docs.astral.sh/uv");
      }
    }
  }
  r.success("Linting complete.");
  return last;
}

// src/generators/workspace-dev-cli/cli-src/src/commands/doctor.ts
var fs7 = __toESM(require("fs"));
var path6 = __toESM(require("path"));

// src/generators/workspace-dev-cli/cli-src/src/util/version.ts
var fs6 = __toESM(require("fs"));
var path5 = __toESM(require("path"));
var DEV_CLI_VERSION = "0.10.0";
function stampedFrameworkVersion() {
  try {
    const state = JSON.parse(
      fs6.readFileSync(path5.join(ROOT, ".groundwork", "config", "state.json"), "utf8")
    );
    return state.groundwork && state.groundwork.version || null;
  } catch {
    return null;
  }
}

// src/generators/workspace-dev-cli/cli-src/src/commands/doctor.ts
async function doctor(ctx) {
  const { r } = ctx;
  const json = ctx.json || ctx.args.includes("--json");
  const checks = [];
  checks.push({ name: "docker", ok: commandExists("docker"), hint: "Install Docker Desktop or the docker engine." });
  const compose = capture("docker", ["compose", "version"]);
  checks.push({ name: "docker compose", ok: compose.status === 0, hint: "Install the Docker Compose v2 plugin." });
  let needsNode = false;
  let needsGo = false;
  let needsAir = false;
  let needsPython = false;
  for (const svc of getAppServices()) {
    const dir = serviceDir(svc);
    if (fs7.existsSync(path6.join(dir, "package.json"))) needsNode = true;
    if (fs7.existsSync(path6.join(dir, "go.mod"))) needsGo = true;
    if (fs7.existsSync(path6.join(dir, ".air.toml"))) needsAir = true;
    if (fs7.existsSync(path6.join(dir, "pyproject.toml"))) needsPython = true;
  }
  if (needsNode) checks.push({ name: "npm", ok: commandExists("npm"), hint: "Install Node.js (includes npm)." });
  if (needsGo) checks.push({ name: "go", ok: commandExists("go"), hint: "Install the Go toolchain." });
  if (needsAir) checks.push({ name: "air", ok: commandExists("air"), hint: "go install github.com/air-verse/air@latest" });
  if (needsPython)
    checks.push({
      name: "python",
      ok: commandExists("python3") || commandExists("python"),
      hint: "Install Python 3."
    });
  const stamp = stampedFrameworkVersion();
  if (stamp && DEV_CLI_VERSION !== "unknown") {
    checks.push({
      name: "dev bundle version",
      ok: stamp === DEV_CLI_VERSION,
      hint: `bundle ${DEV_CLI_VERSION} trails framework ${stamp} \u2014 run npx groundwork-method update, then groundwork check for the full staleness report.`
    });
  }
  const cfg = dockerComposeCapture(["config", "--services"]);
  const composeServices = new Set(
    cfg.status === 0 ? cfg.stdout.split("\n").map((s) => s.trim()).filter(Boolean) : []
  );
  const stackUp = dockerComposeCapture(["ps", "-q"]).stdout.trim().length > 0;
  const hasServices = getAppServices().length > 0;
  const connectivity = [];
  if (hasServices && !stackUp) {
    connectivity.push({ name: "stack", ok: false, hint: "down \u2014 run './dev start' (or './dev start --docker')." });
  }
  if (composeServices.has("db")) {
    const ok = stackUp && dockerComposeCapture(["exec", "-T", "db", "pg_isready", "-U", "postgres"]).status === 0;
    connectivity.push({ name: "postgres (:5432)", ok, hint: ok ? void 0 : "db not accepting connections." });
  }
  if (composeServices.has("redis")) {
    const ping = stackUp ? dockerComposeCapture(["exec", "-T", "redis", "redis-cli", "ping"]) : null;
    const ok = ping !== null && /PONG/i.test(ping.stdout);
    connectivity.push({ name: "redis (:6379)", ok, hint: ok ? void 0 : "no PONG from redis." });
  }
  if (composeServices.has("jaeger")) {
    const code = await httpProbe("http://localhost:16686/api/services");
    const ok = code === 200;
    connectivity.push({ name: "jaeger (:16686)", ok, hint: ok ? void 0 : `query API returned ${code}.` });
  }
  const tooling = [];
  if (needsPython) {
    const ok = commandExists("go");
    tooling.push({
      name: "go (pg-schema-diff)",
      ok,
      hint: ok ? void 0 : "Python './dev migrate' needs the Go toolchain."
    });
  }
  const depMissing = checks.filter((c) => !c.ok);
  const runtimeMissing = [...connectivity, ...tooling].filter((c) => !c.ok);
  const exitCode = runtimeMissing.length > 0 ? 1 : 0;
  if (json) {
    const allChecks = [...checks, ...connectivity, ...tooling];
    process.stdout.write(
      JSON.stringify({ ok: allChecks.every((c) => c.ok), checks: allChecks }, null, 2) + "\n"
    );
    return exitCode;
  }
  r.logo("Environment Verification (Doctor)");
  r.table(
    "Dependencies",
    checks.map((c) => [c.name, c.ok ? "ok" : "MISSING", c.ok ? "" : c.hint ?? ""])
  );
  r.table(
    "Runtime Connectivity",
    connectivity.map((c) => [c.name, c.ok ? "ok" : "FAIL", c.ok ? "" : c.hint ?? ""])
  );
  if (tooling.length > 0) {
    r.table(
      "Migration Tooling",
      tooling.map((c) => [c.name, c.ok ? "ok" : "MISSING", c.ok ? "" : c.hint ?? ""])
    );
  }
  const allMissing = [...depMissing, ...runtimeMissing];
  if (allMissing.length === 0) {
    r.success("Your environment is ready!");
  } else {
    r.errorCard(
      `Found ${allMissing.length} issue(s).`,
      allMissing.map((c) => `${c.name}: ${c.hint ?? ""}`).join("  ")
    );
  }
  return exitCode;
}

// src/generators/workspace-dev-cli/cli-src/src/commands/bet.ts
var fs8 = __toESM(require("fs"));
var path7 = __toESM(require("path"));

// src/generators/workspace-dev-cli/cli-src/src/util/prompt.ts
var readline = __toESM(require("readline"));
function isInteractive() {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}
function selectPrompt(painter, message, choices) {
  return new Promise((resolve, reject) => {
    let index = 0;
    const out = process.stderr;
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    out.write("\x1B[?25l");
    const render = (first) => {
      if (!first) out.write(`\x1B[${choices.length + 1}A`);
      out.write(`\x1B[2K  ${painter.bold(message)}
`);
      choices.forEach((c, i) => {
        const active = i === index;
        const marker = active ? painter.primary("\u276F") : " ";
        const label = active ? painter.primary(c.label) : c.label;
        const hint = c.hint ? painter.dim(`  ${c.hint}`) : "";
        out.write(`\x1B[2K  ${marker} ${label}${hint}
`);
      });
    };
    const cleanup = () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeListener("keypress", onKey);
      out.write("\x1B[?25h");
    };
    const onKey = (_str, key) => {
      if (key.ctrl && key.name === "c") {
        cleanup();
        process.exit(130);
      } else if (key.name === "up" || key.name === "k") {
        index = (index - 1 + choices.length) % choices.length;
        render(false);
      } else if (key.name === "down" || key.name === "j") {
        index = (index + 1) % choices.length;
        render(false);
      } else if (key.name === "return" || key.name === "enter") {
        cleanup();
        resolve(choices[index].value);
      }
    };
    render(true);
    process.stdin.on("keypress", onKey);
    process.stdin.on("error", (e) => {
      cleanup();
      reject(e);
    });
  });
}
function textPrompt(painter, message, validate) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stderr });
  const ask = () => new Promise((resolve) => {
    rl.question(`  ${painter.bold(message)} `, (answer) => resolve(answer.trim()));
  });
  return (async () => {
    try {
      for (; ; ) {
        const value = await ask();
        const err = validate ? validate(value) : null;
        if (!err) {
          rl.close();
          return value;
        }
        process.stderr.write(`  ${painter.paint("error", "\u2716")} ${err}
`);
      }
    } catch (e) {
      rl.close();
      throw e;
    }
  })();
}

// src/generators/workspace-dev-cli/cli-src/src/commands/bet.ts
var SLUG_RE = /^([a-z][a-z0-9-]*[a-z0-9]|[a-z0-9])$/;
var SLUG_HINT = "Use lowercase kebab-case: letters, digits, and single hyphens, no leading/trailing hyphen.";
function validateSlug(slug, label) {
  if (!SLUG_RE.test(slug)) {
    throw new CliError(`Invalid ${label}: "${slug}"`, SLUG_HINT);
  }
}
var slugValidator = (v) => SLUG_RE.test(v) ? null : SLUG_HINT;
function existingBetSlugs() {
  const dir = path7.join(TESTS_DIR, "bets");
  if (!fs8.existsSync(dir)) return [];
  return fs8.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory() && d.name !== "_archive").map((d) => d.name).sort();
}
async function resolveBetSlug(ctx, given) {
  if (given || !isInteractive()) return given;
  const existing = existingBetSlugs();
  if (existing.length > 0) {
    const choices = [
      ...existing.map((s) => ({ label: s, value: s })),
      { label: "+ new bet\u2026", value: "\0new" }
    ];
    const picked = await selectPrompt(ctx.r.painter, "Which bet?", choices);
    if (picked !== "\0new") return picked;
  }
  return textPrompt(ctx.r.painter, "Bet slug:", slugValidator);
}
function templatePath(name) {
  return path7.join(ROOT, "scripts", "cli", "templates", name);
}
function nextIndex(betDir, prefix) {
  if (!fs8.existsSync(betDir)) return 1;
  const count = fs8.readdirSync(betDir).filter((f) => f.startsWith(prefix) && f.endsWith(".py")).length;
  return count + 1;
}
function substitute(template, tokens) {
  let out = template;
  for (const [k, v] of Object.entries(tokens)) {
    out = out.split(`@@${k}@@`).join(v);
  }
  return out;
}
async function newCmd(ctx) {
  let noun = ctx.args[0];
  if (!noun && isInteractive()) {
    noun = await selectPrompt(ctx.r.painter, "What do you want to scaffold?", [
      { label: "bet", value: "bet", hint: "docs + tests directories for a new bet" },
      { label: "milestone", value: "milestone", hint: "a red milestone test stub" },
      { label: "slice", value: "slice", hint: "a red slice test stub" }
    ]);
  }
  switch (noun) {
    case "bet":
      return newBet(ctx);
    case "milestone":
      return newMilestone(ctx);
    case "slice":
      return newSlice(ctx);
    default:
      throw new CliError("Usage: ./dev new bet|milestone|slice ...");
  }
}
async function newBet(ctx) {
  const { r } = ctx;
  let slug = ctx.args[1];
  if (!slug && isInteractive()) slug = await textPrompt(r.painter, "Bet slug:", slugValidator);
  if (!slug) throw new CliError("Usage: ./dev new bet <slug>");
  validateSlug(slug, "bet slug");
  r.logo("New Bet");
  r.step(`Scaffolding bet: ${slug}`);
  fs8.mkdirSync(path7.join(DOCS_DIR, "bets", slug), { recursive: true });
  fs8.mkdirSync(path7.join(TESTS_DIR, "bets", slug), { recursive: true });
  r.success(`Created docs/bets/${slug}/ and tests/bets/${slug}/`);
  r.info(`Next: ./dev new milestone ${slug} <milestone-slug>`);
  return 0;
}
async function newMilestone(ctx) {
  const { r } = ctx;
  const betSlug = await resolveBetSlug(ctx, ctx.args[1]);
  let milestoneSlug = ctx.args[2];
  if (!milestoneSlug && isInteractive()) milestoneSlug = await textPrompt(r.painter, "Milestone slug:", slugValidator);
  if (!betSlug || !milestoneSlug) throw new CliError("Usage: ./dev new milestone <bet-slug> <milestone-slug>");
  validateSlug(betSlug, "bet slug");
  validateSlug(milestoneSlug, "milestone slug");
  const betDir = path7.join(TESTS_DIR, "bets", betSlug);
  if (!fs8.existsSync(betDir)) throw new CliError(`Bet not found: tests/bets/${betSlug}`, `Run: ./dev new bet ${betSlug}`);
  const n = nextIndex(betDir, "test_milestone_");
  const template = fs8.readFileSync(templatePath("milestone-test.pytmpl"), "utf8");
  const content = substitute(template, { BET: betSlug, MILESTONE: milestoneSlug, N: String(n) });
  const file = path7.join(betDir, `test_milestone_${n}_${milestoneSlug}.py`);
  fs8.writeFileSync(file, content);
  r.logo("New Milestone");
  r.success(`Created tests/bets/${betSlug}/test_milestone_${n}_${milestoneSlug}.py (RED)`);
  r.info("Fill in the target-state assertions before starting Delivery.");
  return 0;
}
async function newSlice(ctx) {
  const { r } = ctx;
  const betSlug = await resolveBetSlug(ctx, ctx.args[1]);
  let milestoneSlug = ctx.args[2];
  if (!milestoneSlug && isInteractive()) milestoneSlug = await textPrompt(r.painter, "Milestone slug:", slugValidator);
  let service = ctx.args[3];
  if (!service && isInteractive()) {
    const svcs = getAppServices();
    service = svcs.length ? await selectPrompt(r.painter, "Which service?", svcs.map((s) => ({ label: s, value: s }))) : await textPrompt(r.painter, "Service name:");
  }
  let sliceSlug = ctx.args[4];
  if (!sliceSlug && isInteractive()) sliceSlug = await textPrompt(r.painter, "Slice slug:", slugValidator);
  if (!betSlug || !milestoneSlug || !service || !sliceSlug)
    throw new CliError("Usage: ./dev new slice <bet-slug> <milestone-slug> <service> <slice-slug>");
  validateSlug(betSlug, "bet slug");
  validateSlug(milestoneSlug, "milestone slug");
  validateSlug(sliceSlug, "slice slug");
  const betDir = path7.join(TESTS_DIR, "bets", betSlug);
  if (!fs8.existsSync(betDir)) throw new CliError(`Bet not found: tests/bets/${betSlug}`, `Run: ./dev new bet ${betSlug}`);
  const n = nextIndex(betDir, "test_slice_");
  const template = fs8.readFileSync(templatePath("slice-test.pytmpl"), "utf8");
  const content = substitute(template, {
    BET: betSlug,
    MILESTONE: milestoneSlug,
    SERVICE: service,
    SLUG: sliceSlug,
    N: String(n)
  });
  const file = path7.join(betDir, `test_slice_${n}_${service}_${sliceSlug}.py`);
  fs8.writeFileSync(file, content);
  r.logo("New Slice");
  r.success(`Created tests/bets/${betSlug}/test_slice_${n}_${service}_${sliceSlug}.py (RED)`);
  r.info("Fill in the falsifiable capability assertions before starting Delivery.");
  return 0;
}
function archiveMove(rel, src, dest, inGit) {
  fs8.mkdirSync(path7.dirname(dest), { recursive: true });
  const destRel = path7.relative(ROOT, dest);
  if (inGit) {
    const moved = capture("git", ["-C", ROOT, "mv", rel, destRel]);
    if (moved.status !== 0) throw new CliError(`git mv failed: ${rel} \u2192 ${destRel}`, moved.stderr.trim());
  } else {
    fs8.renameSync(src, dest);
  }
}
function ensureArchiveMeta(archiveDir) {
  const metaPath = path7.join(archiveDir, "meta.json");
  if (fs8.existsSync(metaPath)) return;
  fs8.mkdirSync(archiveDir, { recursive: true });
  fs8.writeFileSync(metaPath, JSON.stringify({ defaultOpen: false, pages: ["..."] }, null, 2) + "\n");
}
async function archive(ctx) {
  const { r } = ctx;
  if (ctx.args[0] !== "bet") throw new CliError("Usage: ./dev archive bet <slug>");
  const slug = ctx.args[1];
  if (!slug) throw new CliError("Usage: ./dev archive bet <slug>");
  validateSlug(slug, "bet slug");
  const testsSrc = path7.join(TESTS_DIR, "bets", slug);
  const testsDest = path7.join(TESTS_DIR, "bets", "_archive", slug);
  const docsSrc = path7.join(DOCS_DIR, "bets", slug);
  const docsDest = path7.join(DOCS_DIR, "bets", "_archive", slug);
  if (!fs8.existsSync(testsSrc) && !fs8.existsSync(docsSrc)) {
    throw new CliError(`Bet not found: ${slug}`, `Expected tests/bets/${slug}/ or docs/bets/${slug}/.`);
  }
  if (fs8.existsSync(testsDest)) throw new CliError(`Archive already exists: tests/bets/_archive/${slug}`);
  if (fs8.existsSync(docsDest)) throw new CliError(`Archive already exists: docs/bets/_archive/${slug}`);
  r.logo("Archive Bet");
  const inGit = capture("git", ["-C", ROOT, "rev-parse", "--is-inside-work-tree"]).status === 0;
  if (fs8.existsSync(testsSrc)) {
    r.step(`Archiving tests/bets/${slug} \u2192 tests/bets/_archive/${slug}`);
    archiveMove(`tests/bets/${slug}`, testsSrc, testsDest, inGit);
    r.success(`Archived suite to tests/bets/_archive/${slug}`);
  } else {
    r.warn(`No suite at tests/bets/${slug} \u2014 skipping.`);
  }
  if (fs8.existsSync(docsSrc)) {
    r.step(`Archiving docs/bets/${slug} \u2192 docs/bets/_archive/${slug}`);
    archiveMove(`docs/bets/${slug}`, docsSrc, docsDest, inGit);
    ensureArchiveMeta(path7.join(DOCS_DIR, "bets", "_archive"));
    r.success(`Archived docs to docs/bets/_archive/${slug}`);
  } else {
    r.warn(`No docs at docs/bets/${slug} \u2014 skipping.`);
  }
  r.info("Permanent best-practice tests remain in place and cover the feature going forward.");
  return 0;
}
var MILESTONE_RE = /^test_milestone_(\d+)_(.+)\.[^.]+$/;
var SLICE_RE = /^test_slice_(\d+)_(.+)_([a-z0-9][a-z0-9-]*)\.[^.]+$/;
function suiteTestFiles(betDir) {
  if (!fs8.existsSync(betDir)) return [];
  return fs8.readdirSync(betDir, { withFileTypes: true }).filter((d) => d.isFile() && (MILESTONE_RE.test(d.name) || SLICE_RE.test(d.name))).map((d) => d.name).sort();
}
function runSuiteVerdicts(slug) {
  const byFile = /* @__PURE__ */ new Map();
  if (!commandExists("uv")) return { ran: false, byFile };
  const res = capture("uv", ["run", "pytest", `bets/${slug}/`, "-v", "--tb=no", "--color=no", "-p", "no:cacheprovider"], {
    cwd: TESTS_DIR
  });
  const tally = /* @__PURE__ */ new Map();
  const line = /(?:^|\/)(test_(?:milestone|slice)_\d+_[^/:]+\.[A-Za-z0-9]+)::\S+\s+(PASSED|FAILED|ERROR|XFAIL|XPASS|SKIPPED)/g;
  for (const m of res.stdout.matchAll(line)) {
    const file = m[1];
    const outcome = m[2];
    const t = tally.get(file) ?? { passed: 0, failed: 0 };
    if (outcome === "PASSED" || outcome === "XFAIL") t.passed += 1;
    else if (outcome === "FAILED" || outcome === "ERROR" || outcome === "XPASS") t.failed += 1;
    tally.set(file, t);
  }
  for (const [file, t] of tally) {
    byFile.set(file, t.failed > 0 ? "red" : t.passed > 0 ? "green" : "red");
  }
  return { ran: true, byFile };
}
function deriveBoard(slug) {
  const betDir = path7.join(TESTS_DIR, "bets", slug);
  const files = suiteTestFiles(betDir);
  const { ran, byFile } = files.length > 0 ? runSuiteVerdicts(slug) : { ran: false, byFile: /* @__PURE__ */ new Map() };
  const rows = files.map((file) => {
    const verdict = byFile.get(file) ?? (ran ? "red" : "unknown");
    const mm = MILESTONE_RE.exec(file);
    if (mm) {
      return { kind: "milestone", file, n: Number(mm[1]), service: null, slug: mm[2], state: verdict };
    }
    const sm = SLICE_RE.exec(file);
    return { kind: "slice", file, n: Number(sm[1]), service: sm[2], slug: sm[3], state: verdict };
  });
  const order = { milestone: 0, slice: 1 };
  rows.sort((a, b) => order[a.kind] - order[b.kind] || a.n - b.n);
  return { ran, rows };
}
async function betCmd(ctx) {
  const noun = ctx.args.filter((a) => !a.startsWith("-"))[0];
  switch (noun ?? "status") {
    case "status":
      return status2(ctx);
    default:
      throw new CliError("Usage: ./dev bet status [<slug>] [--json]");
  }
}
function boardGlyph(p, state) {
  const u = p.caps.unicode;
  if (state === "green") return p.paint("success", u ? "\u25CF" : "*");
  if (state === "red") return p.paint("error", u ? "\u2717" : "x");
  return p.dim(u ? "\u25CB" : "o");
}
function stateLabel(state) {
  return state === "green" ? "passing" : state === "red" ? "failing" : "not run";
}
async function status2(ctx) {
  const { r } = ctx;
  const json = ctx.json || ctx.args.includes("--json");
  const positional = ctx.args.filter((a) => !a.startsWith("-"));
  const slug = positional[1];
  if (!slug) return statusAll(ctx, json);
  validateSlug(slug, "bet slug");
  const betDir = path7.join(TESTS_DIR, "bets", slug);
  const files = suiteTestFiles(betDir);
  if (files.length === 0) {
    if (json) {
      process.stdout.write(JSON.stringify({ bet: slug, materialized: false, milestones: [], slices: [] }, null, 2) + "\n");
      return 0;
    }
    const ro2 = r.asStream(process.stdout);
    ro2.logo(`Bet Board \u2014 ${slug}`);
    ro2.info("No board yet \u2014 the bet suite is materialized RED at Delivery start.");
    ro2.info(`Once Delivery begins, ./dev bet status ${slug} renders red/green from the suite.`);
    return 0;
  }
  const { ran, rows } = deriveBoard(slug);
  const milestones = rows.filter((x) => x.kind === "milestone");
  const slices = rows.filter((x) => x.kind === "slice");
  const green = rows.filter((x) => x.state === "green").length;
  if (json) {
    process.stdout.write(
      JSON.stringify(
        {
          bet: slug,
          materialized: true,
          ran,
          milestones: milestones.map((m) => ({ n: m.n, slug: m.slug, file: m.file, state: m.state })),
          slices: slices.map((s) => ({ n: s.n, service: s.service, slug: s.slug, file: s.file, state: s.state })),
          summary: { green, total: rows.length }
        },
        null,
        2
      ) + "\n"
    );
    return 0;
  }
  const ro = r.asStream(process.stdout);
  ro.logo(`Bet Board \u2014 ${slug}`);
  if (!ran) {
    ro.warn("uv not found \u2014 cannot run the suite. Listing the materialized tests without a verdict.");
  }
  const mRows = milestones.map(
    (m) => [`${boardGlyph(ro.painter, m.state)} ${`M${m.n} ${m.slug}`.padEnd(26)}`, "", stateLabel(m.state)]
  );
  const sRows = slices.map(
    (s) => [`${boardGlyph(ro.painter, s.state)} ${`S${s.n} ${s.slug}`.padEnd(26)}`, s.service ?? "", stateLabel(s.state)]
  );
  ro.table("Milestones", mRows);
  ro.table("Slices", sRows);
  ro.success(`Board: ${green}/${rows.length} green (run ./dev test bet ${slug} for full output).`);
  return 0;
}
async function statusAll(ctx, json) {
  const { r } = ctx;
  const slugs = existingBetSlugs();
  const summaries = slugs.map((slug) => {
    const files = suiteTestFiles(path7.join(TESTS_DIR, "bets", slug));
    if (files.length === 0) return { bet: slug, materialized: false, green: 0, total: 0 };
    const { rows } = deriveBoard(slug);
    return { bet: slug, materialized: true, green: rows.filter((x) => x.state === "green").length, total: rows.length };
  });
  if (json) {
    process.stdout.write(JSON.stringify(summaries, null, 2) + "\n");
    return 0;
  }
  const ro = r.asStream(process.stdout);
  ro.logo("Bet Board");
  if (summaries.length === 0) {
    ro.info("No bets found under tests/bets/.");
    ro.info("Start one with ./dev new bet <slug>.");
    return 0;
  }
  for (const s of summaries) {
    const line = s.materialized ? `${s.green}/${s.total} green` : "no suite yet \u2014 materialized at Delivery start";
    ro.cmd(s.bet, line);
  }
  ro.info("Run ./dev bet status <slug> for the full board.");
  return 0;
}

// src/generators/workspace-dev-cli/cli-src/src/commands/surface.ts
var fs9 = __toESM(require("fs"));
var path8 = __toESM(require("path"));
function readSurfacesFile() {
  if (!fs9.existsSync(GROUNDWORK_SURFACES_FILE)) return null;
  try {
    return JSON.parse(fs9.readFileSync(GROUNDWORK_SURFACES_FILE, "utf8"));
  } catch {
    throw new CliError(
      `Could not parse ${path8.relative(ROOT, GROUNDWORK_SURFACES_FILE)}`,
      "Fix or remove the malformed JSON file \u2014 docs/surfaces.md is its human twin."
    );
  }
}
function isRetired(s) {
  return s.status === "retired";
}
function cellGlyph(p, state) {
  const u = p.caps.unicode;
  if (state === "delivered") return p.paint("success", u ? "\u25CF" : "*");
  if (state === "planned") return p.paint("warning", u ? "\u25D0" : "~");
  if (state === "omitted") return p.dim(u ? "\u25CB" : "o");
  if (state === "n/a") return p.dim(u ? "\xB7" : ".");
  return p.paint("error", "!");
}
function backlogOf(surfaces, capabilities) {
  const backlog = {};
  for (const s of surfaces) {
    if (!isRetired(s)) backlog[s.slug] = 0;
  }
  for (const cap of capabilities) {
    for (const slug of Object.keys(backlog)) {
      if (cap.cells?.[slug]?.state === "planned") backlog[slug] += 1;
    }
  }
  return backlog;
}
function illegalCellsOf(surfaces, capabilities) {
  const states = /* @__PURE__ */ new Set(["delivered", "planned", "omitted", "n/a"]);
  const out = [];
  for (const cap of capabilities) {
    for (const s of surfaces) {
      const cell = cap.cells?.[s.slug];
      if (!cell || !cell.state || !states.has(cell.state)) {
        out.push(`${cap.key} \xD7 ${s.slug}`);
      }
    }
  }
  return out;
}
function padPlain(text, width) {
  return text.padEnd(width);
}
async function surfaceCmd(ctx) {
  const noun = ctx.args.filter((a) => !a.startsWith("-"))[0] ?? "status";
  switch (noun) {
    case "status":
      return status3(ctx);
    default:
      throw new CliError("Usage: ./dev surface status [--json]");
  }
}
async function status3(ctx) {
  const { r } = ctx;
  const json = ctx.json || ctx.args.includes("--json");
  const file = readSurfacesFile();
  const ro = r.asStream(process.stdout);
  if (!file) {
    if (json) {
      process.stdout.write(JSON.stringify({ present: false }, null, 2) + "\n");
      return 0;
    }
    ro.info("No surface registry (.groundwork/surfaces.json) \u2014 the groundwork-surface-activation skill bootstraps it.");
    return 0;
  }
  const surfaces = (file.surfaces ?? []).filter((s) => Boolean(s.slug));
  const capabilities = (file.capabilities ?? []).filter((c) => Boolean(c.key));
  const backlog = backlogOf(surfaces, capabilities);
  const illegalCells = illegalCellsOf(surfaces, capabilities);
  if (json) {
    process.stdout.write(
      JSON.stringify({ present: true, core: file.core ?? null, surfaces, capabilities, backlog, illegalCells }, null, 2) + "\n"
    );
    return 0;
  }
  const p = ro.painter;
  ro.logo("Surface Board");
  ro.table(
    "Surface Registry",
    surfaces.map((s) => {
      const slug = isRetired(s) ? p.dim(padPlain(`${s.slug} (retired)`, 28)) : padPlain(s.slug, 28);
      const shape = `${s.type ?? "?"} \xB7 ${s.platform ?? "?"}`;
      const detail = `${s.status ?? "?"} \xB7 ${s.scaffold ?? "?"} \xB7 ${s.testMedium ?? "\u2014"}`;
      return [slug, shape, detail];
    })
  );
  if (surfaces.length === 0) {
    ro.info("Registry is empty \u2014 a headless core is legal; its contracts stand alone.");
  }
  if (capabilities.length === 0) {
    ro.info("Capability ledger is empty \u2014 bet validation appends capability rows when bets close.");
  } else {
    const keyWidth = Math.max(...capabilities.map((c) => c.key.length), "capability".length) + 2;
    const colWidth = (s) => (isRetired(s) ? s.slug.length + " (retired)".length : s.slug.length) + 2;
    const header = p.dim(padPlain("capability", keyWidth)) + surfaces.map((s) => isRetired(s) ? p.dim(padPlain(`${s.slug} (retired)`, colWidth(s))) : padPlain(s.slug, colWidth(s))).join("");
    const rows = [[header, "", ""]];
    for (const cap of capabilities) {
      const line = padPlain(cap.key, keyWidth) + surfaces.map((s) => cellGlyph(p, cap.cells?.[s.slug]?.state) + " ".repeat(colWidth(s) - 1)).join("");
      rows.push([line, "", ""]);
    }
    ro.table("Capability Ledger", rows);
    const u = p.caps.unicode;
    ro.info(
      `${cellGlyph(p, "delivered")} delivered  ${cellGlyph(p, "planned")} planned  ${cellGlyph(p, "omitted")} omitted  ${cellGlyph(p, "n/a")} n/a  ${p.paint("error", "!")} empty ${u ? "\u2014" : "-"} illegal`
    );
  }
  for (const cell of illegalCells) {
    ro.error(`Empty ledger cell: ${cell} \u2014 illegal state; bet validation fills every column or the bet does not close.`);
  }
  const entries = Object.entries(backlog);
  if (entries.length > 0 && capabilities.length > 0) {
    ro.step("Sync backlog (planned cells)");
    for (const [slug, count] of entries) {
      ro.cmd(slug, count === 0 ? "in sync \u2014 no planned cells" : `${count} planned cell${count === 1 ? "" : "s"}`);
    }
    const total = entries.reduce((acc, [, n]) => acc + n, 0);
    if (total === 0 && illegalCells.length === 0) {
      ro.success("All surfaces in sync \u2014 every ledger decision is on record.");
    }
  }
  return 0;
}

// src/generators/workspace-dev-cli/cli-src/src/commands/completion.ts
async function completion(ctx) {
  const shell = ctx.args[0];
  const commands = ctx.commands;
  const verbs = commands.map((c) => c.name);
  const nounsByVerb = commands.filter((c) => c.nouns?.length).map((c) => ({ verb: c.name, nouns: c.nouns }));
  const flagsByVerb = commands.filter((c) => c.flags?.length).map((c) => ({
    verb: c.name,
    flags: c.flags.map((f) => f.name)
  }));
  if (shell === "bash") {
    process.stdout.write(bashScript(verbs, nounsByVerb, flagsByVerb) + "\n");
    return 0;
  }
  if (shell === "zsh") {
    process.stdout.write(zshScript(verbs, nounsByVerb, flagsByVerb) + "\n");
    return 0;
  }
  if (shell === "fish") {
    process.stdout.write(fishScript(verbs, nounsByVerb, flagsByVerb) + "\n");
    return 0;
  }
  throw new UsageError("Usage: ./dev completion bash|zsh|fish");
}
function bashScript(verbs, nouns, flags) {
  const nounCases = nouns.map((n) => `      ${n.verb}) COMPREPLY=( $(compgen -W "${n.nouns.join(" ")}" -- "$cur") ); return;;`).join("\n");
  const flagCases = flags.map((f) => `      ${f.verb}) extra="${f.flags.join(" ")}";;`).join("\n");
  return `# bash completion for ./dev \u2014 eval "$(./dev completion bash)"
_dev_complete() {
  local cur prev verb extra
  cur="\${COMP_WORDS[COMP_CWORD]}"
  verb="\${COMP_WORDS[1]}"
  if [ "$COMP_CWORD" -eq 1 ]; then
    COMPREPLY=( $(compgen -W "${verbs.join(" ")}" -- "$cur") ); return
  fi
  case "$verb" in
${nounCases}
  esac
  extra=""
  case "$verb" in
${flagCases}
  esac
  COMPREPLY=( $(compgen -W "$extra" -- "$cur") )
}
complete -F _dev_complete ./dev dev`;
}
function zshScript(verbs, nouns, _flags) {
  const nounCases = nouns.map((n) => `    ${n.verb}) compadd ${n.nouns.join(" ")} ;;`).join("\n");
  return `#compdef dev ./dev
# zsh completion for ./dev \u2014 eval "$(./dev completion zsh)"
_dev() {
  if (( CURRENT == 2 )); then
    compadd ${verbs.join(" ")}
    return
  fi
  case "\${words[2]}" in
${nounCases}
  esac
}
_dev "$@"`;
}
function fishScript(verbs, nouns, flags) {
  const lines = [
    "# fish completion for ./dev \u2014 ./dev completion fish | source",
    `complete -c dev -f`,
    `complete -c dev -n '__fish_use_subcommand' -a '${verbs.join(" ")}'`
  ];
  for (const n of nouns) {
    lines.push(`complete -c dev -n '__fish_seen_subcommand_from ${n.verb}' -a '${n.nouns.join(" ")}'`);
  }
  for (const f of flags) {
    for (const flag of f.flags) {
      lines.push(`complete -c dev -n '__fish_seen_subcommand_from ${f.verb}' -l '${flag.replace(/^--/, "")}'`);
    }
  }
  return lines.join("\n");
}

// src/generators/workspace-dev-cli/cli-src/src/registry.ts
var COMMANDS = [
  {
    name: "start",
    group: "LIFECYCLE",
    summary: "Boot infrastructure (Docker) + app services (native)",
    flags: [{ name: "--docker", desc: "Run all services in Docker" }],
    handler: start
  },
  {
    name: "stop",
    group: "LIFECYCLE",
    summary: "Gracefully tear down all services",
    handler: stop
  },
  {
    name: "reset",
    group: "LIFECYCLE",
    summary: "Stop, wipe volumes, start & migrate (full recycle)",
    flags: [{ name: "--docker", desc: "Recycle the all-Docker topology" }],
    handler: reset
  },
  {
    name: "migrate",
    group: "LIFECYCLE",
    summary: "Create service databases & apply schemas",
    handler: migrate
  },
  {
    name: "status",
    group: "LIFECYCLE",
    summary: "Show running services (--watch for a live dashboard)",
    flags: [
      { name: "--json", desc: "Emit machine-readable JSON" },
      { name: "--watch", desc: "Live-refreshing dashboard (TTY only)" }
    ],
    handler: status
  },
  {
    name: "logs",
    group: "LIFECYCLE",
    summary: "Print recent logs (logs <service> to filter; --follow to stream)",
    flags: [{ name: "--follow", desc: "Stream logs (TTY only)" }],
    handler: logs
  },
  {
    name: "health",
    group: "LIFECYCLE",
    summary: "Poll every app service + Jaeger health endpoint",
    flags: [{ name: "--json", desc: "Emit machine-readable JSON" }],
    handler: health
  },
  {
    name: "clean",
    group: "LIFECYCLE",
    summary: "Tear down & wipe state (--hard wipes volumes)",
    flags: [{ name: "--hard", desc: "Also wipe Docker volumes" }],
    handler: clean
  },
  {
    name: "doctor",
    group: "QUALITY",
    summary: "Verify the local environment",
    flags: [{ name: "--json", desc: "Emit machine-readable JSON" }],
    handler: doctor
  },
  {
    name: "test",
    group: "QUALITY",
    summary: "Run tests (integration | bet <slug>)",
    nouns: ["integration", "bet"],
    flags: [
      { name: "--integration", desc: "Boot the stack for a bet suite" },
      { name: "--keep", desc: "Leave the stack running after tests" }
    ],
    handler: test
  },
  {
    name: "lint",
    group: "QUALITY",
    summary: "Run static analysis across services",
    handler: lint
  },
  {
    name: "new",
    group: "BET WORKFLOW",
    summary: "Scaffold a bet / milestone / slice (red test stubs)",
    nouns: ["bet", "milestone", "slice"],
    handler: newCmd
  },
  {
    name: "archive",
    group: "BET WORKFLOW",
    summary: "Archive a delivered bet's progress suite",
    nouns: ["bet"],
    handler: archive
  },
  {
    name: "bet",
    group: "BET WORKFLOW",
    summary: "Bet progress board (status [<slug>])",
    nouns: ["status"],
    flags: [{ name: "--json", desc: "Emit machine-readable JSON (status)" }],
    handler: betCmd
  },
  {
    name: "surface",
    group: "BET WORKFLOW",
    summary: "Surface registry & capability ledger (status)",
    nouns: ["status"],
    flags: [{ name: "--json", desc: "Emit machine-readable JSON (status)" }],
    handler: surfaceCmd
  },
  {
    name: "completion",
    group: "META",
    summary: "Print a shell completion script (bash|zsh|fish)",
    nouns: ["bash", "zsh", "fish"],
    handler: completion
  }
];
function findCommand(list, name) {
  return list.find((c) => c.name === name);
}
function shellQuote(arg) {
  return `'${arg.replace(/'/g, `'\\''`)}'`;
}
function projectCommandDef(pc) {
  return {
    name: pc.name,
    group: pc.group || "PROJECT",
    summary: pc.summary,
    handler: async (ctx) => {
      const cwd = pc.cwd ? path9.join(ROOT, pc.cwd) : ROOT;
      const env = pc.env ? { ...process.env, ...pc.env } : process.env;
      const extra = ctx.args.map(shellQuote).join(" ");
      const command = extra ? `${pc.run} ${extra}` : pc.run;
      return run("bash", ["-c", command], { cwd, env });
    }
  };
}
function buildRegistry(project) {
  const projDefs = project.map(projectCommandDef);
  const shadowed = new Set(projDefs.map((d) => d.name));
  const core = COMMANDS.filter((c) => !shadowed.has(c.name));
  return [...core, ...projDefs];
}

// src/generators/workspace-dev-cli/cli-src/src/theme/color.ts
var RESET = "\x1B[0m";
function envFlag(name) {
  const v = process.env[name];
  return v !== void 0 && v !== "" && v !== "0" && v.toLowerCase() !== "false";
}
function detectCaps(stream = process.stdout) {
  const isTTY = Boolean(stream.isTTY);
  const term = process.env.TERM ?? "";
  const unicode = term !== "dumb" && !envFlag("ASCII_ONLY") && /utf-?8/i.test(process.env.LC_ALL || process.env.LC_CTYPE || process.env.LANG || "UTF-8");
  let depth;
  if (envFlag("NO_COLOR")) {
    depth = "none";
  } else if (!isTTY && !envFlag("FORCE_COLOR")) {
    depth = "none";
  } else {
    const colorterm = (process.env.COLORTERM ?? "").toLowerCase();
    if (colorterm === "truecolor" || colorterm === "24bit") {
      depth = "truecolor";
    } else if (/256/.test(term)) {
      depth = "ansi256";
    } else if (term === "dumb" || term === "") {
      depth = "none";
    } else {
      depth = "ansi16";
    }
  }
  return { depth, unicode, isTTY };
}
function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex.trim());
  if (!m) return [255, 255, 255];
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}
function treatmentCode(t) {
  switch (t) {
    case "bold":
    case "bold+upper":
      return "\x1B[1m";
    case "dim":
      return "\x1B[2m";
    case "underline":
      return "\x1B[4m";
    default:
      return "";
  }
}
var Painter = class {
  constructor(tokens, caps) {
    this.tokens = tokens;
    this.caps = caps;
  }
  roleColor(role) {
    return this.tokens.terminal?.colorRoles?.[role];
  }
  /** Paint text in a semantic role, degrading by capability. */
  paint(role, text) {
    const r = this.roleColor(role);
    if (!r) return text;
    if (r.noColor === "bold+upper") text = text.toUpperCase();
    if (this.caps.depth === "none") {
      const code2 = treatmentCode(r.noColor);
      return code2 ? `${code2}${text}${RESET}` : text;
    }
    if (this.caps.depth === "truecolor" && r.truecolor) {
      const [rr, gg, bb] = hexToRgb(r.truecolor);
      return `\x1B[38;2;${rr};${gg};${bb}m${text}${RESET}`;
    }
    if ((this.caps.depth === "ansi256" || this.caps.depth === "truecolor") && r.ansi256 !== null) {
      return `\x1B[38;5;${r.ansi256}m${text}${RESET}`;
    }
    const code = treatmentCode(r.noColor);
    return code ? `${code}${text}${RESET}` : text;
  }
  /** Paint with the brand primary accent (truecolor only; degrades to bold). */
  primary(text) {
    if (this.caps.depth === "truecolor") {
      const [r, g, b] = hexToRgb(this.tokens.identity.primary);
      return `\x1B[38;2;${r};${g};${b}m${text}${RESET}`;
    }
    if (this.caps.depth === "none") return text;
    return `\x1B[1m${text}${RESET}`;
  }
  bold(text) {
    return this.caps.depth === "none" ? text : `\x1B[1m${text}${RESET}`;
  }
  dim(text) {
    return this.caps.depth === "none" ? text : `\x1B[2m${text}${RESET}`;
  }
};

// src/generators/workspace-dev-cli/cli-src/src/theme/tokens.ts
var DEFAULT_TOKENS = {
  identity: {
    appName: "Workspace",
    wordmark: "\u25E2\u25E4",
    primary: "#5fafff",
    accent: "#d7afff",
    voice: "clear, modern"
  },
  terminal: {
    colorRoles: {
      success: { truecolor: "#5faf87", ansi256: 72, noColor: "bold" },
      error: { truecolor: "#d75f5f", ansi256: 167, noColor: "bold" },
      warning: { truecolor: "#d7af5f", ansi256: 179, noColor: "bold" },
      info: { truecolor: "#5fafff", ansi256: 75, noColor: "dim" },
      muted: { truecolor: "#8a8a8a", ansi256: 245, noColor: "dim" },
      accent: { truecolor: "#d7afff", ansi256: 183, noColor: "underline" },
      header: { truecolor: null, ansi256: null, noColor: "bold+upper" },
      key: { truecolor: "#5fafff", ansi256: 75, noColor: "plain" },
      value: { truecolor: "#d0d0d0", ansi256: 252, noColor: "plain" }
    },
    symbols: {
      success: { unicode: "\u2714", ascii: "OK" },
      error: { unicode: "\u2716", ascii: "x" },
      warning: { unicode: "\u26A0", ascii: "!" },
      info: { unicode: "\u25CF", ascii: "*" },
      step: { unicode: "\u25B6", ascii: ">" },
      substep: { unicode: "\u21B3", ascii: "-" },
      active: { unicode: "\u276F", ascii: ">" }
    },
    splash: { style: "wordmark-line", tagline: "" },
    typography: {
      header: "bold + UPPERCASE",
      title: "bold + primary",
      body: "plain",
      muted: "dim"
    }
  }
};
function mergeTokens(partial) {
  const p = partial ?? {};
  const identity = { ...DEFAULT_TOKENS.identity, ...p.identity ?? {} };
  const terminal = p.terminal ? {
    colorRoles: { ...DEFAULT_TOKENS.terminal.colorRoles, ...p.terminal.colorRoles },
    symbols: { ...DEFAULT_TOKENS.terminal.symbols, ...p.terminal.symbols },
    splash: { ...DEFAULT_TOKENS.terminal.splash, ...p.terminal.splash },
    typography: { ...DEFAULT_TOKENS.terminal.typography, ...p.terminal.typography }
  } : DEFAULT_TOKENS.terminal;
  return { identity, terminal };
}

// src/generators/workspace-dev-cli/cli-src/src/theme/render.ts
var PAD = "  ";
var Renderer = class _Renderer {
  constructor(tokens, stream = process.stderr) {
    this.spinnerTimer = null;
    this.spinnerText = "";
    this.tokens = tokens;
    this.out = stream;
    this.painter = new Painter(tokens, detectCaps(stream));
  }
  /** A twin renderer bound to a different stream (e.g. stdout for command *results*,
   *  while progress and spinners stay on stderr). */
  asStream(stream) {
    return new _Renderer(this.tokens, stream);
  }
  sym(name) {
    const t = this.tokens.terminal?.symbols?.[name];
    if (!t) return "";
    return this.painter.caps.unicode ? t.unicode : t.ascii;
  }
  write(line) {
    this.out.write(line + "\n");
  }
  logo(subtitle) {
    const { wordmark, appName } = this.tokens.identity;
    const mark = this.painter.primary(`${wordmark} ${appName}`.trim());
    this.write("");
    this.write(subtitle ? `${PAD}${this.painter.bold(mark)} ${this.painter.dim("\u2014 " + subtitle)}` : `${PAD}${this.painter.bold(mark)}`);
    this.write("");
  }
  step(text) {
    this.write(`
${PAD}${this.painter.primary(this.sym("step"))} ${this.painter.bold(text)}`);
  }
  substep(text) {
    this.write(`${PAD}${PAD}${this.painter.dim(`${this.sym("substep")} ${text}`)}`);
  }
  info(text) {
    this.write(`${PAD}${this.painter.dim(this.sym("info"))} ${text}`);
  }
  success(text) {
    this.write(`${PAD}${this.painter.paint("success", this.sym("success"))} ${text}`);
  }
  error(text) {
    this.write(`${PAD}${this.painter.paint("error", this.sym("error"))} ${text}`);
  }
  warn(text) {
    this.write(`${PAD}${this.painter.paint("warning", this.sym("warning"))} ${text}`);
  }
  category(text) {
    this.write(`
${PAD}${this.painter.dim("\u25A0")} ${this.painter.paint("header", text)}`);
  }
  cmd(name, desc) {
    this.write(`    ${this.painter.paint("accent", name.padEnd(15))} ${desc}`);
  }
  /** A boxed error card with an optional action line. */
  errorCard(msg, action) {
    const bar = this.painter.paint("error", "\u2502");
    this.write("");
    this.write(`${PAD}${this.painter.paint("error", "\u256D" + "\u2500".repeat(58) + "\u256E")}`);
    this.write(`${PAD}${bar}  ${this.painter.paint("error", this.sym("error"))} ${this.painter.bold("ERROR:")} ${msg}`);
    if (action) {
      this.write(`${PAD}${bar}`);
      this.write(`${PAD}${bar}  ${this.painter.dim("Action required:")}`);
      this.write(`${PAD}${bar}  ${this.painter.paint("accent", this.sym("active"))} ${action}`);
    }
    this.write(`${PAD}${this.painter.paint("error", "\u2570" + "\u2500".repeat(58) + "\u256F")}`);
    this.write("");
  }
  /** A simple three-column table for status output. */
  table(title, rows) {
    this.write(`${PAD}${this.painter.dim("\u256D\u2500")} ${this.painter.bold(title)}`);
    if (rows.length === 0) {
      this.write(`${PAD}${this.painter.dim("\u2502")}  ${this.painter.dim("(none)")}`);
    }
    for (const [a, b, c] of rows) {
      this.write(`${PAD}${this.painter.dim("\u2502")}  ${a.padEnd(28)} ${b.padEnd(16)} ${this.painter.dim(c)}`);
    }
    this.write(`${PAD}${this.painter.dim("\u2570" + "\u2500".repeat(40))}`);
  }
  // --- Spinner (TTY only; degrades to a static line) -------------------------
  startSpinner(text) {
    this.spinnerText = text;
    if (!this.painter.caps.isTTY) {
      this.write(`${PAD}${this.painter.dim(this.sym("info"))} ${text}...`);
      return;
    }
    const frames = ["\u280B", "\u2819", "\u2839", "\u2838", "\u283C", "\u2834", "\u2826", "\u2827", "\u2807", "\u280F"];
    const asciiFrames = ["|", "/", "-", "\\"];
    const set = this.painter.caps.unicode ? frames : asciiFrames;
    let i = 0;
    this.out.write("\x1B[?25l");
    this.spinnerTimer = setInterval(() => {
      const frame = this.painter.primary(set[i % set.length]);
      this.out.write(`\r${PAD}${frame} ${this.spinnerText}`);
      i += 1;
    }, 90);
  }
  stopSpinner(successMsg, elapsed) {
    if (this.spinnerTimer) {
      clearInterval(this.spinnerTimer);
      this.spinnerTimer = null;
      this.out.write("\r\x1B[K");
      this.out.write("\x1B[?25h");
    }
    const time = elapsed ? ` ${this.painter.dim(`(${elapsed})`)}` : "";
    this.success(`${successMsg}${time}`);
  }
  failSpinner(failMsg) {
    if (this.spinnerTimer) {
      clearInterval(this.spinnerTimer);
      this.spinnerTimer = null;
      this.out.write("\r\x1B[K");
      this.out.write("\x1B[?25h");
    }
    this.error(failMsg);
  }
};
function makeRenderer(partialTokens, stream) {
  return new Renderer(mergeTokens(partialTokens), stream);
}

// src/generators/workspace-dev-cli/cli-src/src/util/extensions.ts
var fs10 = __toESM(require("fs"));
var path10 = __toESM(require("path"));
var NAME_RX = /^[a-z][a-z0-9:-]*$/;
function coerce(item) {
  if (!item || typeof item !== "object") return null;
  const c = item;
  if (typeof c.name !== "string" || !NAME_RX.test(c.name)) return null;
  if (typeof c.run !== "string" || !c.run.trim()) return null;
  return {
    name: c.name,
    summary: typeof c.summary === "string" && c.summary.trim() ? c.summary : "(project command)",
    group: typeof c.group === "string" && c.group.trim() ? c.group.trim().toUpperCase() : "PROJECT",
    run: c.run,
    cwd: typeof c.cwd === "string" ? c.cwd : void 0,
    env: c.env && typeof c.env === "object" && !Array.isArray(c.env) ? c.env : void 0
  };
}
function loadProjectCommands() {
  const byName = /* @__PURE__ */ new Map();
  try {
    if (fs10.existsSync(CONFIG_PATH)) {
      const raw = JSON.parse(fs10.readFileSync(CONFIG_PATH, "utf8"));
      if (Array.isArray(raw.commands)) {
        for (const item of raw.commands) {
          const c = coerce(item);
          if (c) byName.set(c.name, c);
        }
      }
    }
  } catch {
  }
  try {
    const dir = path10.join(DEV_DIR, "commands");
    if (fs10.existsSync(dir)) {
      for (const f of fs10.readdirSync(dir).sort()) {
        if (!f.endsWith(".json")) continue;
        try {
          const c = coerce(JSON.parse(fs10.readFileSync(path10.join(dir, f), "utf8")));
          if (c) byName.set(c.name, c);
        } catch {
        }
      }
    }
  } catch {
  }
  return [...byName.values()];
}

// src/generators/workspace-dev-cli/cli-src/src/index.ts
function loadConfig() {
  try {
    if (fs11.existsSync(CONFIG_PATH)) {
      const raw = JSON.parse(fs11.readFileSync(CONFIG_PATH, "utf8"));
      return { config: raw, tokens: { identity: raw.identity, terminal: raw.terminal } };
    }
  } catch {
  }
  return { config: {}, tokens: {} };
}
var CORE_GROUPS = ["LIFECYCLE", "QUALITY", "BET WORKFLOW", "META"];
function showHelp(r, commands) {
  r.logo("Local Development CLI");
  const present = [...new Set(commands.map((c) => c.group))];
  const order = [
    ...CORE_GROUPS.filter((g) => present.includes(g)),
    ...present.filter((g) => !CORE_GROUPS.includes(g)).sort()
  ];
  for (const g of order) {
    const cmds = commands.filter((c) => c.group === g);
    if (cmds.length === 0) continue;
    r.category(g);
    for (const c of cmds) r.cmd(c.name, c.summary);
  }
  process.stderr.write("\n");
}
async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--version")) {
    process.stdout.write(`${DEV_CLI_VERSION}
`);
    return 0;
  }
  let json = false;
  let help = false;
  const rest = [];
  for (const a of argv) {
    if (a === "--json") json = true;
    else if (a === "-h" || a === "--help") help = true;
    else if (a === "-v" || a === "--verbose") {
    } else rest.push(a);
  }
  const { config, tokens } = loadConfig();
  const r = makeRenderer(tokens);
  const registry = buildRegistry(loadProjectCommands());
  const command = rest[0];
  const args = rest.slice(1);
  if (!command || command === "help" || help) {
    showHelp(r, registry);
    return 0;
  }
  const def = findCommand(registry, command);
  if (!def) {
    r.error(`Unknown command: ${command}`);
    showHelp(r, registry);
    return 2;
  }
  const ctx = {
    r,
    json,
    args,
    projectPrefix: config.projectPrefix || "workspace",
    runners: parseRunners(config.runners),
    commands: registry
  };
  return def.handler(ctx);
}
process.on("SIGINT", () => {
  process.stderr.write("\n");
  process.stderr.write("\x1B[?25h");
  process.exit(130);
});
main().then((code) => process.exit(code)).catch((err) => {
  const r = makeRenderer({});
  if (err instanceof CliError) {
    r.errorCard(err.message, err.action);
    process.exit(1);
  }
  if (err instanceof UsageError) {
    r.error(err.message);
    process.exit(2);
  }
  r.errorCard(err?.message ?? String(err));
  process.exit(1);
});
