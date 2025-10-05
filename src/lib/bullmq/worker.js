import { Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL);

const worker = new Worker(
  "whatsapp-events",
  async (job) => {
    const { payload } = job.data;

    // 1. Handle messages
    if (payload.messages) {
      for (const msg of payload.messages) {
        // Example: upsert customer & message in DB
        await db.customer.upsert({
          where: { wa_id: msg.from },
          update: { last_message_at: new Date(msg.timestamp * 1000) },
          create: {
            wa_id: msg.from,
            name: msg?.profile?.name || null,
            last_message_at: new Date(msg.timestamp * 1000),
          },
        });

        await db.message.create({
          data: {
            wa_message_id: msg.id,
            customer_id: msg.from,
            direction: "inbound",
            type: msg.type,
            body: JSON.stringify(msg[msg.type]),
            timestamp: new Date(msg.timestamp * 1000),
          },
        });
      }
    }

    // 2. Handle status updates
    if (payload.statuses) {
      for (const status of payload.statuses) {
        await db.message.update({
          where: { wa_message_id: status.id },
          data: { status: status.status },
        });
      }
    }

    console.log("✅ Processed job:", job.id);
  },
  { connection }
);

worker.on("failed", (job, err) => {
  console.error("❌ Job failed:", job.id, err);
});
