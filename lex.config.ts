import { defineLexiconConfig } from '@atcute/lex-cli'
export default defineLexiconConfig({
  generate: {
    outdir: 'src/lib/tangled/lexicons',
    clean: true,
    imports: ['@atcute/atproto'],
    files: ['lexicons/*.json'],
  },
})
