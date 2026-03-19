# Synapse - RAG Workspace Platform

> A modern notebook-first AI research workspace where users upload sources, ask grounded questions, and get citation-aware answers.

<p align="left">
  <a href="client/README.md"><img src="https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite%208-0ea5e9?style=for-the-badge&logo=react&logoColor=white" alt="Frontend" /></a>
  <a href="server/README.md"><img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%205-16a34a?style=for-the-badge&logo=node.js&logoColor=white" alt="Backend" /></a>
  <img src="https://img.shields.io/badge/Database-MongoDB-22c55e?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Cache-Redis-dc2626?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/RAG-Hugging%20Face-f59e0b?style=for-the-badge&logo=huggingface&logoColor=black" alt="RAG" />
</p>

---

## Start Here (Important)

This root README is intentionally brief.

For full architecture, workflows, models, API contracts, testing notes, production guidance, and troubleshooting, jump to the specialized docs:

- Frontend documentation: [client/README.md](client/README.md)
- Backend documentation: [server/README.md](server/README.md)

If you want to understand the whole system quickly:

1. Read [client/README.md](client/README.md) for product UI, routing, state flow, and user journeys.
2. Read [server/README.md](server/README.md) for RAG pipeline internals, data models, API behavior, and infra details.

## Project in One Minute

This project is a full-stack Synapse system with two tightly connected layers:

- Frontend: A cinematic, responsive React app for notebooks, source management, profile management, and AI chat UX.
- Backend: A Node.js Express API that ingests PDFs, chunks content, generates embeddings, retrieves and reranks context, and returns grounded answers with citations.

## System Snapshot

```mermaid
flowchart LR
  U[User] --> F[Frontend App]
  F --> B[Backend API]
  B --> M[(MongoDB)]
  B --> R[(Redis)]
  B --> H[HF Embedding + Rerank + LLM]
```

## Why Two Dedicated READMEs?

Because this project has real depth in both layers:

- The frontend and backend each have different architecture concerns.
- Keeping deep docs separated makes onboarding faster and maintenance cleaner.
- You get focused, production-ready guidance without one giant unreadable file.

## Quick Local Run

1. Start backend from [server](server).
2. Start frontend from [client](client).
3. Open the frontend app and begin the notebook workflow.

Detailed setup commands and environment variables are documented in:

- [client/README.md](client/README.md)
- [server/README.md](server/README.md)

---

## Navigation Shortcuts

- Frontend deep dive: [client/README.md](client/README.md)
- Backend deep dive: [server/README.md](server/README.md)
