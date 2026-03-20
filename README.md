<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&height=180&text=Synapse%20RAG%20Workspace&fontSize=42&fontAlignY=35&animation=twinkling&color=0:0f172a,30:1d4ed8,70:0ea5e9,100:22d3ee" alt="Synapse banner" />

<h3>Notebook-first AI research workspace with grounded answers and citations</h3>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=20&duration=2600&pause=900&color=0EA5E9&center=true&vCenter=true&width=980&lines=Upload+PDF+sources+%E2%86%92+Build+context+%E2%86%92+Ask+better+questions;Hybrid+RAG+pipeline+with+retrieval%2C+rerank%2C+and+citation-aware+responses;Cinematic+React+frontend+%2B+Node.js+Express+backend" alt="Typing header" />

<br />

<a href="https://synapse-nu-sable.vercel.app/"><img src="https://img.shields.io/badge/Live%20Website-Open%20Now-0ea5e9?style=for-the-badge&logo=vercel&logoColor=white" alt="Live website" /></a>
<a href="client/README.md"><img src="https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite%208-0284c7?style=for-the-badge&logo=react&logoColor=white" alt="Frontend docs" /></a>
<a href="server/README.md"><img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%205-15803d?style=for-the-badge&logo=node.js&logoColor=white" alt="Backend docs" /></a>

<br />

<img src="https://img.shields.io/badge/Database-MongoDB-22c55e?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
<img src="https://img.shields.io/badge/Cache-Redis-dc2626?style=flat-square&logo=redis&logoColor=white" alt="Redis" />
<img src="https://img.shields.io/badge/Containers-Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
<img src="https://img.shields.io/badge/RAG-Hugging%20Face-f59e0b?style=flat-square&logo=huggingface&logoColor=black" alt="Hugging Face" />

</div>

---

## What Is Synapse?

Synapse is a full-stack RAG workspace for research-heavy workflows.
Users can upload source files, organize notebooks, and ask questions that are answered with retrieved context and citations.

## Architecture At A Glance

- Frontend: Cinematic, responsive React application for notebook management, sources, auth/profile flows, and chat UX.
- Backend: Node.js + Express API that performs PDF ingestion, chunking, embedding, retrieval, reranking, and grounded response generation.
- Infra: MongoDB for persistent data, Redis for cache/performance, container-friendly deployment.

```mermaid
flowchart LR
  U[User] --> F[Frontend App]
  F --> B[Backend API]
  B --> M[(MongoDB)]
  B --> R[(Redis)]
  B --> H[Embedding + Rerank + LLM]
```

## Start Here

This root README is your launch point. Detailed implementation docs are split by layer for faster onboarding:

1. Frontend docs: [client/README.md](client/README.md)
2. Backend docs: [server/README.md](server/README.md)

## Quick Local Run

1. Start the backend from [server](server).
2. Start the frontend from [client](client).
3. Open the app and begin the notebook workflow.

For setup commands, env variables, architecture notes, and troubleshooting:

- [client/README.md](client/README.md)
- [server/README.md](server/README.md)

---

## Navigation

- Live app: [https://synapse-nu-sable.vercel.app/](https://synapse-nu-sable.vercel.app/)
- Frontend deep dive: [client/README.md](client/README.md)
- Backend deep dive: [server/README.md](server/README.md)

<div align="center">
  <img width="100%" src="https://capsule-render.vercel.app/api?type=rect&height=80&section=footer&text=Build%20With%20Context%20.%20Answer%20With%20Evidence&fontSize=20&color=0:0f172a,40:1e40af,70:0ea5e9,100:67e8f9" alt="footer banner" />
</div>
