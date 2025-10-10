import { Worker } from "bullmq";
import Redis from "ioredis";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// ✅ Basic sanity checks
if (!process.env.MONGODB_URI) throw new Error("❌ Missing MONGODB_URI in .env");
if (!process.env.REDIS_URL) throw new Error("❌ Missing REDIS_URL in .env");
if (!process.env.NEXT_PUBLIC_BASE_URL)
  throw new Error("❌ Missing NEXT_PUBLIC_BASE_URL in .env");

// ✅ Stable Redis connection
const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  reconnectOnError: (err) => {
    const targetErrors = ["READONLY", "ECONNRESET"];
    if (targetErrors.some((e) => err.message.includes(e))) {
      console.warn("🔄 Redis reconnecting after transient error:", err.message);
      return true;
    }
    return false;
  },
});

// ✅ Worker setup
const worker = new Worker(
  "whatsappEventQueue",
  async (job) => {
    console.log(`🚀 [JOB:${job.id}] Processing message event`);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/organization/inbox/message/received-message`,
        job.data,
        { headers: { "Content-Type": "application/json" }, timeout: 15000 }
      );

      // ✅ Validate response
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Unexpected response ${response.status}`);
      }

      console.log(`✅ [JOB:${job.id}] Processed successfully`, response.data);
      return response.data;
    } catch (err) {
      // Enhanced error logging
      const errMsg = err.response?.data || err.message || "Unknown error";
      console.error(`❌ [JOB:${job.id}] Failed → ${errMsg}`);

      // Retry logic hint (optional)
      if (err.code === "ECONNRESET" || err.code === "ETIMEDOUT") {
        console.warn("⚠️ Network error — requeuing job for retry...");
        throw new Error("Temporary network failure — retrying...");
      }

      throw err;
    }
  },
  {
    connection,
    concurrency: 5,
    lockDuration: 120000,
    lockRenewTime: 20000,
    stalledInterval: 30000,
    maxStalledCount: 3,
    removeOnComplete: { age: 3600, count: 500 },
  }
);

// ✅ Event listeners for better observability
worker.on("active", (job) => console.log(`🟢 [JOB:${job.id}] Started`));
worker.on("completed", (job, result) =>
  console.log(`✅ [JOB:${job.id}] Completed →`, result?.message || "done")
);
worker.on("failed", (job, err) =>
  console.error(`❌ [JOB:${job?.id}] Failed: ${err.message}`)
);
worker.on("stalled", (jobId) =>
  console.warn(`⚠️ [JOB:${jobId}] Stalled! Possibly took too long.`)
);

// ✅ Graceful shutdown
const shutdown = async () => {
  console.log("🛑 Gracefully shutting down WhatsApp worker...");
  await worker.close();
  await connection.quit();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

console.log(
  "💬 WhatsApp Worker ready and listening on queue → whatsappEventQueue"
);

export default worker;
