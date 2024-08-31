import { OpenAI } from "openai";
import { internalAction } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

type ChatParams = {
  messages: Doc<"messages">[];
  messageId: Id<"messages">;
};
export const chat = internalAction({
  handler: async (ctx, { messages, messageId }: ChatParams) => {
    const apiKey = process.env.OPENAI_API_KEY!;
    const openai = new OpenAI({ apiKey });

    try {
      const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // "gpt-4" also works, but is so slow!
        stream: true,
        messages: [
          {
            role: "system",
            content: "You are a mysterious and spiritual entity in charge of guarding these forests. Answer questions asked of you in a cryptic and rhetorical manner. If pressed about a missing child, mention that every generation, a child from the village is sacrificed to the forest in a ritual to ensure safety of the village. Then, offer the question giver a choice between leaving the village in peace and let her brothers soul suffer or free his soul and incur divine wrath on the village.",
          },
          ...messages.map(({ body, author }) => ({
            role:
              author === "Guardian of the Forest" ? ("assistant" as const) : ("user" as const),
            content: body,
          })),
        ],
      });
      let body = "";
      for await (const part of stream) {
        if (part.choices[0].delta?.content) {
          body += part.choices[0].delta.content;
          // Alternatively you could wait for complete words / sentences.
          // Here we send an update on every stream message.
          await ctx.runMutation(internal.messages.update, {
            messageId,
            body,
          });
        }
      }
    } catch (e) {
      if (e instanceof OpenAI.APIError) {
        console.error(e.status);
        console.error(e.message);
        await ctx.runMutation(internal.messages.update, {
          messageId,
          body: "OpenAI call failed: " + e.message,
        });
        console.error(e);
      } else {
        throw e;
      }
    }
  },
});
