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
    <div style={{ backgroundColor: 'white', color: 'black', borderRadius: '10px', margin: '10px', padding: '10px'}}>
      <div>{text}</div>
    </div>
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
    <div style={{ backgroundColor: role === 'assistant' ? 'white' : 'lightgray', color: role === 'assistant' ? 'black' : '#333', borderRadius: '10px', margin: '10px', padding: '10px'}}>
      <span style={{fontWeight: 'bold'}}>{role}</span>: <span>{content}</span>
    </div>
  );
};