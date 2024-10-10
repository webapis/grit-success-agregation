//group data for navigation
import fs from 'fs'
import { makeDirectory } from 'make-dir';
const data = JSON.parse(fs.readFileSync(`${process.cwd()}/data/aggregated.json`, { encoding: 'utf-8' }))
debugger



const {hierarchy} = groupByHierarchy(data)
debugger
await makeDirectory('data/nav')
for(let d of hierarchy){
    const {children,title}=d

    fs.writeFileSync(`data/nav/${title}.json`,JSON.stringify(children))
    
}
debugger



function groupByHierarchy(arr) {
    let totalH5Count = 0; // Counter for the total number of h5 items
  
    const groupBy = (items, level) => {
      const levels = ['h1', 'h2', 'h3', 'h4', 'h5'];
      if (level >= levels.length) return items;
  
      return items.reduce((result, item) => {
        const key = item[levels[level]];
  
        if (!key) return result; // Skip items without a valid key at this level
  
        if (!result[key]) {
          result[key] = { title: key, children: [] };
        }
  
        result[key].children.push(item);
        
        return result;
      }, {});
    };
  
    const buildHierarchy = (items, level = 0) => {
      const grouped = groupBy(items, level);
  
      if (!grouped || Object.keys(grouped).length === 0) return items;
  
      Object.values(grouped).forEach(group => {
        if (level === 4) { // At 'h5' level
          const totalChildren = group.children.length;
          totalH5Count += totalChildren; // Update the total count for h5
  
          // Add a new field to store the total number of children before limiting
          group.total = totalChildren; // Total children count
  
          // Limit the children to 2 items at the 'h5' level
          group.children = group.children.slice(0, 2);
          debugger
        } else {
          group.children = buildHierarchy(group.children, level + 1);
        }
      });
  
      return Object.values(grouped);
    };
  
    const hierarchy = buildHierarchy(arr);
    return { hierarchy, totalH5Count }; // Return both the hierarchy and the total h5 count
  }
  

  //https://chatgpt.com/c/67051b02-0384-800f-95f2-2f3586605b14
