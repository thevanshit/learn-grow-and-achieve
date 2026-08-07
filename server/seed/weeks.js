// 40 weeks of tasks from the GSoC 2027 week-by-week schedule
export const weeks = [
  // Batch 1 (wk 1-2)
  { id: 1, batch_id: 1, week: 1, title: 'Git Basics', read: '#1 Head First Git ch 1-6 (basics, branches, merging)', do: 'Create GitHub profile; init first repo; commit daily' },
  { id: 2, batch_id: 1, week: 2, title: 'Git Collaboration + Math', read: '#1 Head First Git ch 7-12 (PRs, collaboration, recovery) + #2 Essential Math (linear algebra, calculus)', do: 'Fork a repo → branch → PR (docs/typo fix); math notebook with SymPy/NumPy' },
  // Batch 2 (wk 3-4)
  { id: 3, batch_id: 2, week: 3, title: 'Python Mastery', read: '#3 Python Cookbook (data structures, iterators, generators, concurrency)', do: 'Refactor portfolio code to idiomatic Python; add type hints + logging' },
  { id: 4, batch_id: 2, week: 4, title: 'Statistics Foundations', read: '#4 Practical Statistics (distributions, hypothesis testing, Bayes, MLE)', do: 'Stats notebook: simulate distributions, run t-tests, compute KL divergence' },
  // Batch 3 (wk 5-7)
  { id: 5, batch_id: 3, week: 5, title: 'ML Basics', read: '#5 Hands-On ML w/ PyTorch (ch 1-4: ML basics, training)', do: 'Project: end-to-end tabular ML (clean EDA → model → eval)' },
  { id: 6, batch_id: 3, week: 6, title: 'Deep Architectures', read: '#5 Hands-On ML (ch 5-8: ensembles, CNNs, RNNs)', do: 'Project: classification + feature importance' },
  { id: 7, batch_id: 3, week: 7, title: 'From-Scratch NN', read: '#6 Deep Learning from Scratch (full) + #7 Fundamentals of DL (theory)', do: 'Portfolio #1: from-scratch NN + autograd mini-library' },
  // Batch 4 (wk 8-11)
  { id: 8, batch_id: 4, week: 8, title: 'LLM Foundations', read: '#8 Hands-On LLMs (ch 1-4: tokenization, embeddings, attention)', do: 'Build a tokenizer/embedding playground' },
  { id: 9, batch_id: 4, week: 9, title: 'LLM Training & Eval', read: '#8 Hands-On LLMs (ch 5-8: training, fine-tuning, eval)', do: 'Fine-tune a small model; build an eval harness' },
  { id: 10, batch_id: 4, week: 10, title: 'Hugging Face Deep-Dive', read: '#9 NLP with Transformers (ch 1-4: HF, tokenizers, fine-tuning)', do: 'Portfolio #2: fine-tuned model on Hugging Face Hub' },
  { id: 11, batch_id: 4, week: 11, title: 'Generative Models + AI Framework', read: '#10 Generative Deep Learning (diffusion) + #11 AI Engineering (framework)', do: 'Build a small diffusion demo; write your AI-app decision framework' },
  // Batch 5 (wk 12-16)
  { id: 12, batch_id: 5, week: 12, title: 'Prompt Engineering', read: '#12 Prompt Engineering for GenAI', do: 'Prompt library + evaluation notebook' },
  { id: 13, batch_id: 5, week: 13, title: 'LLM App Design', read: '#13 Designing LLM Applications', do: 'Portfolio #3: RAG / document-QA app with evals' },
  { id: 14, batch_id: 5, week: 14, title: 'Vector Databases', read: '#15 Vector Databases', do: 'Turn a Postgres/SQLite DB into a vector store; compare ANN indexes' },
  { id: 15, batch_id: 5, week: 15, title: 'Production RAG', read: '#16 Hands-On RAG for Production (basic → hybrid → agentic RAG)', do: 'Upgrade RAG app: hybrid search + reranking' },
  { id: 16, batch_id: 5, week: 16, title: 'GenAI Design Patterns', read: '#14 Generative AI Design Patterns', do: 'Add guardrails + caching + cost controls to RAG app' },
  // Batch 6 (wk 17-21)
  { id: 17, batch_id: 6, week: 17, title: 'Agent Design', read: '#17 Building Applications with AI Agents (ch 1-4: agent design, tools, memory)', do: 'Portfolio #4: tool-using agent' },
  { id: 18, batch_id: 6, week: 18, title: 'Multi-Agent Systems', read: '#17 Building Applications with AI Agents (ch 5-8: multi-agent, reliability)', do: 'Add multi-agent orchestration + retry/recovery' },
  { id: 19, batch_id: 6, week: 19, title: 'MCP Protocol', read: '#18 AI Agents with MCP', do: 'Portfolio #4b: MCP server + client (expose your agent\'s tools)' },
  { id: 20, batch_id: 6, week: 20, title: 'LLMOps + Evals', read: '#19 LLMOps + #20 Evals for AI Engineers', do: 'Portfolio #5: eval + observability harness (LLM-as-judge, tracing)' },
  { id: 21, batch_id: 6, week: 21, title: 'Fine-Tuning + RLHF', read: '#21 LLMs in Production + #22 Deep RL with Python (RLHF/PPO)', do: 'Fine-tune with LoRA; run an RLHF/PPO experiment' },
  // Batch 7 (wk 22-26)
  { id: 22, batch_id: 7, week: 22, title: 'Vision Language Models', read: '#23 Vision Language Models', do: 'Fine-tune a small VLM; build an image-captioning app' },
  { id: 23, batch_id: 7, week: 23, title: 'Audio AI', read: '#24 Learn OpenAI Whisper', do: 'Build a transcription + TTS pipeline' },
  { id: 24, batch_id: 7, week: 24, title: 'GPU Performance', read: '#25 AI Systems Performance Engineering', do: 'Profile a PyTorch model; apply mixed precision + CUDA graphs' },
  { id: 25, batch_id: 7, week: 25, title: 'Distributed Training', read: '#26 Deep Learning at Scale + #27 Distributed ML Patterns', do: 'Run a multi-GPU training job (DDP/FSDP); write a scaling write-up' },
  { id: 26, batch_id: 7, week: 26, title: 'AI Security', read: '#28 Practical AI Security + #29 AI-Native LLM Security', do: 'Red-team your own agent; add guardrails + sandboxing' },
  // Batch 8 (Week 27-31)
  { id: 27, batch_id: 8, week: 27, title: 'FastAPI Backend', read: '#30 FastAPI', do: 'Build the backend of your RAG app (auth, rate limiting, streaming)' },
  { id: 28, batch_id: 8, week: 28, title: 'GenAI Services', read: '#31 Building GenAI Services with FastAPI', do: 'Portfolio #6: full-stack LLM app (FastAPI + Postgres + vector store)' },
  { id: 29, batch_id: 8, week: 29, title: 'SQL Mastery', read: '#32 Learning SQL + #33 SQL Antipatterns', do: 'Design + build Postgres schema; practice LeetCode SQL' },
  { id: 30, batch_id: 8, week: 30, title: 'DB Internals + Distributed', read: '#34 Database Internals + #35 Designing Data-Intensive Applications', do: 'Indexing experiments; write a replication/sharding design' },
  { id: 31, batch_id: 8, week: 31, title: 'Event-Driven Systems', read: '#36 Designing Distributed Systems + #37 Kafka', do: 'Build a small event-driven pipeline (Kafka/Pub-Sub)' },
  // Batch 9 (Week 32-37)
  { id: 32, batch_id: 9, week: 32, title: 'ML Systems Design', read: '#38 Designing ML Systems', do: 'Architecture doc for your RAG app (data, training, serving, monitoring)' },
  { id: 33, batch_id: 9, week: 33, title: 'MLOps + Data Engineering', read: '#39 Practical MLOps + #40 Fundamentals of Data Engineering', do: 'Build a data pipeline (batch + streaming); add experiment tracking' },
  { id: 34, batch_id: 9, week: 34, title: 'Containers + Kubernetes', read: '#41 Docker: Up & Running + #42 Cloud Native DevOps w/ K8s', do: 'Containerize all portfolio apps; deploy one to a cluster' },
  { id: 35, batch_id: 9, week: 35, title: 'DevOps + CI/CD', read: '#43 Fundamentals of DevOps + #46 Learning GitHub Actions', do: 'Portfolio #7: CI/CD on every repo (lint, test, build, release)' },
  { id: 36, batch_id: 9, week: 36, title: 'Linux + Cloud', read: '#44 Linux Pocket Guide + #45 AWS Cookbook', do: 'Linux command drills; deploy one app to AWS (EC2/S3/Lambda)' },
  { id: 37, batch_id: 9, week: 37, title: 'Open-Source Ramp-Up', read: '#46 Learning GitHub Actions (deep)', do: 'Open-source ramp-up: first real PRs to target orgs' },
  // Batch 10 (Week 38-40)
  { id: 38, batch_id: 10, week: 38, title: 'Software Architecture', read: '#47 Fundamentals of Software Architecture + #48 The Hard Parts', do: 'Architecture diagrams + trade-off write-up for portfolio apps' },
  { id: 39, batch_id: 10, week: 39, title: 'System Design + LLD', read: '#49 Head First SW Architecture + #50 System Design on AWS + #51 Design Patterns', do: 'Portfolio #8: scalable system design write-up; LLD practice (Parking Lot, Splitwise)' },
  { id: 40, batch_id: 10, week: 40, title: 'Interviews + DSA', read: '#52 Building Microservices + #53 Learning Algorithms + #54 ML Interviews', do: 'Mock interviews; drill DSA + ML fundamentals + behaviorals' }
];