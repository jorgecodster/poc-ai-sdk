import { createAI, createStreamableValue, getMutableAIState, streamUI } from 'ai/rsc';
import { CoreMessage, generateId } from "ai";
import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { z } from 'zod';
import { ReactNode } from 'react';
import { ImageComponent } from '@/components/image';
import { Message, TextStreamMessage } from '@/components/message';

// Define the AI state and UI state types
export type ServerMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ClientMessage = {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
};

export async function continueConversation(
  input: string,
) {
  'use server';

  const history = getMutableAIState<typeof AI>("messages");
  const currentMessages = history.get() as CoreMessage[];
  
  // Validate that the last message is from the user
  if (currentMessages.length > 0 && currentMessages[currentMessages.length - 1].role !== 'user') {
    console.error("Last message is not from user. Adding user message.");
  }

  // Always add the new user input
  const updatedMessages = [
    ...currentMessages,
    { role: "user", content: input } as CoreMessage,
  ];

  history.update(updatedMessages);

  console.log("Messages being sent to API:", JSON.stringify(updatedMessages, null, 2));

  const contentStream = createStreamableValue("");
  const textComponent = <TextStreamMessage content={contentStream.value} />;

  const bedrock = createAmazonBedrock({
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    sessionToken: process.env.AWS_SESSION_TOKEN!,
  });

  try {
    const { value: stream } = await streamUI({
      model: bedrock('anthropic.claude-3-sonnet-20240229-v1:0'),
      messages: updatedMessages,
      system: "You are a helpful assistant that can answer questions and help with tasks. You can also show images from the given url.",
      text: async function* ({ content, done }) {
        if (done) {
          history.done([
            ...(history.get() as CoreMessage[]),
            { role: "assistant", content },
          ]);
  
          contentStream.done();
        } else {
          contentStream.update(content);
        }
  
        return textComponent;
      },
      tools: {
        showImage: {
          description: 'Show the image from the given url',
          parameters: z.object({
            url: z.string().url(),
          }),
          generate: async ({ url }) => {
            // TODO: Removed the tool messages for now to keep user/assistant message structure and avoid the exception: ValidationException: A conversation must alternate between user and assistant roles. Make sure the conversation alternates between user and assistant roles and try again.
            /*const toolCallId = generateId();
            history.done([
              ...(history.get() as CoreMessage[]),
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId,
                    toolName: "showImage",
                    args: {},
                  },
                ],
              },
              {
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    toolName: "showImage",
                    toolCallId,
                    result: `Showing image from given url:`,
                  },
                ],
              },
            ]);*/
  
            const result = <Message role="assistant" content={<ImageComponent url={url} />} />;
            contentStream.done();
            return result;
          },
        },
      },
    });
    return stream;
  } catch (error) {
    console.error("Error in continueConversation:", error);
    contentStream.done();
    return <Message role="assistant" content={`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`} />;

  }

}

export type UIState = Array<ReactNode>;

export type AIState = {
  chatId: string;
  messages: Array<CoreMessage>;
};

// Create the AI provider with the initial states and allowed actions
export const AI = createAI<AIState, UIState>({
  initialAIState: {
    chatId: generateId(),
    messages: [],
  },
  initialUIState: [],
  actions: {
    continueConversation,
  },
});