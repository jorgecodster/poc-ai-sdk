"use client";

import { StreamableValue, useStreamableValue } from "ai/rsc";
import { ReactNode } from "react";

export const TextStreamMessage = ({
  content,
}: {
  content: StreamableValue;
}) => {
  const [text] = useStreamableValue(content);

  return (
    <div>{text}</div>
  );
};

export const Message = ({
  role,
  content,
}: {
  role: "assistant" | "user";
  content: string | ReactNode;
}) => {
  return (
    <div>
      <span>{role}</span>: <span>{content}</span>
    </div>
  );
};