import fs from 'fs'

const data = JSON.parse(fs.readFileSync('data/aggregated.json', { encoding: 'utf-8' }))
debugger



const groupedData = groupByHierarchy(data)
debugger
fs.writeFileSync('data/grouped.json',JSON.stringify(groupedData))


function groupByHierarchy(arr) {
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
  
      // Check if 'grouped' is empty or undefined
      if (!grouped || Object.keys(grouped).length === 0) return items;
  
      Object.values(grouped).forEach(group => {
        if (level === 4) { // Assuming 'h5' is the deepest level
          // Limit to 2 items at the 'h5' level
          group.children = group.children.slice(0, 2);
        } else {
          group.children = buildHierarchy(group.children, level + 1);
        }
      });
  
      return Object.values(grouped);
    };
  
    return buildHierarchy(arr);
  }
  

  //https://chatgpt.com/c/67051b02-0384-800f-95f2-2f3586605b14