//keywor validation

import fs from 'fs'
import path from 'path';
import { makeDirectory } from 'make-dir';
import mergeJsonFiles from '../mergeJsonFiles.js';
import getParentNodeName from '../getParentNodeName.js';
import deaccent from '../deaccent.js';
const data = JSON.parse(fs.readFileSync(`${process.cwd()}/data/3.1.step-data/priceMappedData.json`, { encoding: 'utf-8' }))
const folderPath = path.join(process.cwd(), 'meta-data');
const mergedKeywords = await mergeJsonFiles(folderPath)
debugger
console.log('Before Validation', data.length)
let countIsValid = 0
for (let d in data) {
    const current = data[d]
    const h4Value = current['h4']
    const h3Value = current['h3']
    if (h4Value && h3Value) {
        const h3FromParent = getParentNodeName(h4Value, [mergedKeywords])
        if (h3FromParent) {
            const {
                parentNodeName, subcategory } = h3FromParent
            debugger
            if (parentNodeName !== h3Value) {

                //  throw `keyword for h3 wrong: ${JSON.stringify(current)}`
                data[d] = { ...current, isValid: false, isLinkCandidate: false }


            } else {
                const kwords = Array.isArray(subcategory) ? subcategory.map(m => deaccent(m)) : [deaccent(subcategory)]
                const isLinkCandidate = containsKeywordWithinPageUrl(current.pageURLString, kwords)
                if (isLinkCandidate) {
                  //  console.log(`pageURL isLinkCandidate:${h4Value}: ${isLinkCandidate}: ${current.pageURLString}: count:${countIsValid++}`)
                }

                data[d] = { ...current, isValid: true, isLinkCandidate }

                //   console.log(`h3: ${h3Value} is value`)
            }
        } else {
            data[d] = { ...current, isValid: false, isLinkCandidate: false }
            debugger
        }

    } else {
        data[d] = { ...current, isValid: false, isLinkCandidate: false }
    }




}


function containsKeywordWithinPageUrl(str, values) {
    const lowerStr = str.toLowerCase();
    return [...values,'aksesuar',
        'ayakkabi',
        'bluz',
        't-shirt',
        'dis-giyim',
        'triko',
        'ceket',
        'elbise',
        'smokin',
        'gamze-ercel',
        'cuzdan',
        'kol-dugmesi'
    ].some(value => lowerStr.includes(value));
}
debugger
console.log('After Validation', data.length)
await makeDirectory('data/3.2.step-data')
fs.writeFileSync('data/3.2.step-data/validation.json', JSON.stringify(data.filter(f => f.isValid)))
fs.writeFileSync('data/3.2.step-data/invalid.json', JSON.stringify(data.filter(f => !f.isValid)))

debugger