import fs from 'fs'
import wraptoarray from './utils/wraptoarray.js'
import getJsonDataFromFolder from './utils/file/getJsonDataFromFolder.mjs'
debugger
const data = await getJsonDataFromFolder('meta-data/product-keywords')
const mappedData = data.map(m => m[0])

const mappedDataWrap = mappedData.map(m => {
    let value ={}
    for (let objname in m) {
        const current = wraptoarray({ [objname]: m[objname] })
        m[objname] = { ...current }
       value={...value,...current}

    }
    return value
})
debugger
fs.writeFileSync(`${process.cwd()}/meta-data/product-keywords-wrapped/productnames.json`, JSON.stringify(mappedDataWrap))
debugger

debugger