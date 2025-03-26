# AI-Powered Post Recommendation System

A modern web application that demonstrates intelligent post recommendations using vector embeddings and similarity search.

## Overview

This project is a full-stack application that allows users to create, search, and discover related posts using AI-powered recommendations. It leverages vector embeddings to understand the semantic meaning of posts and provides similar content suggestions.

## Key Features

- 🔍 Semantic Search
- 💡 AI-Powered Post Recommendations
- ✨ Real-time Post Creation
- 🏷️ Tag-based Organization
- 🎯 User-specific Content Filtering

## Tech Stack

- **Next.js 13** - React framework with App Router for the frontend
- **Convex** - Backend database with built-in vector search capabilities
- **VoyageAI** - AI embeddings generation
- **Tailwind CSS** - Styling and UI components
- **TypeScript** - Type-safe development
- **LangChain** - AI/ML operations integration

## How It Works

### Vector Embeddings

Posts are converted into vector embeddings using VoyageAI when created. This allows for semantic understanding of content:

```typescript
// Using VoyageAI to generate embeddings
const embeddings = new VoyageEmbeddings({
  apiKey: process.env.VOYAGE_API_KEY,
  inputType: "query",
});

const embedding = await embeddings.embedQuery(text);
```

### Vector Search Schema

Convex schema configured for vector search:

```typescript
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
```

### Recommendation Engine

Similar posts are found using vector similarity search:

```typescript
const result = await ctx.vectorSearch("posts", "by_user_id", {
  vector: embeddings,
  limit: 5,
  filter: (q) => q.eq("user_id", post.user_id),
});
```

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd convex-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a `config.ts` file in the root directory:

```typescript
// config.ts
export const VOYAGE_API_KEY = "your_voyage_api_key_here";
```

4. Set up Convex:

```bash
npx convex dev
```

5. Start the development server:

```bash
npm run dev
```

## Environment Variables

Create a `.env.local` file:

```
VOYAGE_API_KEY=your_voyage_api_key_here
```

## Project Structure

```
convex-app/
├── app/                 # Next.js pages and components
├── convex/             # Backend logic and schema
│   ├── schema.ts       # Database schema
│   └── posts.ts        # Post-related functions
├── lib/                # Utility functions
│   └── embedd.ts       # Embedding generation
└── components/         # Reusable UI components
```

## How to Use

1. **Create a Post**

   - Click "Add Post" button
   - Fill in title, description, tags, and user ID
   - Post is automatically converted to embeddings for recommendations

2. **Search Posts**

   - Use the search bar for semantic search
   - Results are ranked by relevance using vector similarity

3. **View Recommendations**
   - Click on any post to view details
   - Similar posts are automatically displayed below

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
