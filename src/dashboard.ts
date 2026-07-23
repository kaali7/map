import './dashboard.css'

interface MindMapRecord {
  id: string
  title: string
  theme: string
  node_count: number
  created_at: string
  updated_at: string
}

let allMindMaps: MindMapRecord[] = []
let searchQuery = ''

// SVG Icons
const SVG_ICONS = {
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>`,
  alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
  dots: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>`,
}

function renderThumbnailSvg(): string {
  return `
    <svg class="thumbnail-svg" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 100 60 C 120 60, 120 30, 140 30" stroke="rgba(139, 92, 246, 0.45)" stroke-width="2" fill="none" />
      <path d="M 100 60 C 120 60, 120 45, 140 45" stroke="rgba(139, 92, 246, 0.45)" stroke-width="2" fill="none" />
      <path d="M 100 60 C 120 60, 120 60, 140 60" stroke="rgba(139, 92, 246, 0.45)" stroke-width="2" fill="none" />
      <path d="M 100 60 C 120 60, 120 75, 140 75" stroke="rgba(139, 92, 246, 0.45)" stroke-width="2" fill="none" />
      <path d="M 100 60 C 120 60, 120 90, 140 90" stroke="rgba(139, 92, 246, 0.45)" stroke-width="2" fill="none" />

      <path d="M 100 60 C 80 60, 80 40, 60 40" stroke="rgba(139, 92, 246, 0.45)" stroke-width="2" fill="none" />
      <path d="M 100 60 C 80 60, 80 60, 60 60" stroke="rgba(139, 92, 246, 0.45)" stroke-width="2" fill="none" />
      <path d="M 100 60 C 80 60, 80 80, 60 80" stroke="rgba(139, 92, 246, 0.45)" stroke-width="2" fill="none" />

      <!-- Center Root node -->
      <rect x="88" y="52" width="24" height="16" rx="6" fill="rgba(139, 92, 246, 0.25)" stroke="#8b5cf6" stroke-width="1.5"/>

      <!-- Left Nodes -->
      <rect x="35" y="32" width="25" height="16" rx="5" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5"/>
      <rect x="35" y="52" width="25" height="16" rx="5" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5"/>
      <rect x="35" y="72" width="25" height="16" rx="5" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5"/>

      <!-- Right Nodes -->
      <rect x="140" y="22" width="35" height="16" rx="5" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5"/>
      <rect x="140" y="37" width="35" height="16" rx="5" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5"/>
      <rect x="140" y="52" width="35" height="16" rx="5" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5"/>
      <rect x="140" y="67" width="35" height="16" rx="5" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5"/>
      <rect x="140" y="82" width="35" height="16" rx="5" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5"/>
    </svg>
  `
}

// Toast Helper
function showToast(message: string, type: 'info' | 'success' | 'danger' = 'success') {
  const container = document.getElementById('toast-container')
  if (!container) return

  const toast = document.createElement('div')
  toast.className = 'toast'
  if (type === 'danger') toast.style.borderLeftColor = '#ef4444'
  if (type === 'info') toast.style.borderLeftColor = '#3b82f6'

  const iconSvg = type === 'success' ? SVG_ICONS.check : type === 'danger' ? SVG_ICONS.alert : SVG_ICONS.info
  toast.innerHTML = `${iconSvg} ${message}`
  container.appendChild(toast)

  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transform = 'translateX(100%)'
    toast.style.transition = 'all 0.3s ease'
    setTimeout(() => toast.remove(), 300)
  }, 3500)
}

// Load Mind Maps from API
async function loadMindMaps() {
  try {
    const res = await fetch('/api/mindmaps')
    if (!res.ok) throw new Error('Failed to load mind maps')
    allMindMaps = await res.json()
    renderDashboard()
  } catch (err: any) {
    console.error(err)
    showToast('Failed to load mind maps from database', 'danger')
  }
}

// Close all open card dropdowns
function closeAllDropdowns() {
  document.querySelectorAll('.card-dropdown').forEach(dropdown => {
    dropdown.classList.add('hidden')
  })
}

