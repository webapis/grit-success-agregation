//group data for navigation and validate image
import fs from 'fs';
import { makeDirectory } from 'make-dir';
import isValidImageUrl from '../validateImageUrl.js';
const data = JSON.parse(fs.readFileSync(`${process.cwd()}/data/3.2.step-data/validation.json`, { encoding: 'utf-8' }));
debugger;

const { hierarchy } = groupByHierarchy(data);
debugger;

await makeDirectory('data/4.step-data');

for (let d of hierarchy) {
    const { children, title } = d;
    fs.writeFileSync(`data/4.step-data/${title}.json`, JSON.stringify(children));
}
debugger;

function groupByHierarchy(arr) {
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

    const buildHierarchy = (items, level = 0) => {
        const grouped = groupBy(items, level);

        if (!grouped || Object.keys(grouped).length === 0) return items;

        Object.values(grouped).forEach(async (group) => {
            group.children = buildHierarchy(group.children, level + 1);
            group.childrenLength = Array.isArray(group.children) ? group.children.length : 0; // Count immediate children

            // Limit children at the h5 level
            if (level === 4) {
                group.children = group.children.sort((a, b) => b.isLinkCandidate - a.isLinkCandidate).slice(0, 2); // Limit to 2 items at h5 level
                const products = group.children.sort((a, b) => b.isLinkCandidate - a.isLinkCandidate).slice(0, 2)
                for (let p of products) {
              
                    try {
                        const isValidImage = await isValidImageUrl(p.img)
                        debugger
                    } catch (error) {
                        debugger
                    }

                    debugger
                }
                debugger

            }
        });

        return Object.values(grouped);
    };

    const hierarchy = buildHierarchy(arr);
    return { hierarchy }; // Return only the hierarchy
}
