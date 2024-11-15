//download data


import 'dotenv/config'
import { makeDirectory } from 'make-dir'
import { downloadCollection } from '../downloadFromGit.js'
const localRootFolder = 'data/1.0.step-data'
const gitRepo = 'crawler-state-2'
const folders = [

 //   'sponsor-ayakkabi',
    'sponsor-product',
    // 'sponsor-product-1',
    //  'sponsor-product-2',
    //  'sponsor-product-3',
    //  'sponsor-product-4',
    // 'sponsor-product-M-4',
    // 'sponsor-product-M-5',
    // 'sponsor-product-M-6'
]
debugger

for (let pth of folders) {

    await makeDirectory(`${process.cwd()}/data/1.0.step-data/unzipped-data/${pth}`)
    await makeDirectory(`${process.cwd()}/data/1.0.step-data/zipped-files/${pth}`)
}
for (let g of folders) {

    const gitFolder = g

    await downloadCollection(gitRepo, localRootFolder, gitFolder)

}


