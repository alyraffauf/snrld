import { defineConfig, loadEnv, type Plugin } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import {
  createDevelopmentOAuthMetadata,
  createOAuthMetadata,
  OAUTH_METADATA_PATH,
} from './src/lib/auth/config.ts'

const SERVER_HOST = '127.0.0.1'

export default defineConfig(({ mode }) => ({
  plugins: [
    oauthMetadata(loadEnv(mode, process.cwd(), 'VITE_PUBLIC_URL').VITE_PUBLIC_URL),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  server: {
    host: SERVER_HOST,
    port: 5173,
    strictPort: true,
    allowedHosts: ['petalburg'],
  },
  preview: {
    host: SERVER_HOST,
    port: 4173,
    strictPort: true,
  },
}))

function oauthMetadata(publicOrigin: string | undefined): Plugin {
  if (publicOrigin !== undefined) {
    const url = new URL(publicOrigin)
    if (url.protocol !== 'https:' || url.origin !== publicOrigin || url.port !== '') {
      throw new Error('VITE_PUBLIC_URL must be a bare HTTPS origin without a port.')
    }
  }

  const metadataFileName = OAUTH_METADATA_PATH.slice(1)

  function serveDevelopmentMetadata(port: number) {
    const metadata = createDevelopmentOAuthMetadata(`http://${SERVER_HOST}:${port}`)
    const source = JSON.stringify(metadata, null, 2) + '\n'

    return ((request, response, next) => {
      if (request.url?.split('?')[0] !== OAUTH_METADATA_PATH) return next()
      response.setHeader('Content-Type', 'application/json')
      response.setHeader('Access-Control-Allow-Origin', '*')
      response.setHeader('Cache-Control', 'no-store')
      response.end(source)
    }) satisfies import('vite').Connect.NextHandleFunction
  }

  return {
    name: 'oauth-client-metadata',
    configureServer(server) {
      server.middlewares.use(serveDevelopmentMetadata(server.config.server.port ?? 5173))
    },
    configurePreviewServer(server) {
      server.middlewares.use(serveDevelopmentMetadata(server.config.preview.port ?? 4173))
    },
    generateBundle() {
      const metadata = createOAuthMetadata(publicOrigin ?? '__PUBLIC_URL__')
      this.emitFile({
        type: 'asset',
        fileName:
          publicOrigin === undefined
            ? metadataFileName.replace('.json', '.template.json')
            : metadataFileName,
        source: JSON.stringify(metadata, null, 2) + '\n',
      })
    },
  }
}
