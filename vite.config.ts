import { defineConfig, type Plugin } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [spindleProxy(), react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
  server: {
    allowedHosts: ['petalburg'],
  },
})

function spindleProxy(): Plugin {
  return {
    name: 'spindle-proxy',
    configureServer(server) {
      server.middlewares.use('/spindle', async (request, response, next) => {
        if (request.method !== 'GET') return next()

        try {
          const upstreamUrl = getUpstreamUrl(request.url)
          const upstreamResponse = await fetch(upstreamUrl)
          response.statusCode = upstreamResponse.status
          const contentType = upstreamResponse.headers.get('content-type')
          if (contentType !== null) response.setHeader('content-type', contentType)
          response.end(Buffer.from(await upstreamResponse.arrayBuffer()))
        } catch (error) {
          next(error)
        }
      })
    },
  }
}

function getUpstreamUrl(requestUrl: string | undefined): string {
  const [encodedHostname, ...pathParts] = (requestUrl ?? '/').slice(1).split('/')
  if (encodedHostname === undefined || encodedHostname.length === 0) {
    throw new Error('Missing Spindle hostname')
  }

  const hostname = decodeURIComponent(encodedHostname)
  return `https://${hostname}/${pathParts.join('/')}`
}
