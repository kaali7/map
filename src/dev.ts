import type { MindElixirCtor } from './index'
import MindElixir from './index'
import example from './exampleData/1'
import example2 from './exampleData/2'
import example3 from './exampleData/3'
import productLaunch from './exampleData/productLaunch'
import type { Options, MindElixirInstance, NodeObj } from './types/index'
import type { Operation } from './utils/pubsub'
import 'katex/dist/katex.min.css'
import katex from 'katex'
import { layoutSSR, renderSSRHTML } from './utils/layout-ssr'
import { snapdom } from '@zumer/snapdom'
import type { Tokens } from 'marked'
import { marked } from 'marked'
import { md2html } from 'simple-markdown-to-html'
import type { Arrow } from './arrow'
import type { Summary } from './summary'
import { mindElixirToPlaintext, plaintextExample, plaintextToMindElixir } from './utils/plaintextConverter'
import { en } from './i18n'
import { markmapMain, markmapSub, straightMain, straightSub, straightUnderlineMain, straightUnderlineSub } from './branchTests'
import '../dev.css'

interface Window {
  m?: MindElixirInstance
  m2?: MindElixirInstance
  M: MindElixirCtor
  E: typeof MindElixir.E
  downloadPng: () => void
  downloadSvg: () => void
  destroy: () => void
  testMarkdown: () => void
  addMarkdownNode: () => void
  triggerAutoSave?: () => void
  saveCurrentMapToDb?: () => void
}

declare let window: Window

const E = MindElixir.E

