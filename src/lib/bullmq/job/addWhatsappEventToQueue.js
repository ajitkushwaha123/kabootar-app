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
        removeOnComplete: true,
        removeOnFail: false, 
        lifo: false,
      }
    );

    console.log("✅ WhatsApp event added to queue");
  } catch (err) {
    console.error("❌ Failed to add WhatsApp event to queue", err);
    throw err;
  }
};
