<p align="center">
  <img src="public/catppuccin-logo.png" alt="Catppuccin logo" width="96" />
</p>

<h1 align="center">snrld</h1>

<p align="center">
  An beautiful client for <a href="https://tangled.org">Tangled</a>.
</p>

snrld lets you browse public profiles, repositories, strings, stars, vouches, issues, and pull requests through the Bobbin XRPC service. You can sign in with AT Protocol OAuth. Write features are planned for a future release.

## Stack

- React 19, TypeScript, and Vite
- React Router for client-side routing
- Tailwind CSS with the Catppuccin Frappe palette
- React Compiler for automatic memoization
- Bun for dependency management and scripts

## Getting started

Install dependencies and start the development server:

```sh
bun install
bun run dev
```

Open <http://127.0.0.1:5173>. Vite generates the OAuth client ID and callback address from the development server port. No OAuth environment variables are needed for local development.

Build and preview the production bundle:

```sh
bun run build
bun run preview
```

Preview uses <http://127.0.0.1:4173> and generates its own local OAuth metadata.

## OAuth configuration

Define the requested permissions in `OAUTH_SCOPE` in `src/lib/auth/config.ts`. Both development and production client metadata use this value. The browser loads `/client-metadata.json` before using atcute and requests the scopes declared in that document.

For a static deployment, supply the public HTTPS origin at build time:

```sh
VITE_PUBLIC_URL=https://snrld.example bun run build
```

The build generates `dist/client-metadata.json`, including the `/auth/callback` redirect URL. Serve that JSON file at the same public origin. Use an origin without a path, trailing slash, or port.

Sign in again after changing scopes to grant the new permissions.

## Run in a container

Build the image from the repository root:

```sh
docker build -f Containerfile -t snrld .
```

Start the container:

```sh
docker run --rm -p 8080:80 -e PUBLIC_URL=https://snrld.example snrld
```

Replace `https://snrld.example` with your public HTTPS origin and route it to port 8080 through your HTTPS reverse proxy. Open the app at that origin. You can also run these commands with `podman` in place of `docker`.

The container generates `client-metadata.json` from `PUBLIC_URL` at startup. The same image can run at different origins without rebuilding. OAuth scopes remain part of the image, so scope changes require a rebuild.

The image serves the production bundle with nginx and supports direct links to client-side routes.
The GitHub Actions workflow builds the image for pull requests to `main`.
Pushes to `main` and manual runs publish `ghcr.io/alyraffauf/snrld` with `latest` and commit SHA tags.

## Checks

```sh
bun run lint
bun run format:check
```

Run `bun run format` to apply formatting changes.

## Routes

| Route                      | Purpose                                                     |
| -------------------------- | ----------------------------------------------------------- |
| `/`                        | Search for a Tangled profile                                |
| `/:handle`                 | Profile overview, repositories, strings, stars, and vouches |
| `/:handle/:repo`           | Repository README, source tree, issues, and pull requests   |
| `/strings/:handle/:string` | A single Tangled string                                     |

## Data source

The client currently reads public data from [Bobbin](https://bobbin.klbr.net), the Tangled XRPC service.
