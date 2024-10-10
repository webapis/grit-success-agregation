//upload navigation and references

 import dotenv from 'dotenv';
import { uploadCollection } from "../uploadToGit.js";
import getJsonDataFileNameFromFolder from '../file/getJsonDataFileNameFromFolder.mjs'
debugger
dotenv.config({ silent: true });
const datas = await getJsonDataFileNameFromFolder('data/5.step-data')

for(let d of datas ){
    const {filename,folder,data}=d
    const gitFolder =`5.step-data/${folder}`
    await uploadCollection({fileName:filename, data,gitFolder})
    console.log('uploaded',gitFolder)
    debugger
}


