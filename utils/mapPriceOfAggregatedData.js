import fs from 'fs'
import mapPrice from './mapPrice.js'
const data = JSON.parse(fs.readFileSync('data/aggregated.json', { encoding: 'utf-8' }))

const priceMapped = data.map((m) => {

    return { ...m, price: mapPrice(m.price, m), priceString: m.price }
})

debugger

fs.writeFileSync('data/priceMappedData.json', JSON.stringify(priceMapped))

debugger