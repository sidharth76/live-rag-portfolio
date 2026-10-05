# Live RAG Portfolio

A resume-grounded Retrieval-Augmented Generation (RAG) portfolio. It combines Gemini embeddings and generation, Qdrant vector search, and Neo4j graph expansion to answer questions using indexed resume content.

## What is built

This project has two RAG paths:

- **Indexing (offline/manual):** extracts text from local resume PDFs, splits it into overlapping chunks, embeds each chunk with Gemini, and stores the vectors and payloads in Qdrant. It also writes the document, chunk, and recognized-entity graph to Neo4j.
- **Question answering (online):** embeds the visitor's question, retrieves relevant chunks from Qdrant, follows graph relationships in Neo4j to find related chunks, and asks Gemini to compose a concise answer grounded in that combined context.

The browser sends questions to a server-side Next.js API route. Provider credentials remain server-side and are never sent to the browser. The API streams progress-stage events to the interface while retrieval and generation run, followed by the final answer.

## RAG architecture

### Resume indexing

1. `scripts/index-resumes.ts` scans the local `Resume PDFs/` directory and parses each PDF.
2. Text is normalized and split into chunks of up to 1,000 characters with 160 characters of overlap. Each chunk retains its filename and page number.
3. A stable chunk ID is derived from the source, page, chunk index, and text, so rerunning the indexer upserts the same records.
4. Gemini `gemini-embedding-001` creates document embeddings. The indexer uses the returned vector length when it creates or validates the Qdrant collection.
5. Qdrant stores each vector with the chunk text, source filename, page, and chunk index as payload.
6. Neo4j stores `ResumeDocument`, `ResumeChunk`, and recognized `ResumeEntity` nodes. It links documents to chunks with `HAS_CHUNK` and chunks to entities with `MENTIONS`. Entity recognition uses a fixed vocabulary in `src/lib/rag/text.ts`; these graph links are created from chunk text, not from Qdrant search results.

### Question answering

1. The server validates the question and embeds it with Gemini using the `RETRIEVAL_QUERY` task type.
2. Qdrant returns up to five semantically similar chunks.
3. Neo4j follows shared `MENTIONS` entity relationships from those chunks and returns up to three related chunks.
4. The results are de-duplicated and capped at eight context chunks.
5. Gemini `gemini-3.8-flash` generates an answer using only the retrieved context. The prompt instructs it not to invent unsupported facts or include citations, source names, page numbers, headings, or list markers. Answers use plain text unless bold formatting is explicitly requested.
6. The API streams progress updates for question understanding, vector retrieval, graph expansion, and answer generation. It returns errors for failed retrieval or generation instead of fabricating an answer.

Qdrant and Neo4j have separate roles: Qdrant performs vector similarity search, while Neo4j stores explicit document/chunk/entity relationships and expands the retrieved context. Neo4j does not build graph relationships from Qdrant scores.

## Technology

- **Gemini API (`@google/genai`)** — document/query embeddings and grounded answer generation.
- **Qdrant** — vector collection and similarity search over resume chunks.
- **Neo4j Aura or Neo4j** — graph storage and relationship-based context expansion.
- **Next.js 14 API route** — server-side RAG endpoint and streamed progress events.
- **TypeScript, React, and Node.js** — application and manual indexing script.
- **`pdf-parse`** — PDF text extraction.

## Run locally

Requirements: Node.js compatible with Next.js 14 and npm.

1. Install dependencies:

   ```powershell
   npm ci
   ```

2. Create `.env.local` from the safe template:

   ```powershell
   Copy-Item .env.example .env.local
   ```

3. Fill in the provider credentials and endpoints in `.env.local`:

   | Variable | Purpose |
   | --- | --- |
   | `GEMINI_API_KEY` | Gemini API key |
   | `GEMINI_EMBEDDING_MODEL` | Embedding model; default `gemini-embedding-001` |
   | `GEMINI_GENERATION_MODEL` | Answer model; default `gemini-3.8-flash` |
   | `QDRANT_URL` | Qdrant cluster URL |
   | `QDRANT_API_KEY` | Qdrant API key |
   | `QDRANT_COLLECTION` | Vector collection; default `portfolio_resume_chunks` |
   | `NEO4J_URI` | Neo4j connection URI |
   | `NEO4J_USERNAME` | Neo4j username |
   | `NEO4J_PASSWORD` | Neo4j password |
   | `NEO4J_DATABASE` | Neo4j database name |

   Do not add `NEXT_PUBLIC_` prefixes to credentials. Never commit `.env.local` or put real secrets in `.env.example`.

4. Put PDF files you intend to index in `Resume PDFs/`. That folder is git-ignored; the PDFs are not included in the repository.
5. Index the PDFs against your configured Gemini, Qdrant, and Neo4j services:

   ```powershell
   npm run index:resumes
   ```

6. Start the app:

   ```powershell
   npm run dev
   ```

   Open `http://localhost:3000`.

Other useful commands:

```powershell
npm run test:rag
npm run build
npm start
```

Indexing is a manual operation and is not run on application startup. Run it again when the source resumes change. The app's configured Qdrant collection and Neo4j database must contain the indexed data before visitors can get answers.

## Hosting and deployment

GitHub hosts the source repository. The interactive RAG feature uses a dynamic Next.js API route, so a static-only host such as GitHub Pages cannot run the complete application. Deploy the repository to a Node.js-compatible Next.js host such as Vercel, or another host that supports Next.js server routes.

For a hosted deployment:

1. Push this project to a GitHub repository.
2. Import that repository into the chosen Next.js host.
3. Configure the environment variables listed above as server-side deployment secrets.
4. Ensure Qdrant and Neo4j are reachable from the host.
5. Run `npm run index:resumes` once against the same cloud Qdrant collection and Neo4j database used by the deployed app. Keep the PDFs local or in a controlled indexing environment rather than committing them.
6. Deploy and test a question against the live application.

The query API consumes Gemini and database resources. Set suitable provider quotas and billing alerts before making the endpoint public. Resume text sent to Gemini and stored in Qdrant/Neo4j should be content you are comfortable using for a public resume Q&A experience.

## Tests

```powershell
npm run test:rag
npm run build
```

The RAG unit tests cover stable overlapping chunking and known-entity extraction.
