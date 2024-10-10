//parse price to float

import fs from 'fs'
import { makeDirectory } from 'make-dir';
import mapPrice from '../mapPrice.mjs'
const data = JSON.parse(fs.readFileSync(`${process.cwd()}/data/3.0.step-data/aggregated.json`, { encoding: 'utf-8' }))

const priceMapped = data.map((m) => {

    return { ...m, price: mapPrice(m.price, m), priceString: m.price }
})

debugger
await makeDirectory('data/3.1.step-data')
fs.writeFileSync('data/3.1.step-data/priceMappedData.json', JSON.stringify(priceMapped))

debugger