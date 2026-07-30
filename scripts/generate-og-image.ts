import { readFile, writeFile } from 'node:fs/promises'
import { Resvg } from '@resvg/resvg-js'
import { createElement } from 'react'
import satori from 'satori'

const WIDTH = 1200
const HEIGHT = 630
const fontData = await readFile('public/fonts/CaskaydiaCoveNerdFont-Regular.ttf')
const logoData = await readFile('public/catppuccin-logo.png')
const logoUrl = `data:image/png;base64,${logoData.toString('base64')}`

const svg = await satori(
  createElement(
    'div',
    {
      style: {
        alignItems: 'center',
        backgroundColor: '#303446',
        color: '#c6d0f5',
        display: 'flex',
        height: '100%',
        padding: '72px',
        position: 'relative',
        width: '100%',
      },
    },
    createElement('img', {
      height: 152,
      src: logoUrl,
      style: { marginRight: '48px', width: 152 },
      width: 152,
    }),
    createElement(
      'div',
      { style: { display: 'flex', flexDirection: 'column' } },
      createElement('div', { style: { color: '#babbf1', fontSize: 72 } }, 'snrld'),
      createElement(
        'div',
        { style: { fontSize: 30, lineHeight: 1.4, marginTop: '18px' } },
        'Tightly-knit social coding for cats.',
      ),
    ),
  ),
  {
    fonts: [{ data: fontData, name: 'Caskaydia Cove', style: 'normal', weight: 400 }],
    height: HEIGHT,
    width: WIDTH,
  },
)

const image = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render()
await writeFile('public/og.png', image.asPng())
