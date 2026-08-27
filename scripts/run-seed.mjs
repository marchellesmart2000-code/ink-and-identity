import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const convexBin = path.join(root, "..", "node_modules", "convex", "bin", "main.js");

const child = spawn(
  process.execPath,
  [convexBin, "run", "seed:run", JSON.stringify({ token: "local-dev-seed" })],
  { stdio: "inherit" },
);

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
