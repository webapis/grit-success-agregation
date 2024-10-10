//parse price to float

import fs from 'fs'
import mapPrice from '../mapPrice.mjs'
const data = JSON.parse(fs.readFileSync(`${process.cwd()}/data/aggregated.json`, { encoding: 'utf-8' }))

const priceMapped = data.map((m) => {

    return { ...m, price: mapPrice(m.price, m), priceString: m.price }
})

debugger

fs.writeFileSync('data/priceMappedData.json', JSON.stringify(priceMapped))

debugger