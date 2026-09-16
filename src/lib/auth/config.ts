export const OAUTH_SCOPE = 'atproto transition:generic'
export const OAUTH_CALLBACK_PATH = '/auth/callback'
export const OAUTH_METADATA_PATH = '/client-metadata.json'

export function createOAuthMetadata(origin: string, clientId = `${origin}${OAUTH_METADATA_PATH}`) {
  return {
    client_id: clientId,
    client_name: 'snrld',
    client_uri: origin,
    redirect_uris: [`${origin}${OAUTH_CALLBACK_PATH}`],
    scope: OAUTH_SCOPE,
    grant_types: ['authorization_code', 'refresh_token'],
    response_types: ['code'],
    token_endpoint_auth_method: 'none',
    application_type: 'web',
    dpop_bound_access_tokens: true,
  }
}

export function createDevelopmentOAuthMetadata(origin: string) {
  const params = new URLSearchParams({
    redirect_uri: `${origin}${OAUTH_CALLBACK_PATH}`,
    scope: OAUTH_SCOPE,
  })

  return createOAuthMetadata(origin, `http://localhost?${params}`)
}
