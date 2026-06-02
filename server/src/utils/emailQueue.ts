import PQueue from "p-queue";
import { logger } from "./logger.js";

export const emailQueue = new PQueue({ concurrency: 5 });

emailQueue.on("active", () => {
  logger.info(
    `Email processing. Size: ${emailQueue.size}  Pending: ${emailQueue.pending}`,
  );
});

emailQueue.on("error", (error: any) => {
  logger.error(error, `Error in email queue`);
});
