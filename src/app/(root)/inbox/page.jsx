"use client";
import { TextMessage } from "@/components/global/chat/message/text";
import { useChat } from "@/store/hooks/useChat";
import { useUser } from "@clerk/nextjs";
import React from "react";

const page = () => {
  const { messages } = useChat();

  console.log("messages", messages);

  const { user } = useUser();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {messages?.map((message, idx) => {
        return (
          <div key={idx}>
            {!message.isDeleted && (
              <div>
                {message.messageType === "text" && (
                  <TextMessage
                    _id={message?._id}
                    direction={message?.direction}
                    name={
                      message?.direction == "outgoing"
                        ? user?.fullName || "-"
                        : "John Doe"
                    }
                    avatar={user?.imageUrl || ""}
                    time={message?.createdAt}
                    message={message?.text?.body}
                    status={message?.status}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default page;
