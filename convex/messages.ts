import { internal } from "./_generated/api";
import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { ids } from "./openai";

export const list = query({
  args: {},
  handler: async (ctx) => {
    // Grab the most recent messages.
    const messages = await ctx.db.query("messages").order("desc").take(100);
    // Reverse the list so that it's in a chronological order.
    return messages.reverse();
  },
});

export const send = mutation({
  args: { body: v.string(), author: v.string() },
  handler: async (ctx, { body, author }) => {
    // Send a new message.
    await ctx.db.insert("messages", { body, author });

    for (const id of ids.keys()) {
      if (body.indexOf("@" + id) !== -1) {
        // Fetch the latest n messages to send as context.
        // The default order is by creation time.
        const messages = await ctx.db.query("messages").order("desc").take(10);
        // Reverse the list so that it's in chronological order.
        messages.reverse();
        // Insert a message with a placeholder body.
        const messageId = await ctx.db.insert("messages", {
          author: id,
          body: "...",
        });

        // Schedule an action that calls ChatGPT and updates the message.
        ctx.scheduler.runAfter(0, internal.openai.chat, { messages, messageId, id });
      }
    }
  }
});


//     if (body.indexOf("@") !== -1) {
//       // Fetch the latest n messages to send as context.
//       // The default order is by creation time.
//       const messages = await ctx.db.query("messages").order("desc").take(10);
//       // Reverse the list so that it's in chronological order.
//       messages.reverse();
//       // Insert a message with a placeholder body.
//       const messageId = await ctx.db.insert("messages", {
//         author: "Guardian of the Forest",
//         body: "...",
//       });
//       // Schedule an action that calls ChatGPT and updates the message.
//       ctx.scheduler.runAfter(0, internal.openai.chat, { messages, messageId, id: author });
//     }
//   },
// });

// Updates a message with a new body.
export const update = internalMutation({
  args: { messageId: v.id("messages"), body: v.string() },
  handler: async (ctx, { messageId, body }) => {
    await ctx.db.patch(messageId, { body });
  },
});
