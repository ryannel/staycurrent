import path from "node:path";
import { runtime } from "./runtime.mjs";
import { createApplication } from "./app.mjs";
const owned = await runtime();
let app,
  interrupted = false,
  resolveStop;
const interruptedPromise = new Promise((resolve) => {
  resolveStop = resolve;
});
const controller = new AbortController();
const stop = () => {
  interrupted = true;
  controller.abort();
  resolveStop();
};
process.once("SIGINT", stop);
process.once("SIGTERM", stop);
try {
  await owned.start();
  if (interrupted) throw new Error("Run interrupted during startup");
  if (process.argv.includes("--test")) {
    const { exercise } = await import("./exercise.mjs");
    const guard = setTimeout(() => controller.abort(), 25000);
    try {
      await exercise(owned, controller.signal);
    } finally {
      clearTimeout(guard);
    }
  } else {
    app = await createApplication({
      socket: owned.socket,
      database: path.join(owned.directory, "source.sqlite"),
    });
    console.log(`Demo catalogue API: ${app.url}`);
    console.log(
      "Loopback teaching server only. Demo tokens: demo-alpha and demo-beta.",
    );
    console.log(
      `Read: curl -H 'Authorization: Bearer demo-alpha' '${app.url}/products/42?locale=en'`,
    );
    console.log(
      `Authoritative read: curl -H 'Authorization: Bearer demo-alpha' '${app.url}/price-check/42'`,
    );
    console.log(
      "Press Ctrl-C to close the app, database worker and owned Redis process.",
    );
    if (!interrupted) await interruptedPromise;
  }
} finally {
  process.removeListener("SIGINT", stop);
  process.removeListener("SIGTERM", stop);
  if (app) await app.close();
  await owned.close();
}
