import type { MindElixirData } from '../index'

const node = (branchColor?: string, size = '14') => ({
  branchColor, fontSize: size, fontWeight: '600',
})

const leaf = () => ({ fontSize: '12' })

const campaignBrainstorming: MindElixirData = {
  direction: 2, // SIDE — balanced layout
  theme: {
    name: 'Campaign',
    palette: [
      '#2563eb', // blue  — Problem Statement
      '#8b5cf6', // violet — Gabriel
      '#ec4899', // pink  — Matteo
      '#f59e0b', // amber — Emilia
      '#10b981', // emerald — extra
      '#06b6d4', // cyan — extra
    ],
    cssVar: {
      '--main-color':   '#111827',
      '--main-bgcolor': 'transparent',
      '--color':        '#374151',
      '--bgcolor':      '#f8fafc',
      '--panel-color':  '17, 24, 39',
      '--panel-bgcolor':'255, 255, 255',
      '--selected':     '#eff6ff',
      '--root-color':   '#111827',
      '--root-bgcolor': '#f8fafc',
      '--root-border-color': 'rgba(0, 0, 0, 0)',
      '--main-border':  'none',
      '--main-radius':  '22px',
    },
  },
  nodeData: {
    id: 'me-root',
    topic: 'Campaign\nBrainstorming',
    style: { fontSize: '26', fontWeight: '700' },
    children: [

      // ── LEFT ──
      {
        topic: 'Problem Statement',
        id: 'ps',
        direction: 0,
        expanded: true,
        style: node('#2563eb'),
        children: [
          {
            topic: 'How might we differentiate our product from competitors in a crowded market?',
            id: 'ps1',
            style: leaf(),
          },
        ],
      },
      {
        topic: 'Gabriel',
        id: 'gabriel',
        direction: 0,
        expanded: true,
        style: node('#7c3aed'),
        children: [
          { topic: 'Collaborate with a well-known influencer', id: 'g1', style: leaf() },
          { topic: 'Use personalized and interactive packaging', id: 'g2', style: leaf() },
          { topic: 'Implement a "buy one, give one" program', id: 'g3', style: leaf() },
        ],
      },

      // ── RIGHT ──
      {
        topic: 'Matteo',
        id: 'matteo',
        direction: 1,
        expanded: true,
        style: node('#ec4899'),
        children: [
          { topic: 'Integrate AI technology', id: 'm1', style: leaf() },
          { topic: 'Create a product with a social mission', id: 'm2', style: leaf() },
          { topic: 'Gamify the product experience', id: 'm3', style: leaf() },
        ],
      },
      {
        topic: 'Emilia',
        id: 'emilia',
        direction: 1,
        expanded: true,
        style: node('#f59e0b'),
        children: [
          { topic: 'Create a viral challenge', id: 'e1', style: leaf() },
          { topic: 'Host a pop-up event', id: 'e2', style: leaf() },
          { topic: 'Create a limited edition product', id: 'e3', style: leaf() },
        ],
      },
    ],
  },
}

export default campaignBrainstorming
