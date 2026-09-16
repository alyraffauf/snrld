import {
  configureOAuth,
  createAuthorizationUrl,
  finalizeAuthorization,
  getSession,
  listStoredSessions,
  OAuthUserAgent,
  type Session,
} from '@atcute/oauth-browser-client'

import type { Handle } from '@atcute/lexicons'

import { getMiniDoc } from '../microcosm'
import { OAUTH_METADATA_PATH } from './config'

async function loadOAuthConfiguration() {
  const response = await fetch(OAUTH_METADATA_PATH)
  if (!response.ok) {
    throw new Error('Could not load OAuth client metadata.')
  }

  const metadata: unknown = await response.json()
  if (
    typeof metadata !== 'object' ||
    metadata === null ||
    !('client_id' in metadata) ||
    typeof metadata.client_id !== 'string' ||
    !('redirect_uris' in metadata) ||
    !Array.isArray(metadata.redirect_uris) ||
    typeof metadata.redirect_uris[0] !== 'string' ||
    !('scope' in metadata) ||
    typeof metadata.scope !== 'string' ||
    !metadata.scope.split(' ').includes('atproto')
  ) {
    throw new Error('Invalid OAuth client metadata.')
  }

  new URL(metadata.client_id)
  new URL(metadata.redirect_uris[0])

  configureOAuth({
    metadata: {
      client_id: metadata.client_id,
      redirect_uri: metadata.redirect_uris[0],
    },
    identityResolver: { resolve: getMiniDoc },
  })

  return { scope: metadata.scope }
}

let oauthConfiguration: ReturnType<typeof loadOAuthConfiguration> | undefined

function getOAuthConfiguration() {
  oauthConfiguration ??= loadOAuthConfiguration().catch((error) => {
    oauthConfiguration = undefined
    throw error
  })
  return oauthConfiguration
}

export async function signIn(handle: Handle): Promise<void> {
  const { scope } = await getOAuthConfiguration()
  const authorizationUrl = await createAuthorizationUrl({
    target: { type: 'account', identifier: handle },
    scope,
  })

  await new Promise<void>((resolve) => setTimeout(resolve, 200))
  window.location.assign(authorizationUrl.href)
}

async function completeSignIn() {
  const params = new URLSearchParams(window.location.hash.slice(1))

  window.history.replaceState(
    window.history.state,
    '',
    window.location.pathname + window.location.search,
  )

  await getOAuthConfiguration()
  const { session } = await finalizeAuthorization(params)
  return session
}

let signInCompletion: ReturnType<typeof completeSignIn> | undefined

export function finishSignIn() {
  signInCompletion ??= completeSignIn()
  return signInCompletion
}

export async function restoreSession() {
  await getOAuthConfiguration()
  const [did] = listStoredSessions()

  if (did === undefined) {
    return null
  }

  return getSession(did)
}

export async function signOut(session: Session): Promise<void> {
  const agent = new OAuthUserAgent(session)
  await agent.signOut()
}
