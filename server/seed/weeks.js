// 40 weeks of tasks from the GSoC 2027 week-by-week schedule (77-book numbering)
export const weeks = [
  // Batch 1 (wk 1-2)
  { id: 1, batch_id: 1, week: 1, title: 'Git Basics', read: '#1 Head First Git ch 1-6 (basics, branches, merging)', do: 'Create GitHub profile; init first repo; commit daily' },
  { id: 2, batch_id: 1, week: 2, title: 'Git Collaboration + Math', read: '#1 Head First Git ch 7-12 (PRs, collaboration, recovery) + #2 Essential Math (linear algebra, calculus)', do: 'Fork a repo → branch → PR (docs/typo fix); math notebook with SymPy/NumPy' },
  // Batch 2 (wk 3-4)
  { id: 3, batch_id: 2, week: 3, title: 'Python Mastery', read: '#3 Python Cookbook (data structures, iterators, generators, concurrency)', do: 'Refactor portfolio code to idiomatic Python; add type hints + logging' },
  { id: 4, batch_id: 2, week: 4, title: 'Statistics + Causality', read: '#8 Practical Statistics (distributions, hypothesis testing, Bayes, MLE) + #9 Causal Inference (DAGs, A/B testing)', do: 'Stats notebook: simulate distributions, t-tests, KL divergence; simulate an A/B test' },
  // Batch 3 (wk 5-7)
  { id: 5, batch_id: 3, week: 5, title: 'ML Basics', read: '#10 Hands-On ML w/ PyTorch (ch 1-4: ML basics, training)', do: 'Project: end-to-end tabular ML (clean EDA → model → eval)' },
  { id: 6, batch_id: 3, week: 6, title: 'From-Scratch NN', read: '#10 Hands-On ML (ch 5-8: ensembles, CNNs, RNNs) + #11 Deep Learning from Scratch (full)', do: 'Portfolio #1: from-scratch NN + autograd mini-library' },
  { id: 7, batch_id: 3, week: 7, title: 'Applied ML: Interpretability, Forecasting, RecSys', read: '#12 Fundamentals of DL (theory) + #14 Interpretable ML + #15 Forecasting + #16 Practical Recommender Systems', do: 'DL theory notes; run SHAP on your model; forecast a time series; build a mini recsys' },
  // Batch 4 (wk 8-11)
  { id: 8, batch_id: 4, week: 8, title: 'LLM Foundations', read: '#18 Hands-On LLMs (ch 1-4: tokenization, embeddings, attention)', do: 'Build a tokenizer/embedding playground' },
  { id: 9, batch_id: 4, week: 9, title: 'LLM Training + HF', read: '#18 Hands-On LLMs (ch 5-8: training, fine-tuning, eval) + #17 NLP with Transformers (ch 1-4: HF, tokenizers)', do: 'Portfolio #2: fine-tuned model on Hugging Face Hub' },
  { id: 10, batch_id: 4, week: 10, title: 'Attention Internals + GPT from Scratch', read: '#21 Build a Large Language Model (From Scratch) — attention, KV cache, MQA/GQA, pretraining', do: 'Portfolio #3: GPT trained from scratch — attention internals mastery' },
  { id: 11, batch_id: 4, week: 11, title: 'Generative Models + AI Framework', read: '#19 Generative Deep Learning (diffusion) + #20 AI Engineering (framework)', do: 'Build a small diffusion demo; write your AI-app decision framework' },
  // Batch 5 (wk 12-15)
  { id: 12, batch_id: 5, week: 12, title: 'Prompt Engineering', read: '#22 Prompt Engineering for GenAI', do: 'Prompt library + evaluation notebook' },
  { id: 13, batch_id: 5, week: 13, title: 'LLM App Design', read: '#23 Designing LLM Applications', do: 'Portfolio #4: RAG / document-QA app with evals' },
  { id: 14, batch_id: 5, week: 14, title: 'Vector Databases', read: '#25 Vector Databases', do: 'Turn a Postgres/SQLite DB into a vector store; compare ANN indexes' },
  { id: 15, batch_id: 5, week: 15, title: 'Production RAG + Patterns + Context Engineering', read: '#26 Hands-On RAG for Production + #24 Generative AI Design Patterns + #27 Hands-On Context Engineering', do: 'Upgrade RAG app: hybrid search + reranking + guardrails/caching; Portfolio #5: context-engineered agent app' },
  // Batch 6 (wk 16-19)
  { id: 16, batch_id: 6, week: 16, title: 'Agent Design', read: '#28 Building Applications with AI Agents (ch 1-4: agent design, tools, memory)', do: 'Portfolio #6: tool-using agent' },
  { id: 17, batch_id: 6, week: 17, title: 'Multi-Agent + MCP', read: '#28 Building Applications with AI Agents (ch 5-8: multi-agent, reliability) + #29 AI Agents with MCP', do: 'Multi-agent orchestration + Portfolio #6b: MCP server + client' },
  { id: 18, batch_id: 6, week: 18, title: 'LLMOps + Evals', read: '#30 LLMOps + #31 AI Model Evaluation', do: 'Portfolio #7: eval + observability harness (LLM-as-judge, tracing)' },
  { id: 19, batch_id: 6, week: 19, title: 'Fine-Tuning + RLHF/DPO/GRPO', read: '#32 LLMs in Production + #34 Deep RL in Action (RL foundations) + #35 RLHF (PPO, DPO, GRPO)', do: 'Fine-tune with LoRA; Portfolio #8: RL fine-tuning experiment (PPO/DPO/GRPO with TRL)' },
  // Batch 7 (wk 20-22)
  { id: 20, batch_id: 7, week: 20, title: 'Vision Language Models', read: '#36 Vision Language Models', do: 'Fine-tune a small VLM; build an image-captioning app' },
  { id: 21, batch_id: 7, week: 21, title: 'Audio AI', read: '#37 Automatic Speech Recognition (Whisper/ASR)', do: 'Build a transcription + TTS pipeline' },
  { id: 22, batch_id: 7, week: 22, title: 'GPU Performance + Scale + Security', read: '#38 AI Systems Performance Engineering + #39 Deep Learning at Scale + #40 Practical AI Security', do: 'Profile a PyTorch model; mixed precision + CUDA graphs; multi-GPU job; red-team your own agent; add guardrails + sandboxing' },
  // Batch 8 (wk 23-24)
  { id: 23, batch_id: 8, week: 23, title: 'Operating Systems', read: '#41 Operating Systems: Three Easy Pieces', do: 'OS drills: processes, threads, deadlock, virtual memory, scheduling' },
  { id: 24, batch_id: 8, week: 24, title: 'Computer Networking', read: '#42 Computer Networking: A Top-Down Approach', do: 'Networking drills: HTTP, TCP/UDP, DNS, load balancing, CDN' },
  // Batch 9 (wk 25-29)
  { id: 25, batch_id: 9, week: 25, title: 'FastAPI Backend', read: '#43 FastAPI', do: 'Build the backend of your RAG app (auth, rate limiting, streaming)' },
  { id: 26, batch_id: 9, week: 26, title: 'GenAI Services + React', read: '#44 Building GenAI Services with FastAPI + #47 Learning React', do: 'Portfolio #9: full-stack LLM app (FastAPI + React + Postgres + Redis)' },
  { id: 27, batch_id: 9, week: 27, title: 'SQL Mastery', read: '#48 Learning SQL + #49 SQL Antipatterns', do: 'Design + build Postgres schema; practice LeetCode SQL' },
  { id: 28, batch_id: 9, week: 28, title: 'Caching + DB Internals + NoSQL', read: '#50 Redis in Action + #51 Database Internals + #52 NoSQL Distilled', do: 'Add a Redis caching layer; indexing experiments; NoSQL comparison write-up' },
  { id: 29, batch_id: 9, week: 29, title: 'Distributed Systems + Kafka + Spark', read: '#53 Designing Data-Intensive Applications + #54 Designing Distributed Systems + #55 Kafka + #57 Learning Spark', do: 'Replication/sharding design; event-driven pipeline; run a Spark job' },
  // Batch 10 (wk 30-34)
  { id: 30, batch_id: 10, week: 30, title: 'ML Systems Design', read: '#58 Designing ML Systems', do: 'Architecture doc for your RAG app (data, training, serving, monitoring)' },
  { id: 31, batch_id: 10, week: 31, title: 'MLOps + Data Engineering', read: '#59 Practical MLOps + #60 Fundamentals of Data Engineering', do: 'Build a data pipeline (batch + streaming); add experiment tracking' },
  { id: 32, batch_id: 10, week: 32, title: 'Containers + Kubernetes', read: '#61 Docker: Up & Running + #62 Cloud Native DevOps w/ K8s', do: 'Containerize all portfolio apps; deploy one to a cluster' },
  { id: 33, batch_id: 10, week: 33, title: 'DevOps + CI/CD', read: '#63 Fundamentals of DevOps + #65 Learning GitHub Actions', do: 'Portfolio #10: CI/CD on every repo (lint, test, build, release)' },
  { id: 34, batch_id: 10, week: 34, title: 'Linux + Cloud', read: '#64 Linux Pocket Guide + #66 AWS Cookbook', do: 'Linux command drills; deploy one app to AWS (EC2/S3/Lambda)' },
  // Batch 11 (wk 35-40)
  { id: 35, batch_id: 11, week: 35, title: 'Software Architecture', read: '#68 Fundamentals of Software Architecture', do: 'Architecture diagrams + trade-off write-up for portfolio apps' },
  { id: 36, batch_id: 11, week: 36, title: 'Trade-offs + LLD', read: '#69 Software Architecture: The Hard Parts + #70 Head First Design Patterns', do: 'Trade-off analysis; LLD practice (Parking Lot, Splitwise)' },
  { id: 37, batch_id: 11, week: 37, title: 'Microservices + Cloud HLD', read: '#71 Building Microservices + #72 System Design on AWS', do: 'Microservices decomposition; cloud HLD for your portfolio app' },
  { id: 38, batch_id: 11, week: 38, title: 'System Design Interview', read: '#73 System Design Interview (Alex Xu)', do: 'Portfolio #11: scalable system design write-up; mock design rounds' },
  { id: 39, batch_id: 11, week: 39, title: 'ML Interviews', read: '#75 Machine Learning Interviews + #76 ML Python Cookbook + #77 ML Design Patterns', do: 'Mock interviews; drill ML fundamentals + behaviorals' },
  { id: 40, batch_id: 11, week: 40, title: 'Mock Interview Week', read: 'Review #41 OS, #42 Networking, #53 DDIA, #73 System Design Interview', do: '2-3 full mock loops: DSA + ML + system design + behavioral' }
];