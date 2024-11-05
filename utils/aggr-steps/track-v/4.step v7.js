
/*

my purpose is to rate higher objects with valid image urls and increate the chance on placing objects with valid images within validatedResults
*/
import fs from 'fs';
import { makeDirectory } from 'make-dir';
import ImageValidator from '../ImageValidator.js';

const data = JSON.parse(fs.readFileSync(`${process.cwd()}/data/3.2.step-data/validation.json`, { encoding: 'utf-8' }));
let notValidImageCounter = 0;
let validImageCounter = 0;
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

    const validateImage = async (imageUrl) => {
        try {
            const validator = new ImageValidator({
                timeout: 30000,
                maxRetries: 5,
                maxConcurrent: 1,
                autoReferer: true
            });
            const result = await validator.validateImage(imageUrl);
            
            return {
                isValid: result.statusCode === 206 || result.statusCode === 200,
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
                    // Sort children by isLinkCandidate
                    const sortedChildren = group.children
                        .sort((a, b) => b.isLinkCandidate - a.isLinkCandidate);

                    const validatedResults = [];
                    let checkedCount = 0;
                    
                    // Validate images until we find 2 valid ones or reach the limits
                    for (let i = 0; i < sortedChildren.length && validatedResults.length < 2; i++) {
                        const child = sortedChildren[i];
                        if (child.img) {
                            checkedCount++;
                            const imageValidation = await validateImage(child.img);
                            
                            if (imageValidation.isValid) {
                                validatedResults.push({
                                    ...child,
                                    imageValidation
                                });
                                ++validImageCounter;
                            } else {
                                ++notValidImageCounter;
                                console.log(`Image validation failed for ${child.img}:`, 
                                    imageValidation, 'counter:', notValidImageCounter);
                            }

                            // Stop searching if we found 2 valid images
                            if (validatedResults.length === 2) {
                                break;
                            }

                            // If we haven't found 2 valid images after checking 5,
                            // continue up to 15 if needed
                            if (checkedCount === 5 && validatedResults.length < 2) {
                                if (i >= 14) { // Already checked 15 items
                                    break;
                                }
                            }
                        }
                    }

                    // Update group.children with validated results if we found exactly 2 valid images
                    if (validatedResults.length === 2) {
                        group.children = validatedResults;
                    } else {
                        // Log if we couldn't find exactly 2 valid images
                        console.log(`Could not find exactly 2 valid images in group after checking ${checkedCount} items. Found ${validatedResults.length} valid images.`);
                        debugger
                        group.children = validatedResults;
                    }
                }
            })
        );

        return Object.values(grouped);
    };

    const hierarchy = await buildHierarchy(arr);
    console.log('validImageCounter', validImageCounter);
    console.log('notValidImageCounter', notValidImageCounter);
    return { hierarchy };
}