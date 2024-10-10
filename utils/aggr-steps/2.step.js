//preprare for aggregation

import fs from 'fs'

import getJsonDataFromFolder from '../file/getJsonDataFromFolder.mjs'
import getJsonDataFileNameFromFolder from '../file/getJsonDataFileNameFromFolder.mjs'
debugger


function wrapInArray(data) {
    // Traverse object properties
    if (typeof data === 'object' && !Array.isArray(data)) {
        Object.keys(data).forEach(key => {
            if (Array.isArray(data[key])) {
                // For array values, check each element
                data[key] = data[key].map(item => {
                    // If item is not an array, wrap it in an array
                    return Array.isArray(item) ? item : [item];
                });
            }
        });
    }
    return data;
}

function transformObject(input) {
    const result = {};

    for (const key in input) {
        const transformedCategory = {};

        input[key].forEach(subArray => {
            const propertyName = subArray[0].toLowerCase(); // Use the first value as the property name and convert it to lowercase
         
            transformedCategory[propertyName] = subArray;  
           
           // Assign the whole array as the value
        });

        result[key] = transformedCategory;
    }

    return result;
}


async function prepareKeywords({ id }) {
    const folderName = (id === 1 ? 'meta-data/product-keywords' : `meta-data/product-keywords-${id}`)
    const data = await getJsonDataFromFolder(folderName)
    const mappedData = data.map(m => m[0])

    const mappedDataWrap = mappedData.map(m => {
        let value = {}
        for (let objname in m) {
            const wrapp = wrapInArray({ [objname]: m[objname] })
            const transformed = transformObject(wrapp)
            m[objname] = { ...transformed }
            value = { ...value, ...transformed }

        }
        return value
    })

    fs.writeFileSync(`${process.cwd()}/data/2.step-data/productnames-${id}.json`, JSON.stringify(mappedDataWrap))

}
async function prepareKeywords2({ id }) {
    const folderName = (id === 1 ? 'meta-data/product-keywords' : `meta-data/product-keywords-${id}`)
    const data = await getJsonDataFileNameFromFolder(folderName)
    const mappedData = data

    const mappedDataWrap = mappedData.map((mData) => {
        let value = {}
        const m = mData.data[0]
        const filename =mData.filename
        debugger
        const fl ={[filename]:{}}
        for (let objname in m) {
            const wrapp = wrapInArray({ [objname]: m[objname] })
            const transformed = transformObject(wrapp, filename)
            m[filename] = { ...transformed }
            debugger
            value = { ...value, ...transformed }
            debugger
            fl[filename]={ ...fl[filename], ...transformed[objname] }
        }
        return fl
    })

    fs.writeFileSync(`${process.cwd()}/data/2.step-data/productnames--${id}.json`, JSON.stringify(mappedDataWrap))

}

await prepareKeywords2({id:1})
await prepareKeywords2({id:2})
await prepareKeywords2({id:3})
await prepareKeywords2({id:4})


await prepareKeywords({ id: 1 })
await prepareKeywords({ id: 2 })
await prepareKeywords({ id: 3 })
await prepareKeywords({ id: 4 })