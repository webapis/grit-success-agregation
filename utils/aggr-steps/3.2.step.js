//keywor validation

import fs from 'fs'
import path from 'path';
import { makeDirectory } from 'make-dir';
import mergeJsonFiles from '../mergeJsonFiles.js';
import getParentNodeName from '../getParentNodeName.js';
const data = JSON.parse(fs.readFileSync(`${process.cwd()}/data/3.1.step-data/priceMappedData.json`, { encoding: 'utf-8' }))
const folderPath = path.join(process.cwd(), 'meta-data');
const mergedKeywords = await mergeJsonFiles(folderPath)
debugger
console.log('Before Validation', data.length)

for (let d in data) {
    const current = data[d]
    const h4Value = current['h4']
    const h3Value = current['h3']

    const h3FromParent = getParentNodeName(h4Value, [mergedKeywords])
    if (h3FromParent) {
        const {
            parentNodeName, subcategories } = h3FromParent
        if (parentNodeName !== h3Value) {

          //  throw `keyword for h3 wrong: ${JSON.stringify(current)}`
            data[d]={...current,isValid:false}


        } else {

            data[d]={...current,isValid:true}

            console.log(`h3: ${h3Value} is value`)
        }
    } else {
            data[d]={...current,isValid:false}
        debugger
    }



}

debugger
console.log('After Validation', data.length)
await makeDirectory('data/3.2.step-data')
fs.writeFileSync('data/3.2.step-data/validation.json', JSON.stringify(data))

debugger