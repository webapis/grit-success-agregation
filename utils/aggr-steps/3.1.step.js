//parse price to float

import fs from 'fs'
import { makeDirectory } from 'make-dir';
import mapPrice from '../mapPrice.mjs'
const data = JSON.parse(fs.readFileSync(`${process.cwd()}/data/3.0.step-data/aggregated.json`, { encoding: 'utf-8' }))
console.log('Before Price Map', data.length)
const priceMapped = data.map((m) => {
    try {
        return { ...m, price: mapPrice(m.price.toString(), m), priceString:  m.price}
    } catch (error) {
        debugger
        throw error
 
    }

})

debugger
console.log('After Price Map', priceMapped.length)
await makeDirectory('data/3.1.step-data')
fs.writeFileSync('data/3.1.step-data/priceMappedData.json', JSON.stringify(priceMapped))

debugger