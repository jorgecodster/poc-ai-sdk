'use client';

import { ReactNode, useState } from 'react';
import { useActions } from 'ai/rsc';
import { Message } from '@/components/message';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Home() {
  const { continueConversation } = useActions();
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Array<ReactNode>>([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ border: '1px solid white', borderRadius: '10px', padding: '10px', width: '500px', height: '500px', overflowY: 'auto' }}>
        {messages.map((message) => message)}
      </div>

      <div style={{width: '500px'}}>
        <form style={{ flex: '0 1 100%', padding: '10px' }} onSubmit={async (event) => {
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
            style={{ width: '100%', color: 'black', border: 'none', outline: 'none', borderRadius: '10px', padding: '10px' }}
        />
        </form>
      </div>
    </div>
  );
}