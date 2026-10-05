import { Skill } from '@/types';

export const skillsData: Skill[] = [
  // AI & GenAI
  {
    name: 'RAG Systems & Vector Search',
    category: 'AI & GenAI',
    level: 95,
    iconName: 'BrainCircuit',
    description: 'Multimodal RAG, Qdrant Vector DB, Neo4j Knowledge Graphs, ColQwen, Document Chunking & Hybrid Retrieval.',
    highlight: true,
  },
  {
    name: 'LLMs & Agentic AI',
    category: 'AI & GenAI',
    level: 92,
    iconName: 'Sparkles',
    description: 'Ollama, Azure OpenAI, LangGraph, CrewAI, Agentforce, & Task-Oriented Agent Orchestration.',
    highlight: true,
  },
  // API & Backend
  {
    name: 'REST APIs & Cloud Services',
    category: 'APIs & Backend',
    level: 90,
    iconName: 'Network',
    description: 'REST API Integration, HTTP/HTTPS, Fast APIs, Docker Containerization, Azure DevOps & Microservices.',
    highlight: true,
  },
  // Machine Learning
  {
    name: 'Machine Learning & Predictive Models',
    category: 'Machine Learning',
    level: 88,
    iconName: 'Cpu',
    description: 'Classification, Regression, Anomaly Detection, Feature Engineering, Scikit-Learn, PyTorch, TensorFlow.',
    highlight: true,
  },
  // Data Analytics
  {
    name: 'Data Analysis & EDA',
    category: 'Data Analytics',
    level: 94,
    iconName: 'BarChart3',
    description: 'Exploratory Data Analysis, Pandas, NumPy, Data Preprocessing, Matplotlib, Seaborn, Missing Value Imputation.',
    highlight: true,
  },
  {
    name: 'Power BI & SQL Analytics',
    category: 'Data Analytics',
    level: 92,
    iconName: 'PieChart',
    description: 'Interactive Dashboard Design, MySQL Queries, Query Optimization (40%), Layoff & Sales Trend Analysis.',
    highlight: true,
  },
  // Languages & Core
  {
    name: 'Python & C++',
    category: 'Languages & Tools',
    level: 95,
    iconName: 'Code2',
    description: 'Primary language for AI/LLM pipelines, Object-Oriented Programming (OOP), Data Structures & Algorithms.',
    highlight: true,
  },
  {
    name: 'Databases & Graph DBs',
    category: 'Languages & Tools',
    level: 90,
    iconName: 'Database',
    description: 'Qdrant Vector Engine, Neo4j Graph DB, MySQL, Data Integration & Schema Optimization.',
    highlight: true,
  }
];
