import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  posts: defineTable({
    title: v.string(),
    description: v.string(),
    user_id: v.string(),
    tags: v.array(v.string()),
    embeddings: v.array(v.float64()),
  }).vectorIndex("by_user_id", {
    vectorField: "embeddings",
    dimensions: 1024,
    filterFields: ["user_id", "title", "description", "tags"],
  }),
});
