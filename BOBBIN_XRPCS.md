# Bobbin XRPC endpoints

Public base URLs:

- `https://api.tangled.org/xrpc/<nsid>`
- `https://bobbin.klbr.net/xrpc/<nsid>`

Bobbin exposes read-only `GET` endpoints. Most list and count endpoints require a
`subject` query parameter. Repository-proxied endpoints require `repo`; direct
knot-proxied endpoints require `knot`.

## Record lookup

- [x] `sh.tangled.repo.getRepo`
- [ ] `sh.tangled.repo.getRepos`
- [x] `sh.tangled.repo.getRepoByRepoDid`
- [x] `sh.tangled.actor.getProfile`
- [ ] `sh.tangled.actor.getProfiles`
- [ ] `sh.tangled.repo.getIssue`
- [ ] `sh.tangled.repo.getIssues`
- [ ] `sh.tangled.repo.getPull`
- [ ] `sh.tangled.repo.getPulls`

## Aggregations

- [ ] `sh.tangled.feed.listStars`
- [x] `sh.tangled.feed.countStars`
- [ ] `sh.tangled.feed.listComments`
- [ ] `sh.tangled.feed.countComments`
- [ ] `sh.tangled.feed.listReactions`
- [ ] `sh.tangled.feed.countReactions`
- [ ] `sh.tangled.graph.listFollows`
- [x] `sh.tangled.graph.countFollows`
- [ ] `sh.tangled.graph.listVouches`
- [ ] `sh.tangled.graph.countVouches`
- [ ] `sh.tangled.git.listRefUpdates`
- [ ] `sh.tangled.git.countRefUpdates`
- [ ] `sh.tangled.repo.listIssues`
- [ ] `sh.tangled.repo.countIssues`
- [ ] `sh.tangled.repo.listPulls`
- [ ] `sh.tangled.repo.countPulls`
- [ ] `sh.tangled.repo.listCollaborators`
- [ ] `sh.tangled.repo.countCollaborators`
- [ ] `sh.tangled.repo.listRepos`
- [ ] `sh.tangled.repo.countRepos`
- [ ] `sh.tangled.repo.listArtifacts`
- [ ] `sh.tangled.repo.countArtifacts`
- [ ] `sh.tangled.repo.issue.listStates`
- [ ] `sh.tangled.repo.issue.countStates`
- [ ] `sh.tangled.repo.pull.listStatuses`
- [ ] `sh.tangled.repo.pull.countStatuses`
- [ ] `sh.tangled.knot.listKnots`
- [ ] `sh.tangled.knot.countKnots`
- [ ] `sh.tangled.knot.listMembers`
- [ ] `sh.tangled.knot.countMembers`
- [ ] `sh.tangled.spindle.listSpindles`
- [ ] `sh.tangled.spindle.countSpindles`
- [ ] `sh.tangled.spindle.listMembers`
- [ ] `sh.tangled.spindle.countMembers`
- [ ] `sh.tangled.publicKey.listKeys`
- [ ] `sh.tangled.publicKey.countKeys`
- [ ] `sh.tangled.label.listDefinitions`
- [ ] `sh.tangled.label.countDefinitions`
- [ ] `sh.tangled.label.listOps`
- [ ] `sh.tangled.label.countOps`
- [ ] `sh.tangled.pipeline.listPipelines`
- [ ] `sh.tangled.pipeline.countPipelines`
- [ ] `sh.tangled.pipeline.listStatuses`
- [ ] `sh.tangled.pipeline.countStatuses`
- [ ] `sh.tangled.string.listStrings`
- [ ] `sh.tangled.string.countStrings`

## Reverse aggregations

- [ ] `sh.tangled.feed.listStarsBy`
- [ ] `sh.tangled.feed.countStarsBy`
- [ ] `sh.tangled.feed.listCommentsBy`
- [ ] `sh.tangled.feed.countCommentsBy`
- [ ] `sh.tangled.feed.listReactionsBy`
- [ ] `sh.tangled.feed.countReactionsBy`
- [ ] `sh.tangled.graph.listFollowsBy`
- [x] `sh.tangled.graph.countFollowsBy`
- [ ] `sh.tangled.graph.listVouchesBy`
- [ ] `sh.tangled.graph.countVouchesBy`
- [ ] `sh.tangled.git.listRefUpdatesBy`
- [ ] `sh.tangled.git.countRefUpdatesBy`
- [ ] `sh.tangled.repo.listIssuesBy`
- [ ] `sh.tangled.repo.countIssuesBy`
- [ ] `sh.tangled.repo.listPullsBy`
- [ ] `sh.tangled.repo.countPullsBy`
- [ ] `sh.tangled.repo.listCollaboratorsBy`
- [ ] `sh.tangled.repo.countCollaboratorsBy`
- [ ] `sh.tangled.repo.listArtifactsBy`
- [ ] `sh.tangled.repo.countArtifactsBy`
- [ ] `sh.tangled.repo.issue.listStatesBy`
- [ ] `sh.tangled.repo.issue.countStatesBy`
- [ ] `sh.tangled.repo.pull.listStatusesBy`
- [ ] `sh.tangled.repo.pull.countStatusesBy`
- [ ] `sh.tangled.knot.listMembersBy`
- [ ] `sh.tangled.knot.countMembersBy`
- [ ] `sh.tangled.spindle.listMembersBy`
- [ ] `sh.tangled.spindle.countMembersBy`
- [ ] `sh.tangled.label.listOpsBy`
- [ ] `sh.tangled.label.countOpsBy`
- [ ] `sh.tangled.pipeline.listPipelinesBy`
- [ ] `sh.tangled.pipeline.countPipelinesBy`
- [ ] `sh.tangled.pipeline.listStatusesBy`
- [ ] `sh.tangled.pipeline.countStatusesBy`

## Utility and special endpoints

- [ ] `sh.tangled.search.query`
- [ ] `sh.tangled.bobbin.getCoverage`
- [ ] `com.bad-example.identity.resolveMiniDoc`

## Repository-knot proxies

- [ ] `sh.tangled.repo.archive`
- [ ] `sh.tangled.repo.blob`
- [ ] `sh.tangled.repo.branch`
- [ ] `sh.tangled.repo.branches`
- [ ] `sh.tangled.repo.compare`
- [ ] `sh.tangled.repo.describeRepo`
- [ ] `sh.tangled.repo.diff`
- [ ] `sh.tangled.repo.getDefaultBranch`
- [ ] `sh.tangled.repo.languages`
- [ ] `sh.tangled.repo.listSecrets`
- [ ] `sh.tangled.repo.log`
- [ ] `sh.tangled.repo.tag`
- [ ] `sh.tangled.repo.tags`
- [ ] `sh.tangled.repo.tree`

## Direct-knot proxies

- [ ] `sh.tangled.owner`
- [ ] `sh.tangled.knot.version`
- [ ] `sh.tangled.knot.listKeys`
