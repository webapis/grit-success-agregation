//download data


import 'dotenv/config'
import { makeDirectory } from 'make-dir'
import { downloadCollection } from '../downloadFromGit.js'
const localRootFolder = 'data/1.0.step-data'
const gitRepo = 'crawler-state-2'
const dev = (process.env.LOCAL==='true')
const folders = dev? [
  'sponsor-product-21',  //marksandspencer
  'sponsor-product-23'   //paulmark
] :[
  'sponsor-ayakkabi',
  'sponsor-product',
  'sponsor-product-1',
  'sponsor-product-2',//koton
  'sponsor-product-3',//mango
  'sponsor-product-4',//beymen
  'sponsor-product-5',//hmdtektil
  'sponsor-product-6',//matras
  'sponsor-product-7',//ateliergalin
  'sponsor-product-8',//diesel
  'sponsor-product-9',//uspoloassn
  'sponsor-product-10',//gap
  'sponsor-product-11',//burberry
  'sponsor-product-13',//camper
  'sponsor-product-14',//converse
  'sponsor-product-15',//eclecticconceptstore
  'sponsor-product-17',//gant
  'sponsor-product-18',//lacoste
  'sponsor-product-19',//pierrecardin
  'sponsor-product-24',//morrez 
  'sponsor-product-25',//yaygan
  'sponsor-product-M-4',//mudo
  'sponsor-product-M-5',//muun
  'sponsor-product-M-6'//sagaza 
  ]

  console.log('folders to download:',folders.length)
debugger

for (let pth of folders) {

  await makeDirectory(`${process.cwd()}/data/1.0.step-data/unzipped-data/${pth}`)
  await makeDirectory(`${process.cwd()}/data/1.0.step-data/zipped-files/${pth}`)
}
for (let g of folders) {

  const gitFolder = g

  await downloadCollection(gitRepo, localRootFolder, gitFolder)

}