export const DEFAULT_DARK_THEME = {
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

const options: Options = {
  el: '#map',
  direction: 1,
  theme: DEFAULT_DARK_THEME,
  newTopicName: 'New Node',
  scaleMax: 5.0,
  scaleMin: 0.1,
  // mouseSelectionButton: 2,
  editable: true,
  markdown: (text: string, obj: (NodeObj & { useMd?: boolean }) | (Arrow & { useMd?: boolean }) | (Summary & { useMd?: boolean })) => {
    if (!text) return ''
    // if (!obj.useMd) return text
    try {
      // Configure marked renderer to add target="_blank" to links
      const renderer = {
        strong(token: Tokens.Strong) {
          if (token.raw.startsWith('**')) {
            return `<strong class="asterisk-emphasis">${token.text}</strong>`
          } else if (token.raw.startsWith('__')) {
            return `<strong class="underscore-emphasis">${token.text}</strong>`
          }
          return `<strong>${token.text}</strong>`
        },
        link(token: Tokens.Link) {
          const href = token.href || ''
          const title = token.title ? ` title="${token.title}"` : ''
          const text = token.text || ''
          return `<a href="${href}"${title} target="_blank">${text}</a>`
        },
      }

      marked.use({ renderer, gfm: true })
      let html = marked.parse(text) as string
      // let html = md2html(text)

      // Process KaTeX math expressions
      // Handle display math ($$...$$)
      html = html.replace(/\$\$([^$]+)\$\$/g, (_, math) => {
        return katex.renderToString(math.trim(), { displayMode: true })
      })

      // Handle inline math ($...$)
      html = html.replace(/\$([^$]+)\$/g, (_, math) => {
        return katex.renderToString(math.trim(), { displayMode: false })
      })

      return html.trim().replace(/\n/g, '')
    } catch (error) {
      return text
    }
  },
  // To disable markdown, simply omit the markdown option or set it to undefined
  // if you set contextMenu to false, you should handle contextmenu event by yourself, e.g. preventDefault
  contextMenu: {
    locale: en,
    focus: true,
    link: true,
    extend: [
      {
        name: 'Node edit',
        onclick: () => {
          alert('extend menu')
        },
      },
    ],
  },
  toolBar: false,
  keypress: {
    e(e) {
      if (!mind.currentNode) return
      if (e.metaKey || e.ctrlKey) {
        mind.expandNode(mind.currentNode)
      }
    },
    f(e) {
      if (!mind.currentNode) return
      if (e.altKey) {
        if (mind.isFocusMode) {
          mind.cancelFocus()
        } else {
          mind.focusNode(mind.currentNode)
        }
      }
    },
  },
  allowUndo: true,
  before: {
    insertSibling(el, obj) {
      console.log('insertSibling', el, obj)
      return true
    },
    async addChild(el, obj) {
      console.log('addChild', el, obj)
      // await sleep()
      return true
    },
  },
  // scaleMin:0.1
  // alignment: 'nodes',

  // ================= 测试不同的分支样式 =================
  // 现在可以通过 mind.changeBranch 动态切换了！
}

let mind = new MindElixir(options)

let currentMapId: string | null = typeof location !== 'undefined' ? new URLSearchParams(location.search).get('id') : null
let saveDebounceTimer: any = null

function updateDbStatusBadge(status: 'saved' | 'saving' | 'error') {
  const badge = document.getElementById('db-status-badge')
  if (!badge) return
  if (status === 'saved') {
    badge.style.background = 'rgba(139, 92, 246, 0.18)'
    badge.style.borderColor = 'rgba(139, 92, 246, 0.4)'
    badge.style.boxShadow = '0 0 12px rgba(139, 92, 246, 0.4)'
    badge.title = 'Saved to mindmap.db'
    badge.innerHTML = '<span style="color: #a78bfa; filter: drop-shadow(0 0 6px #a78bfa); font-size: 10px;">●</span>'
  } else if (status === 'saving') {
    badge.style.background = 'rgba(245, 158, 11, 0.18)'
    badge.style.borderColor = 'rgba(245, 158, 11, 0.4)'
    badge.style.boxShadow = '0 0 12px rgba(245, 158, 11, 0.4)'
    badge.title = 'Saving to mindmap.db...'
    badge.innerHTML = '<span style="color: #fbbf24; filter: drop-shadow(0 0 6px #fbbf24); font-size: 10px;">●</span>'
  } else {
    badge.style.background = 'rgba(239, 68, 68, 0.18)'
    badge.style.borderColor = 'rgba(239, 68, 68, 0.4)'
    badge.style.boxShadow = '0 0 12px rgba(239, 68, 68, 0.4)'
    badge.title = 'DB Sync Error'
    badge.innerHTML = '<span style="color: #ef4444; filter: drop-shadow(0 0 6px #ef4444); font-size: 10px;">●</span>'
  }
}

const LS_KEY_DEV = 'mindmaps_db_store'

function getLocalStoreDev(): any[] {
  try {
    const raw = localStorage.getItem(LS_KEY_DEV)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

function saveLocalStoreDev(store: any[]) {
  try {
    localStorage.setItem(LS_KEY_DEV, JSON.stringify(store))
  } catch (e) {}
}

async function saveCurrentMapToDb() {
  if (!currentMapId) return
  updateDbStatusBadge('saving')
  const data = mind.getData()
  const titleDisplay = document.getElementById('map-title-display')
  const currentTitle = titleDisplay ? titleDisplay.title || titleDisplay.textContent || 'Mind Map' : 'Mind Map'

  try {
    const res = await fetch(`/api/mindmaps/${currentMapId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: currentTitle,
        data: data,
      }),
    })

    if (res.ok) {
      updateDbStatusBadge('saved')
      return
    }
  } catch (err) {}

  // LocalStorage Fallback for Vercel static deployment
  try {
    const store = getLocalStoreDev()
    const targetIdx = store.findIndex((m: any) => m.id === currentMapId)
    const now = new Date().toISOString()
    if (targetIdx !== -1) {
      store[targetIdx].title = currentTitle
      store[targetIdx].data = data
      store[targetIdx].updated_at = now
    } else {
      store.unshift({
        id: currentMapId,
        title: currentTitle,
        theme: typeof data.theme === 'string' ? data.theme : JSON.stringify(data.theme || ''),
        node_count: 1,
        created_at: now,
        updated_at: now,
        data: data,
      })
    }
    saveLocalStoreDev(store)
    updateDbStatusBadge('saved')
  } catch (e) {
    updateDbStatusBadge('error')
  }
}

function triggerAutoSave() {
  if (!currentMapId) return
  updateDbStatusBadge('saving')
  if (saveDebounceTimer) clearTimeout(saveDebounceTimer)
  saveDebounceTimer = setTimeout(() => {
    saveCurrentMapToDb()
  }, 1000)
}

window.triggerAutoSave = triggerAutoSave
window.saveCurrentMapToDb = saveCurrentMapToDb

async function initFromDb() {
  if (!currentMapId) {
    mind.init(productLaunch)
    return
  }

  updateDbStatusBadge('saving')

  let record: any = null
  try {
    const res = await fetch(`/api/mindmaps/${currentMapId}`)
    if (res.ok) {
      record = await res.json()
    }
  } catch (err) {}

  if (!record) {
    const store = getLocalStoreDev()
    record = store.find((m: any) => m.id === currentMapId)
  }

  if (!record) {
    updateDbStatusBadge('error')
    mind.init(productLaunch)
    return
  }

  const data = typeof record.data === 'string' ? JSON.parse(record.data) : record.data

  if (!data.theme) {
    data.theme = DEFAULT_DARK_THEME
  }

  mind.init(data)
  if (data.theme) {
    mind.changeTheme(data.theme, false)
  }

  const titleDisplay = document.getElementById('map-title-display')
  const titleInput = document.getElementById('title-edit-input') as HTMLInputElement | null
  if (titleDisplay && record.title) {
    const formattedTitle = record.title.length > 4 ? record.title.slice(0, 4) + '...' : record.title
    titleDisplay.textContent = formattedTitle
    titleDisplay.title = record.title
    if (titleInput) {
      titleInput.value = record.title
    }
    document.title = `Mind Elixir — ${record.title}`
  }

  updateDbStatusBadge('saved')
}

initFromDb()

// Branch styles available for switching (not applied by default)
const branchThemes = {
  markmap: {
    generateMainBranch: markmapMain,
    generateSubBranch: markmapSub,
  },
  straight: {
    generateMainBranch: straightMain,
    generateSubBranch: straightSub,
  },
}
// Using default curved branch style to match the light theme design

const m2 = new MindElixir({
  el: '#map2',
  selectionContainer: 'body', // use body to make selection usable when transform is not 0
  direction: MindElixir.RIGHT,
  theme: MindElixir.DARK_THEME,
  // alignment: 'nodes',
})
m2.init(example)

function sleep() {
  return new Promise<void>(res => {
    setTimeout(() => res(), 1000)
  })
}
// console.log('test E function', E('bd4313fbac40284b'))

mind.bus.addListener('operation', (operation: Operation) => {
  console.log(operation)
  triggerAutoSave()
  // return {
  //   name: action name,
  //   obj: target object
  // }

  // name: [insertSibling|addChild|removeNode|beginEdit|finishEdit]
  // obj: target

  // name: moveNodeIn
  // obj: {from:target1,to:target2}
})
mind.bus.addListener('selectNodes', nodes => {
  console.log('selectNodes', nodes)
})
mind.bus.addListener('unselectNodes', nodes => {
  console.log('unselectNodes', nodes)
})
mind.bus.addListener('selectSummary', summary => {
  console.log('selectSummary: ', summary)
})

const dl2 = async () => {
  const result = await snapdom(mind.nodes)
  await result.download({ format: 'jpg', filename: 'my-capture.jpg', backgroundColor: mind.theme.cssVar['--bgcolor'] })
}

window.downloadPng = dl2
window.m = mind
window.m2 = m2
window.M = MindElixir
window.E = MindElixir.E

console.log('MindElixir Version', MindElixir.version)

window.destroy = () => {
  mind.destroy()
  // @ts-expect-error remove reference
  mind = null
  // @ts-expect-error remove reference
  window.m = null
}

document.querySelector('#ssr')!.innerHTML = renderSSRHTML(layoutSSR(window.m.nodeData))

// const convertedData = plaintextToMindElixir(plaintextExample)
// console.log('convertedData', convertedData)
// mind.refresh(convertedData)
// mind.toCenter()
// const plaintext = mindElixirToPlaintext(mind.getData())
// console.log('plaintext', plaintext)
