import { OpenAI } from "openai"
import { documents } from "../src/data/content/documents"
import * as fs from "fs"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function main() {
  const vectors = []

  for (const doc of documents) {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: doc.content,
    })

    vectors.push({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      embedding: embeddingResponse.data[0].embedding,
    })
  }

  fs.writeFileSync("vector-store/embeddings.json", JSON.stringify(vectors, null, 2))
  console.log("🔁 Embeddingek elkészültek és elmentve!")
}

main()
