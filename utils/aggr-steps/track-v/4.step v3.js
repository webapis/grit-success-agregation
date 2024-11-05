
/*
can we track process by logging. start, remaning,end, duration



*/
import fs from 'fs';
import { makeDirectory } from 'make-dir';
import isValidImageUrl from '../validateImageUrl.js';

const data = JSON.parse(fs.readFileSync(`${process.cwd()}/data/3.2.step-data/validation.json`, { encoding: 'utf-8' }));

const { hierarchy } = await groupByHierarchy(data);

await makeDirectory('data/4.step-data');

for (let d of hierarchy) {
    const { children, title } = d;
    fs.writeFileSync(`data/4.step-data/${title}.json`, JSON.stringify(children));
}

async function groupByHierarchy(arr) {
    const groupBy = (items, level) => {
        const levels = ['h1', 'h2', 'h3', 'h4', 'h5'];
        if (level >= levels.length) return items;

        return items.reduce((result, item) => {
            const key = item[levels[level]];

            if (!key) return result;

            if (!result[key]) {
                result[key] = { title: key, children: [] };
            }

            result[key].children.push(item);
            return result;
        }, {});
    };

    const buildHierarchy = async (items, level = 0) => {
        const grouped = groupBy(items, level);

        if (!grouped || Object.keys(grouped).length === 0) return items;

        // Use Promise.all with map instead of forEach
        const processedGroups = await Promise.all(
            Object.values(grouped).map(async (group) => {
                // Recursively process children
                group.children = await buildHierarchy(group.children, level + 1);
                group.childrenLength = Array.isArray(group.children) ? group.children.length : 0;

                // Handle h5 level processing
                if (level === 4) {
                    const sortedProducts = group.children
                        .sort((a, b) => b.isLinkCandidate - a.isLinkCandidate)
                        .slice(0, 2);
                    
                    // Process image validation in parallel
                    const validatedProducts = await Promise.all(
                        sortedProducts.map(async (product) => {
                            try {
                                const isValidImage = await isValidImageUrl(product.img);
                   
                                return { ...product, isValidImage };
                            } catch (error) {
                           
                                console.error(`Error validating image for product: ${product.title}`, error);
                                return { ...product, isValidImage: false };
                            }
                        })
                    );
debugger
                    group.children = validatedProducts;
                }

                return group;
            })
        );

        return processedGroups;
    };

    const hierarchy = await buildHierarchy(arr);
    return { hierarchy };
}

export { groupByHierarchy };