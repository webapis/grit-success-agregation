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
       
            if (parentNodeName !== h3Value) {

                //  throw `keyword for h3 wrong: ${JSON.stringify(current)}`
                data[d] = { ...current, isValid: false, isLinkCandidate: false }


            } else {
                if(current.title.includes('Mailo Siyah Kadın Kapitone Deri Bot') ){
                    debugger
                }
                const kwords = Array.isArray(subcategory) ? subcategory.map(m => deaccent(m)) : [deaccent(subcategory)]
                const isLinkCandidate = bestMatchingKeyword(current.pageURLString, kwords)
                const isLinkCandidateTitle = bestMatchingKeyword(deaccent(current.title), kwords)

          
                const isCandidate = (isLinkCandidate && isLinkCandidateTitle) ? true : false
                if (isLinkCandidate) {
                    //  console.log(`pageURL isLinkCandidate:${h4Value}: ${isLinkCandidate}: ${current.pageURLString}: count:${countIsValid++}`)
                }

                data[d] = { ...current, isValid: true, isLinkCandidate:isCandidate }

                //   console.log(`h3: ${h3Value} is value`)
            }
        } else {
            data[d] = { ...current, isValid: false, isLinkCandidate: false }
         
        }

    } else {
        data[d] = { ...current, isValid: false, isLinkCandidate: false }
    }




}


function bestMatchingKeyword(longString, keywords) {
    // Replace hyphens with spaces and convert to lower case
    const formattedLongString = longString.replace(/-/g, ' ').toLowerCase();
    const formattedKeywords = keywords.map(keyword => keyword.replace(/-/g, ' ').toLowerCase());

    let bestMatch = null;
    let bestMatchLengthDifference = Infinity;

    // Iterate through keywords in reverse order to find the last best match
    for (let i = formattedKeywords.length - 1; i >= 0; i--) {
        const keyword = formattedKeywords[i];
        const index = formattedLongString.indexOf(keyword);

        if (index !== -1) {
            const foundLength = keyword.length;
            const substringLength = formattedLongString.substring(index, index + foundLength).length;
            const lengthDifference = Math.abs(foundLength - substringLength);

            // Check if this is a better match
            if (lengthDifference < bestMatchLengthDifference) {
                bestMatchLengthDifference = lengthDifference;
                bestMatch = keyword;
            }
        }
    }

    return bestMatch;
}

// Example usage:
const longStr = "This is an example-long string with some-keywords.";
const keywords = ["some-keywords", "example", "test-keyword"];
const result = bestMatchingKeyword(longStr, keywords);
console.log(result); // Output: "some keywords" or "example" based on the string
debugger
console.log('After Validation', data.length)
await makeDirectory('data/3.2.step-data')
fs.writeFileSync('data/3.2.step-data/validation.json', JSON.stringify(data.filter(f => f.isValid)))
fs.writeFileSync('data/3.2.step-data/invalid.json', JSON.stringify(data.filter(f => !f.isValid)))

debugger