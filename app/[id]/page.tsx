"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAction } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

interface Post {
  _id: Id<"posts">;
  title: string;
  description: string;
  tags: string[];
  user_id: string;
}

const Page = () => {
  const { id } = useParams();
  const fetchSimilarPosts = useAction(api.posts.getSimilarPostsById);
  const getPostById = useAction(api.posts.getPostById);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [similarPosts, setSimilarPosts] = useState<Post[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const post = await getPostById({postId: id as Id<"posts">})
        const similar = await fetchSimilarPosts({ post_id: id as Id<"posts"> });
        setCurrentPost(post as Post);
        setSimilarPosts(similar);
      } catch (error) {
        console.log(error);
      }
    })()
  }, [id])

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Posts
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Current Post */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {currentPost.title}
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            {currentPost.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {currentPost.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-gray-500">
              Posted by: {currentPost.user_id}
            </span>
          </div>
        </div>

        {/* Similar Posts Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Similar Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarPosts.map((post, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <Link href={`/${post._id}`}>
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 mb-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {post.user_id}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
