// 56 books from the Books.md roadmap
export const books = [
  // Batch 1
  { id: 1, batch_id: 1, title: 'Head First Git', author: 'Raju Gandhi', publisher: 'O\'Reilly', year: 2022, covers: 'Git & GitHub end-to-end — branches, merging, rebasing, pull requests, collaboration workflows.' },
  { id: 2, batch_id: 1, title: 'Essential Math for Data Science', author: 'Thomas Nield', publisher: 'O\'Reilly', year: 2022, covers: 'Linear algebra, calculus, probability, statistics, optimization — all in Python (SymPy, NumPy).' },
  // Batch 2
  { id: 3, batch_id: 2, title: 'Python Cookbook', author: 'David M. Beazley & Brian K. Jones', publisher: 'O\'Reilly', year: 2013, covers: 'Idiomatic Python — data structures, iterators, generators, concurrency, packaging, performance.' },
  { id: 4, batch_id: 2, title: 'Practical Statistics for Data Scientists', author: 'Peter Bruce, Andrew Bruce & Peter Gedeck', publisher: 'O\'Reilly', year: 2020, covers: 'Distributions, sampling, hypothesis testing, regression, Bayes, MLE, cross-entropy, KL divergence.' },
  // Batch 3
  { id: 5, batch_id: 3, title: 'Hands-On Machine Learning with Scikit-Learn and PyTorch', author: 'Aurélien Géron', publisher: 'O\'Reilly', year: 2025, covers: 'Complete ML lifecycle — regression, classification, ensembles, CNNs, RNNs, transformers, diffusion, fine-tuning LLMs, RL.' },
  { id: 6, batch_id: 3, title: 'Deep Learning from Scratch', author: 'Seth Weidman', publisher: 'O\'Reilly', year: 2019, covers: 'Neural networks in raw Python + NumPy — forward/backward propagation, gradients, autograd.' },
  { id: 7, batch_id: 3, title: 'Fundamentals of Deep Learning', author: 'Nithin Buduma & Nikhil Buduma', publisher: 'O\'Reilly', year: 2021, covers: 'DL theory — architectures, optimization, regularization, CNNs, RNNs, attention, transformers.' },
  // Batch 4
  { id: 8, batch_id: 4, title: 'Hands-On Large Language Models', author: 'Jay Alammar & Maarten Grootendorst', publisher: 'O\'Reilly', year: 2024, covers: 'LLMs end-to-end — tokenization, embeddings, attention, transformers, training, fine-tuning, evaluation, RAG.' },
  { id: 9, batch_id: 4, title: 'Natural Language Processing with Transformers', author: 'Lewis Tunstall, Leandro von Werra & Thomas Wolf', publisher: 'O\'Reilly', year: 2022, covers: 'Hugging Face Transformers — architecture, tokenizers, datasets, fine-tuning, distillation.' },
  { id: 10, batch_id: 4, title: 'Generative Deep Learning', author: 'David Foster', publisher: 'O\'Reilly', year: 2022, covers: 'GANs, VAEs, diffusion models, transformer-based generation.' },
  { id: 11, batch_id: 4, title: 'AI Engineering', author: 'Chip Huyen', publisher: 'O\'Reilly', year: 2025, covers: 'Building apps with foundation models — AI stack, prompt engineering, RAG, fine-tuning, agents, evals, deployment.' },
  // Batch 5
  { id: 12, batch_id: 5, title: 'Prompt Engineering for Generative AI', author: 'James Phoenix & Mike Taylor', publisher: 'O\'Reilly', year: 2024, covers: 'Prompt patterns — zero-shot, few-shot, CoT, self-consistency, ToT, ReAct, structured output, eval.' },
  { id: 13, batch_id: 5, title: 'Designing Large Language Model Applications', author: 'Suhas Pai', publisher: 'O\'Reilly', year: 2025, covers: 'End-to-end LLM app design — system design, retrieval, structured outputs, evals, deployment trade-offs.' },
  { id: 14, batch_id: 5, title: 'Generative AI Design Patterns', author: 'Valliappa Lakshmanan & Hannes Hapke', publisher: 'O\'Reilly', year: 2025, covers: 'Reusable GenAI patterns — RAG, agents, guardrails, evals, caching, cost control.' },
  { id: 15, batch_id: 5, title: 'Vector Databases', author: 'Nitin Borwankar', publisher: 'O\'Reilly', year: 2026, covers: 'Embeddings, vector search, ANN, cosine similarity, SQL-to-vector DB, RAG integration.' },
  { id: 16, batch_id: 5, title: 'Hands-On RAG for Production', author: 'Ofer Mendelevitch & Forrest Sheng Bao', publisher: 'O\'Reilly', year: 2026, covers: 'Production RAG — ingestion, embeddings, hybrid search, agentic RAG, GraphRAG, reranking.' },
  // Batch 6
  { id: 17, batch_id: 6, title: 'Building Applications with AI Agents', author: 'Michael Albada', publisher: 'O\'Reilly', year: 2025, covers: 'Agent architectures — planning, reflection, tool calling, memory, multi-agent systems, reliability.' },
  { id: 18, batch_id: 6, title: 'AI Agents with MCP', author: 'Kyle Stratis', publisher: 'O\'Reilly', year: 2026, covers: 'Model Context Protocol — architecture, tools, resources, servers, clients, building MCP servers.' },
  { id: 19, batch_id: 6, title: 'LLMOps', author: 'Abi Aryan', publisher: 'O\'Reilly', year: 2025, covers: 'LLM ops — evaluation, observability, tracing, cost/latency optimization, guardrails, compliance.' },
  { id: 20, batch_id: 6, title: 'Evals for AI Engineers', author: 'Shreya Shankar & Hamel Husain', publisher: 'O\'Reilly', year: 2026, covers: 'Systematic evaluation — error analysis, synthetic data, LLM-as-judge, automated evals, monitoring.' },
  { id: 21, batch_id: 6, title: 'LLMs in Production', author: 'Christopher Brousseau & Matt Sharp', publisher: 'Manning', year: 2025, covers: 'LLMOps plan — dataset prep, LoRA/PEFT/RLHF, serving, deployment, load testing, security.' },
  { id: 22, batch_id: 6, title: 'Deep Reinforcement Learning with Python', author: 'Nimish Sanghi', publisher: 'Apress', year: 2024, covers: 'Deep RL — Q-learning, DQN, PPO, RLHF for chatbots, multi-agent RL.' },
  // Batch 7
  { id: 23, batch_id: 7, title: 'Vision Language Models', author: 'Merve Noyan, Andrés Marafioti, Miquel Farré & Orr Zohar', publisher: 'O\'Reilly', year: 2026, covers: 'Building VLMs — CLIP, LLaVA, Qwen-VL style architectures, training, fine-tuning, deployment.' },
  { id: 24, batch_id: 7, title: 'Learn OpenAI Whisper', author: 'Josué R. Batista', publisher: 'Packt', year: 2024, covers: 'Whisper architecture, ASR, fine-tuning, real-time transcription, TTS integration.' },
  { id: 25, batch_id: 7, title: 'AI Systems Performance Engineering', author: 'Chris Fregly', publisher: 'O\'Reilly', year: 2025, covers: 'GPU/CUDA optimization, PyTorch profiling, mixed precision, inference optimization, multi-GPU training.' },
  { id: 26, batch_id: 7, title: 'Deep Learning at Scale', author: 'Suneeta Mall', publisher: 'O\'Reilly', year: 2024, covers: 'Full-stack DL — compute infra, distributed training (data/model/pipeline parallelism), PyTorch + NVIDIA + Triton.' },
  { id: 27, batch_id: 7, title: 'Distributed Machine Learning Patterns', author: 'Yuan Tang', publisher: 'Manning', year: 2024, covers: 'Patterns for scaling ML — data ingestion, distributed training, model serving, Kubernetes/Kubeflow.' },
  { id: 28, batch_id: 7, title: 'Practical AI Security', author: 'Harriet Farlow', publisher: 'O\'Reilly', year: 2026, covers: 'AI security — data poisoning, model theft, prompt injection, adversarial examples, red teaming.' },
  { id: 29, batch_id: 7, title: 'AI-Native LLM Security', author: 'Vaibhav Malik, Ken Huang & Adam Dawson', publisher: 'Packt', year: 2026, covers: 'OWASP Top 10 for LLMs, adversarial attacks, secure-by-design, MLSecOps.' },
  // Batch 8
  { id: 30, batch_id: 8, title: 'FastAPI', author: 'Bill Lubanovic', publisher: 'O\'Reilly', year: 2023, covers: 'Python backend — routing, validation, databases, testing, deployment, async.' },
  { id: 31, batch_id: 8, title: 'Building Generative AI Services with FastAPI', author: 'Alireza Parandeh', publisher: 'O\'Reilly', year: 2025, covers: 'Serving GenAI models — text/image/audio/video, RAG with vector DBs, caching, Docker.' },
  { id: 32, batch_id: 8, title: 'Learning SQL', author: 'Alan Beaulay', publisher: 'O\'Reilly', year: 2020, covers: 'SQL hands-on — CRUD, joins, subqueries, CTEs, window functions, transactions, indexes.' },
  { id: 33, batch_id: 8, title: 'SQL Antipatterns, Volume 1', author: 'Bill Karwin', publisher: 'O\'Reilly', year: 2022, covers: 'Common database mistakes and fixes — nullable traps, EAV, indexing blunders.' },
  { id: 34, batch_id: 8, title: 'Database Internals', author: 'Alex Petrov', publisher: 'O\'Reilly', year: 2019, covers: 'Storage engines, B-trees, LSM trees, indexing, replication internals.' },
  { id: 35, batch_id: 8, title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', publisher: 'O\'Reilly', year: 2017, covers: 'Distributed systems — replication, partitioning, consistency, consensus, message queues.' },
  { id: 36, batch_id: 8, title: 'Designing Distributed Systems', author: 'Brendan Burns', publisher: 'O\'Reilly', year: 2024, covers: 'Distributed patterns — sidecar, ambassador, leader election, sharded services.' },
  { id: 37, batch_id: 8, title: 'Kafka: The Definitive Guide', author: 'Gwen Shapira, Todd Palino, Rajini Sivaram & Kritt Petty', publisher: 'O\'Reilly', year: 2021, covers: 'Kafka — producers, consumers, streams, exactly-once, replication, cluster design.' },
  // Batch 9
  { id: 38, batch_id: 9, title: 'Designing Machine Learning Systems', author: 'Chip Huyen', publisher: 'O\'Reilly', year: 2022, covers: 'Production ML lifecycle — data engineering, feature stores, training/serving, monitoring, drift.' },
  { id: 39, batch_id: 9, title: 'Practical MLOps', author: 'Noah Gift & Alfredo Deza', publisher: 'O\'Reilly', year: 2021, covers: 'MLOps principles — CI/CD for ML, monitoring, logging, load-testing, AWS/Azure/GCP.' },
  { id: 40, batch_id: 9, title: 'Fundamentals of Data Engineering', author: 'Joe Reis & Matt Housley', publisher: 'O\'Reilly', year: 2022, covers: 'Data engineering lifecycle — ingestion, orchestration, transformation, storage, governance.' },
  { id: 41, batch_id: 9, title: 'Docker: Up & Running', author: 'Sean Kane & Karl Matthias', publisher: 'O\'Reilly', year: 2023, covers: 'Containers end-to-end — images, registries, networking, security, orchestration.' },
  { id: 42, batch_id: 9, title: 'Cloud Native DevOps with Kubernetes', author: 'John Arundel & Justin Domingus', publisher: 'O\'Reilly', year: 2022, covers: 'Kubernetes in practice — deployments, services, CI/CD on cloud, monitoring, reliability.' },
  { id: 43, batch_id: 9, title: 'Fundamentals of DevOps and Software Delivery', author: 'Yevgeniy Brikman', publisher: 'O\'Reilly', year: 2025, covers: 'Software delivery lifecycle — CI/CD, testing strategy, deployment, observability.' },
  { id: 44, batch_id: 9, title: 'Linux Pocket Guide', author: 'Daniel J. Barrett', publisher: 'O\'Reilly', year: 2024, covers: '200+ Linux commands — shell, filesystem, processes, permissions, networking.' },
  { id: 45, batch_id: 9, title: 'AWS Cookbook', author: 'John Culkin & Mike Zazon', publisher: 'O\'Reilly', year: 2021, covers: 'AWS — compute, storage, IAM, networking, secrets, serverless, containers.' },
  { id: 46, batch_id: 9, title: 'Learning GitHub Actions', author: 'Brent Laster', publisher: 'O\'Reilly', year: 2023, covers: 'CI/CD with GitHub Actions — workflows, runners, matrix builds, secrets, deployment.' },
  // Batch 10
  { id: 47, batch_id: 10, title: 'Fundamentals of Software Architecture', author: 'Mark Richards & Neal Ford', publisher: 'O\'Reilly', year: 2020, covers: 'Architecture fundamentals — styles, components, modularity, governance.' },
  { id: 48, batch_id: 10, title: 'Software Architecture: The Hard Parts', author: 'Neal Ford, Mark Richards, Pramod Sadalage & Zhamak Dehghani', publisher: 'O\'Reilly', year: 2021, covers: 'Trade-off analysis — monolith vs microservices, data partitioning, distributed trade-offs.' },
  { id: 49, batch_id: 10, title: 'Head First Software Architecture', author: 'Raju Gandhi, Mark Richards & Neal Ford', publisher: 'O\'Reilly', year: 2023, covers: 'Architecture concepts in an accessible, visual style.' },
  { id: 50, batch_id: 10, title: 'System Design on AWS', author: 'Jayanth Kumar & Mandeep Singh', publisher: 'O\'Reilly', year: 2024, covers: 'Cloud-native system design — scalability, HA, storage, compute choices on AWS.' },
  { id: 51, batch_id: 10, title: 'Head First Design Patterns', author: 'Eric Freeman & Elisabeth Robson', publisher: 'O\'Reilly', year: 2020, covers: 'All classic design patterns — creational, structural, behavioral.' },
  { id: 52, batch_id: 10, title: 'Building Microservices', author: 'Sam Newman', publisher: 'O\'Reilly', year: 2021, covers: 'Microservice architecture — decomposition, communication, data, deployment, observability.' },
  { id: 53, batch_id: 10, title: 'Learning Algorithms', author: 'George Heineman', publisher: 'O\'Reilly', year: 2021, covers: 'Algorithms and data structures — graphs, trees, sorting, hashing, dynamic programming.' },
  { id: 54, batch_id: 10, title: 'Machine Learning Interviews', author: 'Susan Shu Chang', publisher: 'O\'Reilly', year: 2023, covers: 'Interview process — case studies, ML fundamentals drills, behaviorals, negotiation.' },
  { id: 55, batch_id: 10, title: 'Machine Learning with Python Cookbook', author: 'Kyle Gallatin & Chris Albon', publisher: 'O\'Reilly', year: 2023, covers: '200+ recipes — preprocessing, feature engineering, model selection, evaluation.' },
  { id: 56, batch_id: 10, title: 'Machine Learning Design Patterns', author: 'Valliappa Lakshmanan, Sara Robinson & Michael Munn', publisher: 'O\'Reilly', year: 2020, covers: '30+ proven patterns — data representation, training, optimization, serving.' }
];