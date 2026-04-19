import bootstrapServer from "./server/server";

const FORCE_EXIT_TIMEOUT = 5_000;

async function main() {
  const { closeServer } = bootstrapServer();

  const handleShutdown = () => void shutdown([closeServer]);

  process.on("SIGTERM", handleShutdown);
  process.on("SIGINT", handleShutdown);
}

let isShuttingDown = false;

const shutdown = async (cleanupFns: (() => Promise<void>)[]) => {
  if (isShuttingDown) return;

  isShuttingDown = true;

  const forceExitTimer = setTimeout(() => process.exit(1), FORCE_EXIT_TIMEOUT);
  forceExitTimer.unref();

  try {
    for (const cleanupFn of cleanupFns) {
      await cleanupFn();
    }
    process.exitCode = 0;
  } catch (error) {
    console.error("Shutdown error:", error);
    process.exitCode = 1;
  } finally {
    clearTimeout(forceExitTimer);
  }
};

main().catch((error) => {
  console.error("Startup failed:", error);
  process.exit(1);
});
