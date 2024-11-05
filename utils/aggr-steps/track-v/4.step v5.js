
/*
i need to run image validation at //------///-------
*/
import fs from 'fs';
import { makeDirectory } from 'make-dir';
import ImageValidator from '../ImageValidator';
const data = JSON.parse(fs.readFileSync(`${process.cwd()}/data/3.2.step-data/validation.json`, { encoding: 'utf-8' }));
debugger;

const { hierarchy } = await groupByHierarchy(data);
debugger;

await makeDirectory('data/4.step-data');
const validator = new ImageValidator();
for (let d of hierarchy) {
    const { children, title } = d;
    fs.writeFileSync(`data/4.step-data/${title}.json`, JSON.stringify(children));
}
debugger;

async function groupByHierarchy(arr) {
    const groupBy = (items, level) => {
        const levels = ['h1', 'h2', 'h3', 'h4', 'h5'];
        if (level >= levels.length) return items;

        return items.reduce((result, item) => {
            const key = item[levels[level]];

            if (!key) return result; // Skip items without a valid key at this level

            if (!result[key]) {
                result[key] = { title: key, children: [] }; // Initialize children array
            }

            result[key].children.push(item);
            return result;
        }, {});
    };

    const buildHierarchy = async (items, level = 0) => {
        const grouped = groupBy(items, level);

        if (!grouped || Object.keys(grouped).length === 0) return items;

        // Process all groups in parallel
        await Promise.all(
            Object.values(grouped).map(async (group) => {
                // Process children asynchronously
                group.children = await buildHierarchy(group.children, level + 1);
                group.childrenLength = Array.isArray(group.children) ? group.children.length : 0;

                // Limit children at the h5 level
                if (level === 4) {
                    const slicedChildren= group.children
                    .sort((a, b) => b.isLinkCandidate - a.isLinkCandidate)
                    .slice(0, 2);
                    group.children =slicedChildren

                    

                    
                }
            })
        );

        return Object.values(grouped);
    };

    const hierarchy = await buildHierarchy(arr);
    return { hierarchy };
}