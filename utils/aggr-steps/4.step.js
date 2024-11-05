import fs from 'fs';
import { makeDirectory } from 'make-dir';
import ImageValidator from '../ImageValidator.js';

const data = JSON.parse(fs.readFileSync(`${process.cwd()}/data/3.2.step-data/validation.json`, { encoding: 'utf-8' }));
debugger;
let notValidImageCounter=0
let validImageCounter =0
const { hierarchy } = await groupByHierarchy(data);
debugger;

await makeDirectory('data/4.step-data');


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

            if (!key) return result;

            if (!result[key]) {
                result[key] = { title: key, children: [] };
            }

            result[key].children.push(item);
            return result;
        }, {});
    };

    const validateImage = async (imageUrl) => {
        try {
            const validator = new ImageValidator({
                timeout: 10000,      // Increased timeout for potentially slow image servers
                maxRetries: 3,       // Retry 3 times if failed
                maxConcurrent: 5,    // Process 5 images concurrently
                autoReferer: true    // Auto extract referer from image URL
              });
            const result = await validator.validateImage(imageUrl);
            if(
                result.contentType !==
                'image/jpeg'){
                    debugger
                }
         
            return {
                isValid: result.statusCode===206 || result.statusCode===200,
                statusCode: result.statusCode,
                contentType: result.contentType,
                error: result.error
            };
        } catch (error) {
            return {
                isValid: false,
                error: error.message
            };
        }
    };

    const buildHierarchy = async (items, level = 0) => {
        const grouped = groupBy(items, level);

        if (!grouped || Object.keys(grouped).length === 0) return items;

        await Promise.all(
            Object.values(grouped).map(async (group) => {
                group.children = await buildHierarchy(group.children, level + 1);
                group.childrenLength = Array.isArray(group.children) ? group.children.length : 0;

                if (level === 4) {
                    const slicedChildren = group.children
                        .sort((a, b) => b.isLinkCandidate - a.isLinkCandidate)
                        .slice(0, 2);
                    
                    // Validate images for sliced children
                    const validatedChildren = await Promise.all(
                        slicedChildren.map(async (child) => {
                            if (child.img) {
                              
                                    const imageValidation = await validateImage(child.img);
                             
                             
                                    return {
                                        ...child,
                                        imageValidation
                                    };
                                
                            
                            }
                            return child;
                        })
                    );

                    // Filter out invalid images if needed
                    group.children = validatedChildren.filter(child => 
                        !child.imageValidation || child.imageValidation.isValid
                    );

                    // Log validation results (optional)
                    validatedChildren.forEach(child => {
                        if (child.imageValidation) {
                            debugger
                            if(!child.imageValidation.isValid){

                                    ++ notValidImageCounter
                                    console.log(`Image validation result for ${child.img}:`, 
                                        child.imageValidation,'counter:',notValidImageCounter); 
                            }else{
                               ++ validImageCounter
                             
                            }

                        }
                    });
                }
            })
        );

        return Object.values(grouped);
    };

    const hierarchy = await buildHierarchy(arr);
    console.log('validImageCounter',validImageCounter)
    console.log('notValidImageCounter',notValidImageCounter)
    return { hierarchy };
}