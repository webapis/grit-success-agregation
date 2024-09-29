import fs from 'fs'
debugger
const giyimObj = JSON.parse(fs.readFileSync(`${process.cwd()}/meta-data/product-keywords/giyim.json`, { encoding: 'utf-8' }))
debugger
const giyimArray = Object.values(giyimObj[0]).flat(2);
const evVeYasamObj = JSON.parse(fs.readFileSync(`${process.cwd()}/meta-data/product-keywords/ev-ve-yasam.json`, { encoding: 'utf-8' }))
const evVeYasamArray = Object.values(evVeYasamObj[0]).flat(2);

const takiVeMucevherObj = JSON.parse(fs.readFileSync(`${process.cwd()}/meta-data/product-keywords/taki-ve-mucevher.json`, { encoding: 'utf-8' }))
const takiVeMucevherArray = Object.values(takiVeMucevherObj[0]).flat(2);

const kozmetikObj = JSON.parse(fs.readFileSync(`${process.cwd()}/meta-data/product-keywords/kozmetik-kisisel-bakim.json`, { encoding: 'utf-8' }))
const kozmetikArray = Object.values(kozmetikObj[0]).flat(2);
debugger
const h1 = {
    "giyim": giyimArray,
    "ev ve yaşam": evVeYasamArray,
    "takı ve mücevher": takiVeMucevherArray,
    "kozmetik ve kişisel bakım": kozmetikArray

}

export default h1