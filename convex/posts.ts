import { v } from "convex/values";
import {
  action,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { embed } from "../lib/embedd";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

export const fetchPostsData = internalQuery({
  args: { ids: v.array(v.id("posts")) },
  handler: async (ctx, args) => {
    const results = [];
    for (const id of args.ids) {
      const post = await ctx.db.get(id);
      if (post) {
        results.push(post);
      }
    }
    return results;
  },
});

export const allPosts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("posts").collect();
  },
});

export const getPost = internalQuery({
  args: {
    id: v.id("posts"),
  },
  handler: async (ctx, args) => {
    if (!args.id) {
      return null;
    }

    return await ctx.db.get(args.id);
  },
});

export const insertPost = internalMutation({
  args: {
    title: v.string(),
    description: v.string(),
    user_id: v.string(),
    tags: v.array(v.string()),
    embeddings: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    //checks
    if (
      !args.title ||
      !args.description ||
      !args.user_id ||
      !args.tags ||
      !args.embeddings
    ) {
      throw new Error("Missing required fields");
    }

    const post = await ctx.db.insert("posts", {
      title: args.title,
      description: args.description,
      user_id: args.user_id,
      tags: args.tags,
      embeddings: args.embeddings,
    });
    return post;
  },
});

export const addPost = action({
  args: {
    title: v.string(),
    description: v.string(),
    user_id: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    //checks
    if (!args.title || !args.description || !args.user_id || !args.tags) {
      throw new Error("Missing required fields");
    }

    const text = `${args.title} ${args.description} ${args.tags.join(" ")}`;

    const embeddings = await embed(text);
    await ctx.runMutation(internal.posts.insertPost, {
      title: args.title,
      description: args.description,
      user_id: args.user_id,
      tags: args.tags,
      embeddings: embeddings,
    });

    return true;
  },
});

export const similarPosts = action({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    user_id: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const text = `${args.title} ${args.description} ${args.tags.join(" ")}`;

    const embeddings = await embed(text);

    const result = await ctx.vectorSearch("posts", "by_user_id", {
      vector: embeddings,
      limit: 5,
      filter: (q) => q.eq("user_id", args.user_id),
    });

    const postIds = result.map((r) => r._id);

    const posts: Array<Doc<"posts">> = await ctx.runQuery(
      internal.posts.fetchPostsData,
      { ids: postIds },
    );
    return posts;
  },
});

export const getSimilarPostsById = action({
  args: {
    post_id: v.id("posts"),
  },
  handler: async (ctx, args) => {
    // Get the post data first
    const post: Doc<"posts"> | null = await ctx.runQuery(
      internal.posts.getPost,
      { id: args.post_id },
    );

    // If post doesn't exist, return empty array
    if (!post) {
      return [];
    }

    // Use the post data to find similar posts
    // const text = `${post.title} ${post.description} ${post.tags.join(" ")}`;
    // const embeddings = await embed(text);
    const embeddings = post.embeddings;

    const result = await ctx.vectorSearch("posts", "by_user_id", {
      vector: embeddings,
      limit: 6,
      filter: (q) => q.eq("user_id", post.user_id),
    });

    // Filter out the original post
    const filteredResults = result.filter((r) => r._id !== args.post_id);

    // Take only 5 results
    const postIds = filteredResults.slice(0, 5).map((r) => r._id);

    // Fetch the actual post data
    const similarPosts: any = await ctx.runQuery(
      internal.posts.fetchPostsData,
      { ids: postIds },
    );

    return similarPosts;
  },
});

export const getPostByIdd = internalQuery({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.postId);
  },
});

export const getPostById = action({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post: any = await ctx.runQuery(internal.posts.getPostByIdd, {
      postId: args.postId,
    });
    return post;
  },
});

export const searchPosts = action({
  args: { searchQuery: v.string() },
  handler: async (ctx, args) => {
    const embeddings = await embed(args.searchQuery);
    const result = await ctx.vectorSearch("posts", "by_user_id", {
      vector: embeddings,
    });

    const postIds = result.map((r) => r._id);

    const posts: Array<Doc<"posts">> = await ctx.runQuery(
      internal.posts.fetchPostsData,
      { ids: postIds },
    );
    return posts;
  },
});
