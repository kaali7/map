import type { MindElixirData, NodeObj } from '../types/index'

export interface PresetRequirement {
  id: string
  title: string
  prompt: string
}

export const PRESET_REQUIREMENTS: PresetRequirement[] = [
  {
    id: 'software-architecture',
    title: 'Software Architecture Blueprint',
    prompt: 'Design a microservice software architecture for a high-scalability E-commerce platform.',
  },
  {
    id: 'app-launch-strategy',
    title: 'Mobile App Launch Strategy',
    prompt: 'Create a comprehensive launch roadmap for a new mobile social networking application.',
  },
  {
    id: 'ai-learning-roadmap',
    title: 'AI & Machine Learning Study Plan',
    prompt: 'Construct a structured learning roadmap for mastering Machine Learning and AI engineering.',
  },
  {
    id: 'event-planning-checklist',
    title: 'Tech Conference Event Plan',
    prompt: 'Plan an annual developer conference covering venue, speakers, sponsorship, and logistics.',
  },
]

function generateNodeId(): string {
  return Math.random().toString(36).substring(2, 10)
}

export function parseRequirementToMindElixir(requirementText: string, customTitle?: string): MindElixirData {
  const text = requirementText.trim()
  
  // Extract main topic title
  let mainTitle = customTitle
  if (!mainTitle) {
    const firstLine = text.split('\n')[0].replace(/^[#\-*1-9.\s]+/, '').trim()
    if (firstLine && firstLine.length < 40) {
      mainTitle = firstLine
    } else {
      mainTitle = 'Requirement Mind Map'
    }
  }

  // Preset rules for known topics if matching keywords are detected
  const lower = text.toLowerCase()

  let mainTopics: { topic: string; children?: { topic: string }[] }[] = []

  if (lower.includes('architecture') || lower.includes('microservice') || lower.includes('e-commerce') || lower.includes('backend')) {
    mainTopics = [
      {
        topic: 'API Gateway & Security',
        children: [
          { topic: 'Rate Limiting & Throttling' },
          { topic: 'OAuth2 & JWT Authentication' },
          { topic: 'SSL/TLS Termination' },
        ],
      },
      {
        topic: 'Microservices Core',
        children: [
          { topic: 'User Service & Profiles' },
          { topic: 'Product Catalog & Search' },
          { topic: 'Order Processing & Cart' },
          { topic: 'Payment Gateway Integration' },
        ],
      },
      {
        topic: 'Data Persistence',
        children: [
          { topic: 'PostgreSQL Main Cluster' },
          { topic: 'Redis Cache Layer' },
          { topic: 'Elasticsearch Indexing' },
        ],
      },
      {
        topic: 'DevOps & Monitoring',
        children: [
          { topic: 'Docker & Kubernetes Setup' },
          { topic: 'Prometheus & Grafana Alerting' },
          { topic: 'CI/CD Automated Pipeline' },
        ],
      },
    ]
  } else if (lower.includes('launch') || lower.includes('mobile') || lower.includes('app') || lower.includes('social')) {
    mainTopics = [
      {
        topic: 'Phase 1: Pre-Launch Prep',
        children: [
          { topic: 'Beta Testing & Feedback Loop' },
          { topic: 'App Store Optimization (ASO)' },
          { topic: 'Landing Page & Email Waitlist' },
        ],
      },
      {
        topic: 'Phase 2: Marketing Campaign',
        children: [
          { topic: 'Tech Press Release & Outreach' },
          { topic: 'Social Media Teasers & Demo Videos' },
          { topic: 'Influencer & Creator Partnerships' },
        ],
      },
      {
        topic: 'Phase 3: Product Engineering',
        children: [
          { topic: 'Crash Reporting (Sentry)' },
          { topic: 'Analytics & Event Tracking' },
          { topic: 'Scalable Database Auto-scaling' },
        ],
      },
      {
        topic: 'Phase 4: Post-Launch & Growth',
        children: [
          { topic: 'User Onboarding Optimization' },
          { topic: 'Weekly Feature Iterations' },
          { topic: 'Customer Support Helpdesk' },
        ],
      },
    ]
  } else if (lower.includes('learning') || lower.includes('machine learning') || lower.includes('ai') || lower.includes('study')) {
    mainTopics = [
      {
        topic: 'Foundations & Math',
        children: [
          { topic: 'Linear Algebra & Matrix Operations' },
          { topic: 'Multivariable Calculus' },
          { topic: 'Probability & Statistics' },
        ],
      },
      {
        topic: 'Python & Data Stack',
        children: [
          { topic: 'NumPy & Pandas Data Manipulation' },
          { topic: 'Matplotlib & Seaborn Visualization' },
          { topic: 'Scikit-Learn Algorithms' },
        ],
      },
      {
        topic: 'Deep Learning Core',
        children: [
          { topic: 'PyTorch & Neural Networks' },
          { topic: 'CNNs for Computer Vision' },
          { topic: 'Transformers & LLM Architectures' },
        ],
      },
      {
        topic: 'Applied AI Projects',
        children: [
          { topic: 'RAG Pipeline with Vector DB' },
          { topic: 'Fine-Tuning Open Source LLMs' },
          { topic: 'Model Deployment & API Services' },
        ],
      },
    ]
  } else {
    // Generic smart parser: split paragraphs and bullet points
    const lines = text
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0)

    const currentBranchMap: { [key: string]: string[] } = {}
    let currentCategory = 'Key Requirements'

    for (const line of lines) {
      if (line.startsWith('#') || line.endsWith(':')) {
        currentCategory = line.replace(/^[#:\s]+/, '').replace(/[:\s]+$/, '')
        if (!currentBranchMap[currentCategory]) currentBranchMap[currentCategory] = []
      } else {
        const cleaned = line.replace(/^[\-*•1-9.\s]+/, '').trim()
        if (cleaned) {
          if (!currentBranchMap[currentCategory]) currentBranchMap[currentCategory] = []
          currentBranchMap[currentCategory].push(cleaned)
        }
      }
    }

    const categories = Object.keys(currentBranchMap)
    if (categories.length > 0) {
      mainTopics = categories.map(cat => ({
        topic: cat,
        children: currentBranchMap[cat].map(item => ({ topic: item })),
      }))
    } else {
      mainTopics = [
        {
          topic: 'Objectives',
          children: [{ topic: 'Primary Goal' }, { topic: 'Key Success Metrics' }],
        },
        {
          topic: 'Action Plan',
          children: [{ topic: 'Milestone 1' }, { topic: 'Milestone 2' }],
        },
        {
          topic: 'Resource Allocation',
          children: [{ topic: 'Budget & Personnel' }, { topic: 'Tooling & Infra' }],
        },
      ]
    }
  }

  // Convert mainTopics structure to MindElixir NodeObj hierarchy
  const childrenNodes: NodeObj[] = mainTopics.map(m => {
    const subChildren: NodeObj[] = (m.children || []).map(sub => ({
      topic: sub.topic,
      id: generateNodeId(),
    }))
    return {
      topic: m.topic,
      id: generateNodeId(),
      children: subChildren,
    }
  })

  const rootNode: NodeObj = {
    topic: mainTitle,
    id: generateNodeId(),
    children: childrenNodes,
  }

  const DEFAULT_DARK_THEME = {
    name: 'Campaign',
    palette: ['#2563eb', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'],
    cssVar: {
      '--main-color': '#f8f9fa',
      '--main-bgcolor': 'transparent',
      '--color': '#ced4da',
      '--bgcolor': '#121212',
      '--panel-color': '255, 255, 255',
      '--panel-bgcolor': '33, 37, 41',
      '--selected': '#343a40',
      '--root-color': '#f8f9fa',
      '--root-bgcolor': '#121212',
      '--root-border-color': 'rgba(0, 0, 0, 0)',
      '--main-border': 'none',
      '--main-radius': '22px',
    },
  }

  return {
    nodeData: rootNode,
    direction: 1,
    theme: DEFAULT_DARK_THEME,
  }
}
