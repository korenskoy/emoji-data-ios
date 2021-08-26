const raw = require('./emoji-data.json')

let x = raw
  .filter((x, i) => i % 2)
  .map(item => item.map(i => i[0]))
  .map(item => item.map(i => String.fromCodePoint(...i.split('-').map(x => parseInt(x, 16))) ))

require('fs').writeFileSync('compact-categories.json', JSON.stringify(x).replace(/\]/g, ']\n'))
