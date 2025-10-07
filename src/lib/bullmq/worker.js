import { Worker } from "bullmq";
import Redis from "ioredis";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in .env file");
}
if (!process.env.REDIS_URL) {
  throw new Error("Missing REDIS_URL in .env file");
}

const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "whatsappEventQueue",
  async (job) => {
    console.log("Processing job:", job.id, "with data:", job.data);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/organization/inbox/message/received-message`,
        job.data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response", response);

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Unexpected status code: ${response.status}`);
      }

      console.log("Job processed successfully:", job.id, response.data);
      return response.data;
    } catch (err) {
      console.error(
        `❌ Error processing job ${job.id}:`,
        err.response?.data || err.message,
        err.stack
      );

      throw err;
    }
  },
  {
    connection,
    removeOnComplete: true, // or { age: 3600 } for auto-removal after 1h
    removeOnFail: false,
    lockDuration: 30000,
  }
);

console.log(
  "🚀 Worker started and listening for jobs in 'whatsappEventQueue' queue"
);

// Event listeners
worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed: ${err.message}`);
});

// Graceful shutdown
const shutdown = async () => {
  console.log("Closing worker...");
  await worker.close();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export default worker;
