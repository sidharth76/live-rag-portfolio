# Resume RAG demo setup

The interactive playground uses a server-side Next.js route. Browser code never receives Gemini, Qdrant, or Neo4j credentials. The same environment variable names are used by the local app, one-time indexer, and deployed Next.js service.

## Configure credentials

1. Rotate the Gemini, Qdrant, and Neo4j credentials previously pasted into chat before using them.
2. Copy `.env.example` to `.env.local`.
3. Add the new Gemini API key and rotated Qdrant and Neo4j credentials to `.env.local`. Do not use `NEXT_PUBLIC_` prefixes, commit this file, or paste secret values into source files.
4. The selected models are `gemini-embedding-001` for resume text embeddings and `gemini-3.8-flash` for answers. Keep these models consistent between indexing and queries.

The indexer checks the embedding size returned by Gemini when it creates the Qdrant collection. If the configured collection already exists with a different vector size, indexing stops with an actionable error; use a new collection name or resolve the collection configuration rather than deleting indexed data blindly.

If indexing stops at `embed_first_resume_chunk` with `API_KEY_INVALID`, `GEMINI_API_KEY` is not a valid Gemini API key. Create a valid key in Google AI Studio, set it in `.env.local`, restart the dev server, and retry indexing. A Google project/client identifier is not an API key.

## Index the PDFs once

The indexer reads every PDF in `Resume PDFs/`, keeps the source filename and page number as internal metadata, creates overlapping text chunks, and stores vectors in Qdrant. It also creates `ResumeDocument`, `ResumeChunk`, and `ResumeEntity` nodes in Neo4j, linked by `HAS_CHUNK` and `MENTIONS` relationships. The entity links use a fixed vocabulary of technologies, projects, and organizations relevant to the resume. Generated answers use concise plain text without source references; bold formatting is used only when requested.

Run from the project root after credentials are configured:

```powershell
npm run index:resumes
```

Stable chunk IDs and Qdrant/Neo4j upserts make reruns idempotent. Indexing is a manual operation and is not triggered by page requests or deployment startup. Run it locally or as a controlled deployment task using the same cloud service credentials.

## Run locally and deploy

```powershell
npm run dev
```

Open `http://localhost:3000`. Set the same environment variables as server-side deployment secrets for the deployed Next.js app. Deploy the app to a Node.js-compatible Next.js host and keep the RAG route enabled; this is not a static-export-only feature. Index the PDFs once against the shared hosted Qdrant and Neo4j services before enabling visitor queries.

## Operational notes

- Visitor questions are limited to 500 characters. The API returns errors instead of fabricated answers when a service call fails.
- The public query endpoint uses Gemini and cloud database quotas. Configure provider billing alerts and quota limits, and monitor usage before sharing the public URL.
- Resume text is sent to Gemini for embeddings and answer generation and is stored in Qdrant and Neo4j. Only include documents you intend to expose through a public portfolio Q&A.
- The contact form and other portfolio sections are not part of this RAG feature and are unchanged.
