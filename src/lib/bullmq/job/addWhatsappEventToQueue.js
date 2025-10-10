import { whatsappEventQueue } from "../queue/whatsappEventQueue";

export const addWhatsappEventToQueue = async ({ payload, event }) => {
  console.log("⏳ Adding WhatsApp event to queue...", payload);

  try {
    await whatsappEventQueue.add(event, payload, {
      attempts: 5,
      backoff: {
        type: "exponential",
        delay: 3000,
      },
      removeOnComplete: true,
      removeOnFail: false,
      lifo: false,
    });

    console.log("✅ WhatsApp event added to queue");
  } catch (err) {
    console.error("❌ Failed to add WhatsApp event to queue", err);
    throw err;
  }
};
