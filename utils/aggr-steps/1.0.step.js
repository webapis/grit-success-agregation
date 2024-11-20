//download data


import 'dotenv/config'
import { makeDirectory } from 'make-dir'
import { downloadCollection } from '../downloadFromGit.js'
import foldersTodownload from '../foldersTodownload.js'
const localRootFolder = 'data/1.0.step-data'
const gitRepo = 'crawler-state-2'
const dev = (process.env.LOCAL === 'true')
const folders = dev ? [
  'sponsor-product-21',  //marksandspencer
 // 'sponsor-product-23'   //paulmark
] : foldersTodownload

console.log('folders to download:', folders.length)
debugger

for (let pth of folders) {

  await makeDirectory(`${process.cwd()}/data/1.0.step-data/unzipped-data/${pth}`)
  await makeDirectory(`${process.cwd()}/data/1.0.step-data/zipped-files/${pth}`)
}
for (let g of folders) {

  const gitFolder = g

  await downloadCollection(gitRepo, localRootFolder, gitFolder)

}


