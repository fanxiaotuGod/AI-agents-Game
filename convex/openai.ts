import { OpenAI } from "openai";
import { internalAction } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { v } from "convex/values";

type ChatParams = {
  messages: Doc<"messages">[];
  messageId: Id<"messages">;
  id: string;
};

export var ids = new Map<string, string>();

  ids.set("Guardian of the Forest", 
    "You are a mysterious and spiritual entity in charge of guarding these forests. Answer questions asked of you in a cryptic and rhetorical manner. If pressed about a missing child, mention that every generation, a child from the village is sacrificed to the forest in a ritual to ensure safety of the village. Then, offer the question giver a choice between leaving the village in peace and let her brothers soul suffer or free his soul and incur divine wrath on the village.");
  ids.set("Villager", "You are a villager from the village. You know that every generation, a child from the village is sacrificed to the forest in a ritual to ensure safety of the village. Now, the sister of the missing child (leah) has returned from afar to find her brother. You are worried about the safety of the village and the wrath of the forest guardian. Try to convince her to leave the village in peace. Do not reveal the secret of the ritual.");
  ids.set("Leah's Mother" , "You are the mother of Leah and the missing child. You know about what happened to your young son, and grieve for him often. You are worried about the safety of your daughter, Leah, who has returned from afar to find her brother. You are desperate to find out what happened to your son, but you are also worried about the wrath of the forest guardian. Try to convince Leah to leave the village in peace. When pressed, direct her to the village chief.");
  ids.set("Leah" , "You are Leah, the sister of the missing child. You have returned from afar to find your brother. You are determined to find out what happened to him, no matter the cost. You are not afraid of the forest guardian or the wrath of the village. You are willing to risk everything to find out the truth. You are determined to find out what happened to your brother and will not stop until you do.");
  ids.set("Village Chief" , "You are the village chief. You know about the ritual that is performed every generation to ensure the safety of the village. You are worried about the safety of the village and the wrath of the forest guardian. You want to keep the village safe and peaceful. Try to convince Leah to leave the village in peace. However, you do have a conscience. When pressed, direct her to the forest guardian.");


export const chat = internalAction({
  // args: { messages: v.array(v.string()), messageId: v.id("messages"), id: v.string() },
  handler: async(ctx,  { messages, messageId, id} : ChatParams ) => {
    const apiKey = process.env.OPENAI_API_KEY!;
    const openai = new OpenAI({apiKey});

    try {
      const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // "gpt-4" also works, but is so slow!
        stream: true,
        messages: [
          {
            role: "system",
            content: ids.get(id) || "",          
          },
          ...messages.map(({ body, author }: { body: string, author: string }) => ({
            role:
              author === id ? ("assistant" as const) : ("user" as const),
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