// Render Dashboard Cards
function renderDashboard() {
  const countElem = document.getElementById('stat-count')
  const gridElem = document.getElementById('cards-grid')

  if (!gridElem) return

  const filtered = allMindMaps.filter(map =>
    map.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (countElem) countElem.textContent = `(${allMindMaps.length})`

  if (filtered.length === 0) {
    gridElem.innerHTML = `
      <div class="empty-state">
        <button id="btn-empty-create" class="btn btn-primary btn-lg">
          ${SVG_ICONS.plus} New Blank Map
        </button>
      </div>
    `
    document.getElementById('btn-empty-create')?.addEventListener('click', () => {
      openModal('modal-new-map')
    })
    return
  }

  gridElem.innerHTML = filtered
    .map(map => {
      const formattedDate = new Date(map.updated_at || map.created_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })

      return `
        <div class="map-card" data-id="${map.id}">
          <div class="card-thumbnail">
            ${renderThumbnailSvg()}
          </div>

          <div class="card-content">
            <div class="card-title-row">
              <h3 class="card-title">${escapeHtml(map.title)}</h3>
              <div class="menu-wrapper">
                <button class="btn-dots" data-id="${map.id}" title="Options">
                  ${SVG_ICONS.dots}
                </button>
                <div class="card-dropdown hidden" id="dropdown-${map.id}">
                  <button class="dropdown-item btn-edit" data-id="${map.id}">
                    ${SVG_ICONS.edit} Edit Name
                  </button>
                  <button class="dropdown-item btn-duplicate" data-id="${map.id}">
                    ${SVG_ICONS.copy} Duplicate
                  </button>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-item dropdown-danger btn-delete" data-id="${map.id}">
                    ${SVG_ICONS.trash} Delete
                  </button>
                </div>
              </div>
            </div>

            <div class="card-meta">
              <span>${map.node_count || 1} topics</span>
              <span>Updated ${formattedDate}</span>
            </div>
          </div>
        </div>
      `
    })
    .join('')

  // Bind Card Click (Opens mindmap)
  gridElem.querySelectorAll('.map-card').forEach(card => {
    card.addEventListener('click', e => {
      const target = e.target as HTMLElement
      // If click was inside 3-dot button or dropdown menu, do not open map
      if (target.closest('.menu-wrapper') || target.closest('.card-dropdown')) {
        return
      }

      const id = (card as HTMLElement).getAttribute('data-id')
      if (id) {
        window.location.href = `index.html?id=${id}`
      }
    })
  })

  // Bind 3-Dot Options Button Click (Toggle Dropdown)
  gridElem.querySelectorAll('.btn-dots').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation()
      const id = (e.currentTarget as HTMLElement).getAttribute('data-id')
      const dropdown = document.getElementById(`dropdown-${id}`)
      
      const isHidden = dropdown?.classList.contains('hidden')
      closeAllDropdowns()

      if (isHidden && dropdown) {
        dropdown.classList.remove('hidden')
      }
    })
  })

  // Bind Dropdown Action Items
  gridElem.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation()
      closeAllDropdowns()
      const id = (e.currentTarget as HTMLElement).getAttribute('data-id')
      if (id) openEditModal(id)
    })
  })

  gridElem.querySelectorAll('.btn-duplicate').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation()
      closeAllDropdowns()
      const id = (e.currentTarget as HTMLElement).getAttribute('data-id')
      if (id) duplicateMap(id)
    })
  })

  gridElem.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation()
      closeAllDropdowns()
      const id = (e.currentTarget as HTMLElement).getAttribute('data-id')
      if (id) deleteMap(id)
    })
  })
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Modal Helpers
function openModal(modalId: string) {
  const modal = document.getElementById(modalId)
  if (modal) modal.classList.add('open')
}

function closeModal(modalId: string) {
  const modal = document.getElementById(modalId)
  if (modal) modal.classList.remove('open')
}

