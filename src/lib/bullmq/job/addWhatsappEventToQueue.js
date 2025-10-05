import { whatsappEventQueue } from "../queue/whatsappEventQueue";

export const addWhatsappEventToQueue = async ({ payload }) => {
  console.log("⏳ Adding WhatsApp event to queue...", payload);

  try {
    await whatsappEventQueue.add(
      "whatsapp-event", // job name
      payload,
      {
        attempts: 5, // retry up to 5 times
        backoff: {
          type: "exponential",
          delay: 3000, // initial delay 3s, grows exponentially
        },
        removeOnComplete: true, // remove successful jobs
        removeOnFail: false, // keep failed jobs for debugging
        lifo: false, // process jobs in FIFO order
      }
    );

    console.log("✅ WhatsApp event added to queue");
  } catch (err) {
    console.error("❌ Failed to add WhatsApp event to queue", err);
    throw err;
  }
};
