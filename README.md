<p align="center">
  <img src="public/catppuccin-logo.png" alt="Catppuccin logo" width="96" />
</p>

<h1 align="center">snrld</h1>

<p align="center">
  An beautiful client for <a href="https://tangled.org">Tangled</a>.
</p>

snrld currently lets you browse public profiles, repositories, strings, stars, vouches, issues, and pull requests through the Bobbin XRPC service. Authentication and write features are planned for a future release.

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

Build and preview the production bundle:

```sh
bun run build
bun run preview
```

## Run in a container

Build the image from the repository root:

```sh
docker build -f Containerfile -t snrld .
```

Start the container:

```sh
docker run --rm -p 8080:80 snrld
```

Open <http://localhost:8080>. You can also run these commands with `podman` in place of `docker`.

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
