//download data


import 'dotenv/config'

import { downloadCollection } from '../downloadFromGit.js'
const localRootFolder = 'data/1.step-data'
const gitRepo = 'crawler-state-2'
const folders = ['gelinlik','buyuk_beden_elbise']
debugger
for (let g of folders) {

    const gitFolder = g
    await downloadCollection(gitRepo, localRootFolder, gitFolder)

}


