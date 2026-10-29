# Tangled API contracts

Snarl defaults to `https://api.tangled.org`. `VITE_TANGLED_API_URL` overrides the base URL at build time. Overrides must implement the current contracts; there is no legacy endpoint fallback.

`lexicons.lock.json` pins the upstream revision and consumed schema roots. `lexicons/` contains those schemas and their transitive Tangled references. Generated atcute types and validators live in `src/lib/tangled/lexicons/`. Upstream schema descriptions can still mention old namespaces; the schema IDs and deployed responses determine the contracts.

## Read endpoints

- Repositories: `org.tangled.temp.repo.getRepoByName`, `org.tangled.repo.getRepoByRepoDid`, `org.tangled.repo.listRepos`.
- Search: `org.tangled.search.query`, filtered to `org.tangled.repo.manifest`.
- Tickets: `org.tangled.repo.listIssues`, `org.tangled.repo.listPulls`, `org.tangled.track.getTicketView`.
- Patches: `org.tangled.temp.review.listPatches` and `org.tangled.temp.git.formatPatch`.
- Git: `org.tangled.temp.git.getTree`, `getBlob`, and `listCommitsByRef`. These requests go to Bobbin, not directly to the knot.
- Profiles: `org.tangled.actor.getProfile`.
- Social data: `org.tangled.feed.listComments`, `listStarsBy`, `countStars`, `countStarsBy`, and `org.tangled.graph.countFollows`, `countFollowsBy`, `listNetworkVouches`.
- Strings: `org.tangled.string.getString` and `listStrings`. Records use `org.tangled.snippet.string`; file bytes come from the author's PDS via `com.atproto.sync.getBlob`.
- CI: `org.tangled.ci.queryPipelines` on the repository's Spindle service.

## Identity and response behavior

Repository manifests belong to repository DIDs and have record key `self`. Their declarations identify the human or organization owner and repository name. Ticket URI authorities also identify repositories; ticket authors and comment editors identify people separately.

Issue and pull pages share ticket records. Pull lists use `status`, and the UI displays `completed` pulls as merged. Markdown titles can be structured objects or historical strings. Comments are flattened views, not record envelopes. Migrated string snippets can omit their text-file discriminator; the adapter supplies it only when absent.

Trees do not include README contents. Snarl loads those bytes separately and preserves the tree if the README fails. Commit pages use `ranges` and `skip`. Opaque list cursors are otherwise preserved, with null and empty cursors treated as terminal.

Vouches are viewer-network results. An anonymous empty response does not establish that an actor has no vouches. Snarl does not add authenticated network permissions in this migration.

## Regeneration and verification

Check out the commit recorded in `lexicons.lock.json` in a separate upstream checkout, then run:

```sh
bun scripts/vendor-lexicons.ts /path/to/tangled-core
bun run generate:lexicons
bun run build
```
