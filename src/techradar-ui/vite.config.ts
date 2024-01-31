import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import child_process from "child_process";

const baseFolder =
  process.env.APPDATA !== undefined && process.env.APPDATA !== ""
    ? `${process.env.APPDATA}/ASP.NET/https`
    : `${process.env.HOME}/.aspnet/https`;

const certificateArg = process.argv
  .map((arg) => arg.match(/--name=(?<value>.+)/i))
  .filter(Boolean)[0];
const certificateName = certificateArg
  ? certificateArg.groups.value
  : "reactapp1.client";

if (!certificateName) {
  console.error(
    "Invalid certificate name. Run this script in the context of an npm/yarn script or pass --name=<<app>> explicitly.",
  );
  process.exit(-1);
}

const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
  if (
    0 !==
    child_process.spawnSync(
      "dotnet",
      [
        "dev-certs",
        "https",
        "--export-path",
        certFilePath,
        "--format",
        "Pem",
        "--no-password",
      ],
      { stdio: "inherit" },
    ).status
  ) {
    throw new Error("Could not create certificate.");
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
    },
  },
  server: {
    proxy: {
      "^/api": {
        target: "https://localhost:7197/",
        secure: false,
      },
      "^/swagger": {
        target: "https://localhost:7197/",
        secure: false,
      },
      "^/Auth": {
        target: "https://localhost:7197/",
        secure: false,
      },
      "^/auth": {
        target: "https://localhost:7197/",
        secure: false,
      },
      "^/fe": {
        target: "https://localhost:7197/",
        secure: false,
       },
       "^/healthz": {
        target: "https://localhost:7197/",
        secure: false,
       }
    },
    port: 3000,
    cors: {
      origin: "*",
    },
    https: {
      key: fs.readFileSync(keyFilePath),
      cert: fs.readFileSync(certFilePath),
    },
  },
  test: {
    globals: true,
    setupFiles: "./tests/setup.js",
    reporters: ["html", "junit"],
    outputFile: "./output/test/junit.xml",
    coverage: {
      provider: "v8",
      reporter: ["html", "cobertura", "lcov"],
      reportsDirectory: "./output/coverage",
    },
  }
});
