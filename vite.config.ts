import { defineConfig, Plugin } from 'vite'
import istanbul from 'vite-plugin-istanbul'
import {
  getAllMindMaps,
  getMindMapById,
  createMindMap,
  updateMindMap,
  deleteMindMap,
} from './server/db'
import { parseRequirementToMindElixir } from './src/utils/requirementParser'

function mindmapApiPlugin(): Plugin {
  return {
    name: 'mindmap-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || ''

        // API Endpoint: /api/mindmaps
        if (url.startsWith('/api/mindmaps')) {
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

          if (req.method === 'OPTIONS') {
            res.statusCode = 204
            res.end()
            return
          }

          const parsedUrl = new URL(url, `http://${req.headers.host || 'localhost'}`)
          const pathSegments = parsedUrl.pathname.split('/').filter(Boolean)
          // pathSegments will be ['api', 'mindmaps'] or ['api', 'mindmaps', ':id'] or ['api', 'mindmaps', 'generate']

          try {
            // POST /api/mindmaps/generate
            if (pathSegments.length === 3 && pathSegments[2] === 'generate' && req.method === 'POST') {
              let body = ''
              req.on('data', chunk => (body += chunk))
              req.on('end', () => {
                const { requirement, title } = JSON.parse(body || '{}')
                const mindmapData = parseRequirementToMindElixir(requirement || '', title)
                const createdRecord = createMindMap({
                  title: title || mindmapData.nodeData.topic || 'Requirement Mind Map',
                  theme: mindmapData.theme,
                  data: mindmapData,
                })
                res.statusCode = 201
                res.end(JSON.stringify(createdRecord))
              })
              return
            }

            // GET /api/mindmaps
            if (pathSegments.length === 2 && req.method === 'GET') {
              const maps = getAllMindMaps()
              res.statusCode = 200
              res.end(JSON.stringify(maps))
              return
            }

            // POST /api/mindmaps
            if (pathSegments.length === 2 && req.method === 'POST') {
              let body = ''
              req.on('data', chunk => (body += chunk))
              req.on('end', () => {
                const payload = JSON.parse(body || '{}')
                const createdRecord = createMindMap(payload)
                res.statusCode = 201
                res.end(JSON.stringify(createdRecord))
              })
              return
            }

            // GET /api/mindmaps/:id
            if (pathSegments.length === 3 && req.method === 'GET') {
              const id = pathSegments[2]
              const record = getMindMapById(id)
              if (!record) {
                res.statusCode = 404
                res.end(JSON.stringify({ error: 'MindMap not found' }))
                return
              }
              res.statusCode = 200
              res.end(JSON.stringify(record))
              return
            }

            // PUT /api/mindmaps/:id
            if (pathSegments.length === 3 && req.method === 'PUT') {
              const id = pathSegments[2]
              let body = ''
              req.on('data', chunk => (body += chunk))
              req.on('end', () => {
                const payload = JSON.parse(body || '{}')
                const updated = updateMindMap(id, payload)
                if (!updated) {
                  res.statusCode = 404
                  res.end(JSON.stringify({ error: 'MindMap not found' }))
                  return
                }
                res.statusCode = 200
                res.end(JSON.stringify(updated))
              })
              return
            }

            // DELETE /api/mindmaps/:id
            if (pathSegments.length === 3 && req.method === 'DELETE') {
              const id = pathSegments[2]
              const success = deleteMindMap(id)
              if (!success) {
                res.statusCode = 404
                res.end(JSON.stringify({ error: 'MindMap not found' }))
                return
              }
              res.statusCode = 200
              res.end(JSON.stringify({ success: true, message: 'MindMap deleted' }))
              return
            }
          } catch (err: any) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: err.message }))
            return
          }
        }

        next()
      })
    },
  }
}

export default defineConfig({
  server: {
    host: true,
    port: 23333,
    strictPort: true,
  },
  plugins: [
    mindmapApiPlugin(),
    istanbul({
      include: 'src/*',
      exclude: ['node_modules', 'test/', 'src/plugin/exportImage.ts'],
      extension: ['.ts'],
      requireEnv: true,
    }),
  ],
})
