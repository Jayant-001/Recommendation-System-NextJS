import { VoyageEmbeddings } from "@langchain/community/embeddings/voyage";
import { VOYAGE_API_KEY } from "../config";

const embeddings = new VoyageEmbeddings({
  apiKey: VOYAGE_API_KEY, // In Node.js defaults to process.env.VOYAGEAI_API_KEY
  inputType: "query", // Optional: specify input type as 'query', 'document', or omit for None / Undefined / Null
});

export const embed = async (descriptionQuery: string) => {
  const embedding = await embeddings.embedQuery(descriptionQuery);
  return embedding;
};
