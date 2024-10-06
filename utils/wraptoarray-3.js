import fs from 'fs'

import getJsonDataFromFolder from './file/getJsonDataFromFolder.mjs'
debugger
const data = await getJsonDataFromFolder('meta-data/product-keywords-3')
const mappedData = data.map(m => m[0])

const mappedDataWrap = mappedData.map(m => {
    let value ={}
    for (let objname in m) {
        const wrapp = wrapInArray({ [objname]: m[objname] })
        const transformed= transformObject(wrapp)
        m[objname] = { ...transformed }
       value={...value,...transformed}

    }
    return value
})
debugger
fs.writeFileSync(`${process.cwd()}/meta-data/product-keywords-wrapped/productnames-3.json`, JSON.stringify(mappedDataWrap))

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
        transformedCategory[propertyName] = subArray;  // Assign the whole array as the value
      });
  
      result[key] = transformedCategory;
    }
  
    return result;
  }