//download data


import 'dotenv/config'
import { makeDirectory } from 'make-dir'
import { downloadCollection } from '../downloadFromGit.js'
import foldersTodownload from '../foldersTodownload.js'
const localRootFolder = 'data/1.0.step-data'
const gitRepo = 'crawler-state-2'
const dev = (process.env.LOCAL === 'true')
const folders = dev ? [

  //'tubabutik',
  //'tarikediz',
  //'hollylolly',
  //'perspectivewoman',
  //'rivus',
  //'arzukaprol',
  //'sorbe',
  //'victoriassecret',
  //'maisonju',
  //'berr-in',
  //'nevermore',
  //'dilekhanif',
  //'bizeonline',
  //'dressweden',
  //'niqozza',
   // 'olegcassini',
 //'silkandcashmere',
//'aldoshoes',
//'ninewest',
//'shopseizetheday',
//'serpil',
//'bejfinefactory',
//'dilvin',
//'ihandmore'

//https://www.knitss.com/
//https://tr.kutnia.com/
//https://museforall.com/tr
//https://www.naarstore.com/
//https://www.upgrade.moda/
//https://atolyemariposa.com/
//https://www.collare.com.tr/
//https://elli2.com.tr/
//https://www.feudeelu.com/
//https://www.istanbulfashioncenter.com/gullay
//https://jabotter.com/
//https://lalucegiyim.com.tr/
//https://ladyginacompany.com/
//https://www.love-onfriday.com/
//https://www.maisaistanbul.com/
//https://misirli1951.com/

//'tubaergin'
  //'mango'

  //'ateliergalin'
  //'lovemetoo'
  //'eclecticconceptstore'
  //'edwards'

  //'pullandbear'

  //'hm'
  //'paulmark'


  //'ltbjeans'

  //'edliskids'


  //'sagaza'

  //'marksandspencer'






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


