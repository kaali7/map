import { DatabaseSync } from 'node:sqlite'
import path from 'path'

export interface MindMapRecord {
  id: string
  title: string
  theme: string
  data: string
  node_count: number
  created_at: string
  updated_at: string
}

const dbPath = path.resolve(process.cwd(), 'mindmap.db')
const db = new DatabaseSync(dbPath)

// Migrate or Initialize table schema
try {
  const tableInfo = db.prepare(`PRAGMA table_info(mindmaps)`).all() as any[]
  const hasTheme = tableInfo.some(col => col.name === 'theme')
  const hasDescription = tableInfo.some(col => col.name === 'description')

  if (!hasTheme || hasDescription) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS mindmaps_new (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        theme TEXT,
        data TEXT NOT NULL,
        node_count INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `)

    if (tableInfo.length > 0) {
      const oldRows = db.prepare(`SELECT * FROM mindmaps`).all() as any[]
      for (const row of oldRows) {
        let themeStr = row.theme || ''
        if (!themeStr && row.data) {
          try {
            const parsed = JSON.parse(row.data)
            if (parsed.theme) themeStr = typeof parsed.theme === 'string' ? parsed.theme : JSON.stringify(parsed.theme)
          } catch (e) {}
        }
        db.prepare(`
          INSERT OR REPLACE INTO mindmaps_new (id, title, theme, data, node_count, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(row.id, row.title, themeStr, row.data, row.node_count || 1, row.created_at || new Date().toISOString(), row.updated_at || new Date().toISOString())
      }
      db.exec(`DROP TABLE mindmaps;`)
    }

    db.exec(`ALTER TABLE mindmaps_new RENAME TO mindmaps;`)
  }
} catch (e) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS mindmaps (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      theme TEXT,
      data TEXT NOT NULL,
      node_count INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)
}

function countNodes(node: any): number {
  if (!node) return 0
  let count = 1
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      count += countNodes(child)
    }
  }
  return count
}

export function getAllMindMaps(): MindMapRecord[] {
  const stmt = db.prepare('SELECT id, title, theme, node_count, created_at, updated_at FROM mindmaps ORDER BY updated_at DESC')
  return stmt.all() as unknown as MindMapRecord[]
}

export function getMindMapById(id: string): MindMapRecord | null {
  const stmt = db.prepare('SELECT * FROM mindmaps WHERE id = ?')
  const res = stmt.get(id) as unknown as MindMapRecord | undefined
  return res || null
}

export function createMindMap(map: {
  id?: string
  title: string
  theme?: any
  data: any
}): MindMapRecord {
  const id = map.id || `map-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
  const now = new Date().toISOString()
  const dataObj = typeof map.data === 'string' ? JSON.parse(map.data) : map.data
  const dataStr = typeof map.data === 'string' ? map.data : JSON.stringify(map.data)

  const themeVal = map.theme !== undefined ? map.theme : dataObj.theme
  const themeStr = typeof themeVal === 'string' ? themeVal : JSON.stringify(themeVal || null)

  const nNodes = countNodes(dataObj.nodeData || dataObj)

  const stmt = db.prepare(`
    INSERT INTO mindmaps (id, title, theme, data, node_count, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  stmt.run(id, map.title, themeStr, dataStr, nNodes, now, now)

  return {
    id,
    title: map.title,
    theme: themeStr,
    data: dataStr,
    node_count: nNodes,
    created_at: now,
    updated_at: now,
  }
}

export function updateMindMap(
  id: string,
  updates: {
    title?: string
    theme?: any
    data?: any
  }
): MindMapRecord | null {
  const existing = getMindMapById(id)
  if (!existing) return null

  const now = new Date().toISOString()
  const title = updates.title !== undefined ? updates.title : existing.title

  let dataStr = existing.data
  let nNodes = existing.node_count
  let themeStr = existing.theme

  if (updates.data !== undefined) {
    dataStr = typeof updates.data === 'string' ? updates.data : JSON.stringify(updates.data)
    const parsedData = typeof updates.data === 'string' ? JSON.parse(updates.data) : updates.data
    nNodes = countNodes(parsedData.nodeData || parsedData)
    if (updates.theme === undefined && parsedData.theme) {
      themeStr = typeof parsedData.theme === 'string' ? parsedData.theme : JSON.stringify(parsedData.theme)
    }
  }

  if (updates.theme !== undefined) {
    themeStr = typeof updates.theme === 'string' ? updates.theme : JSON.stringify(updates.theme)
  }

  const stmt = db.prepare(`
    UPDATE mindmaps
    SET title = ?, theme = ?, data = ?, node_count = ?, updated_at = ?
    WHERE id = ?
  `)

  stmt.run(title, themeStr, dataStr, nNodes, now, id)

  return {
    id,
    title,
    theme: themeStr,
    data: dataStr,
    node_count: nNodes,
    created_at: existing.created_at,
    updated_at: now,
  }
}

export function deleteMindMap(id: string): boolean {
  const stmt = db.prepare('DELETE FROM mindmaps WHERE id = ?')
  const res = stmt.run(id)
  return res.changes > 0
}

export function clearAllMindMaps(): void {
  db.exec('DELETE FROM mindmaps')
}