// Duplicate Mind Map
async function duplicateMap(id: string) {
  try {
    const res = await fetch(`/api/mindmaps/${id}`)
    if (!res.ok) throw new Error('Failed to fetch map')
    const original = await res.json()

    const duplicatedData = typeof original.data === 'string' ? JSON.parse(original.data) : original.data
    const newTitle = `${original.title} (Copy)`

    const createRes = await fetch('/api/mindmaps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle,
        data: duplicatedData,
      }),
    })

    if (!createRes.ok) throw new Error('Failed to duplicate')

    showToast('Mind map duplicated successfully!')
    await loadMindMaps()
  } catch (err: any) {
    showToast(err.message || 'Duplication failed', 'danger')
  }
}

// Delete Mind Map
async function deleteMap(id: string) {
  const targetMap = allMindMaps.find(m => m.id === id)
  if (!confirm(`Are you sure you want to delete "${targetMap?.title || 'this mind map'}"?`)) {
    return
  }

  try {
    const res = await fetch(`/api/mindmaps/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete')
    showToast('Mind map deleted', 'info')
    await loadMindMaps()
  } catch (err: any) {
    showToast(err.message || 'Deletion failed', 'danger')
  }
}

// Open Edit Modal
function openEditModal(id: string) {
  const targetMap = allMindMaps.find(m => m.id === id)
  if (!targetMap) return

  ;(document.getElementById('edit-id') as HTMLInputElement).value = targetMap.id
  ;(document.getElementById('edit-title') as HTMLInputElement).value = targetMap.title

  openModal('modal-edit-map')
}

// Setup Event Listeners
function setupEventListeners() {
  const searchInput = document.getElementById('search-input') as HTMLInputElement
  searchInput?.addEventListener('input', e => {
    searchQuery = (e.target as HTMLInputElement).value
    renderDashboard()
  })

  // Close dropdowns when clicking anywhere outside
  document.addEventListener('click', e => {
    const target = e.target as HTMLElement
    if (!target.closest('.menu-wrapper')) {
      closeAllDropdowns()
    }
  })

  // Modal Triggers
  document.getElementById('btn-open-new-modal')?.addEventListener('click', () => {
    openModal('modal-new-map')
  })

  // Modal Close buttons
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', e => {
      const modalId = (e.currentTarget as HTMLElement).getAttribute('data-close')
      if (modalId) closeModal(modalId)
    })
  })

  // Submit Create Blank Mind Map
  document.getElementById('btn-create-submit')?.addEventListener('click', async () => {
    const title = (document.getElementById('new-title') as HTMLInputElement).value.trim()

    if (!title) {
      showToast('Please enter a name for the mind map', 'danger')
      return
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

    const blankData = {
      theme: DEFAULT_DARK_THEME,
      nodeData: {
        topic: title,
        id: `root-${Date.now().toString(36)}`,
        children: [
          {
            topic: 'Main Topic 1',
            id: `node-1-${Date.now().toString(36)}`,
            children: [
              { topic: 'part 1', id: `sub-1-${Date.now().toString(36)}` },
              { topic: 'part 2', id: `sub-2-${Date.now().toString(36)}` },
            ],
          },
          { topic: 'Main Topic 2', id: `node-2-${Date.now().toString(36)}` },
        ],
      },
      direction: 1,
    }

    try {
      const res = await fetch('/api/mindmaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          data: blankData,
        }),
      })

      if (!res.ok) throw new Error('Failed to create mind map')

      const createdMap = await res.json()
      closeModal('modal-new-map')
      showToast('Mind map created!')

      window.location.href = `index.html?id=${createdMap.id}`
    } catch (err: any) {
      showToast(err.message || 'Creation failed', 'danger')
    }
  })

  // Submit Edit Name
  document.getElementById('btn-edit-submit')?.addEventListener('click', async () => {
    const id = (document.getElementById('edit-id') as HTMLInputElement).value
    const title = (document.getElementById('edit-title') as HTMLInputElement).value.trim()

    if (!id || !title) {
      showToast('Name is required', 'danger')
      return
    }

    try {
      const res = await fetch(`/api/mindmaps/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })

      if (!res.ok) throw new Error('Failed to update name')

      closeModal('modal-edit-map')
      showToast('Name updated!')
      await loadMindMaps()
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'danger')
    }
  })
}

// Initializer
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners()
  loadMindMaps()
})
