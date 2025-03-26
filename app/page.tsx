"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Search } from "lucide-react";

export interface Post {
  title: string;
  description: string;
  tags: string[];
  user_id: string;
}

interface PostWithId extends Post {
  _id: string;
}

const Page = () => {
  const [posts, setPosts] = useState<PostWithId[]>([]);
  const [newPost, setNewPost] = useState<Post>({
    title: "",
    description: "",
    tags: [],
    user_id: "",
  });
  const [showAddPost, setShowAddPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const addPost = useAction(api.posts.addPost);
  const searchPosts = useAction(api.posts.searchPosts);
  const allPosts = useQuery(api.posts.allPosts);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { title, description, tags, user_id } = newPost;
    if (!title || !description || !tags || !user_id) {
      alert("Required all fields");
      return;
    }

    try {
      await addPost(newPost);
      setNewPost({ title: "", description: "", tags: [], user_id: "" }); // Reset form after submission
      alert("Post added");
    } catch (error) {
      console.log(error);
      alert("Error occurred");
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery == "") {
      setPosts([]);
      return;
    }
    const filteredPosts = await searchPosts({
      searchQuery: searchQuery as string,
    });
    setPosts(filteredPosts);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Add Post Button */}
        <div className="flex gap-4 mb-8">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Input
              type="text"
              placeholder="Type your query and hit 'Enter' to search"
              className="w-full pl-10 pr-4 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </form>
          <Button
            onClick={() => setShowAddPost(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add Post
          </Button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPosts?.length || posts.length ? (
            posts.length ? (
              posts?.map((post, index) => (
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
              ))
            ) : (
              allPosts?.map((post, index) => (
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
              ))
            )
          ) : (
            <div className="min-h-full bg-gray-50 flex items-center justify-center">
              <div className="text-gray-600">Loading...</div>
            </div>
          )}
        </div>

        {/* Add Post Modal */}
        {showAddPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <h2 className="text-2xl font-semibold mb-6">Add a New Post</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <Input
                    value={newPost.title}
                    onChange={(e) =>
                      setNewPost({ ...newPost, title: e.target.value })
                    }
                    placeholder="Enter post title"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Textarea
                    value={newPost.description}
                    onChange={(e) =>
                      setNewPost({ ...newPost, description: e.target.value })
                    }
                    placeholder="Enter post description"
                    className="w-full"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <Input
                    value={newPost.tags.join(", ")}
                    onChange={(e) =>
                      setNewPost({
                        ...newPost,
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim()),
                      })
                    }
                    placeholder="Enter tags (comma separated)"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User ID
                  </label>
                  <Input
                    value={newPost.user_id}
                    onChange={(e) =>
                      setNewPost({ ...newPost, user_id: e.target.value })
                    }
                    placeholder="Enter user ID"
                    className="w-full"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddPost(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Add Post
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;
