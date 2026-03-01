<img width="1408" height="768" alt="sentinel-supreme-architecture" src="https://github.com/user-attachments/assets/5950fac0-bb39-46b8-bc7e-4db8cca9d02c" />

# 🛡️ Sentinel-Supreme: Autonomous Security Operations Center (ASOC)

**Sentinel-Supreme** is a high-performance, enterprise-grade SaaS platform designed to revolutionize how organizations handle security threats. By leveraging **AI Agents** and a distributed microservices architecture, it automates the investigation of security logs in real-time, distinguishing between actual cyber-attacks and human errors.

## 🚀 Key Features

- **Real-time Log Streaming:** Ingests thousands of security events per second using a scalable NestJS & RabbitMQ pipeline.

- **AI-Powered Investigation:** Autonomous agents (LangChain) analyze anomalies by querying a Vector Database for historical patterns.

- **Hybrid Data Architecture:** Optimized storage using PostgreSQL for relational data and MongoDB for unstructured high-volume logs.

- **Live Security Dashboard:** A React-based command center featuring real-time data visualization via WebSockets.

- **Smart Alerting:** Reduces "alert fatigue" by summarizing risk levels and providing actionable insights.

---

## 🏗️ System Architecture

The system is built with a focus on **Resilience**, **Scalability**, and **Intelligence**:

### 1\. Ingestion Layer (NestJS & RabbitMQ)

- Handles massive bursts of traffic (e.g. during DDoS attacks).

- Uses **RabbitMQ** as a message broker to decouple log ingestion from processing, ensuring zero data loss.

### 2\. Analysis Layer (AI & Vector DB)

- **AI Agents:** Powered by **LangChain**, these agents perform deep-dive investigations on suspicious logs.

- **Vector Database:** Stores embedded security patterns to find similarities with past incidents (RAG - Retrieval-Augmented Generation).

### 3\. Data Layer (The Hybrid Approach)

- **PostgreSQL:** Manages Structured data: User profiles, RBAC (Role-Based Access Control), and incident status.

- **MongoDB:** Acts as a Data Lake for **Raw Logs**, providing the flexibility needed for unstructured security telemetry.

### 4\. Frontend Layer (React & TypeScript)

- Built for Security Analysts.

- Features real-time charts, incident drill-downs, and a live "Threat Map" powered by **WebSockets**.

---

## 🛠️ Tech Stack

| **Layer**          | **Technology**                                   |
| ------------------ | ------------------------------------------------ |
| **Backend**        | NestJS, TypeScript                               |
| **Message Broker** | RabbitMQ                                         |
| **Frontend**       | React, TypeScript, TailwindCSS                   |
| **Databases**      | PostgreSQL, MongoDB, Vector DB (Chroma/Pinecone) |
| **AI Framework**   | LangChain, OpenAI/Ollama                         |
| **Real-time**      | Socket.io / WebSockets                           |

---

## 🚦 Getting Started (Development)

### Prerequisites

- Node.js (v18+)

- Docker (for RabbitMQ & Databases)

- API Keys for your LLM provider (e.g. OpenAI)

### Installation

1.  **Clone the repository:**

    Bash

    ```
    git clone https://github.com/your-username/sentinel-supreme.git
    cd sentinel-supreme

    ```

2.  **Setup Environment Variables:**

    Create a `.env` file in the root directory and add your credentials for Postgres, Mongo, and RabbitMQ.

3.  **Run with Docker Compose:**

    Bash

    ```
    docker-compose up -d

    ```

4.  **Install dependencies and start services:**

    Bash

    ```
    npm install
    npm run start:dev

    ```

---

## 🛡️ Security & Compliance

Sentinel-Supreme is designed with **RBAC** at its core, ensuring that sensitive security logs are only accessible to authorized personnel. All AI-driven decisions are logged for auditing purposes.

## 🗺️ Project Roadmap & Progress

I'm building **Sentinel-Supreme** in structured phases. You can track my progress below:

### 🏗️ Phase 1: The Distributed Foundation (In Progress)

- [x] Monorepo Setup (Nx, NestJS, React)
- [x] Dockerized Infrastructure (Postgres, Mongo, RabbitMQ)
- [ ] Implement RabbitMQ Producer/Consumer Flow
- [ ] Data Persistence Layer (Prisma & Mongoose)
- [ ] Real-time Dashboard (WebSockets)

### 🧠 Phase 2: AI & Analysis Layer

- [ ] Integration with LangChain & OpenAI
- [ ] Vector Database setup for Similarity Search
- [ ] Autonomous Investigation Agent logic
- [ ] Risk Scoring Engine

### 🔐 Phase 3: Enterprise Features & Scaling

- [ ] Role-Based Access Control (RBAC)
- [ ] Rate Limiting & DDoS Protection
- [ ] Caching with Redis
- [ ] Full DevOps Pipeline (CI/CD)

---

**Developed with ❤️ by sukenik**
