'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { ClientMessage } from './actions';
import { useActions, useUIState } from 'ai/rsc';
import { generateId } from 'ai';
import { Message } from '@/components/message';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Home() {
  const { continueConversation } = useActions();
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Array<ReactNode>>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div>
      <div>
        {messages.map((message) => message)}
      </div>

      <div>
        
        <form onSubmit={async (event) => {
          event.preventDefault();
          setMessages((messages) => [
            ...messages,
            <Message key={messages.length} role="user" content={input} />,
          ]);
          setInput("");
          const response: ReactNode = await continueConversation(input);
          setMessages((messages) => [...messages, response]);
        }}>
          <input
            type="text"
            value={input}
            onChange={event => {
            setInput(event.target.value);
          }}
        />
        </form>
      </div>
    </div>
  );
}