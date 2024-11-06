import fs from 'fs';
import crypto from 'crypto';
import getJsonDataFileNameFromFolder from '../file/getJsonDataFileNameFromFolder.mjs';
import { makeDirectory } from 'make-dir';

// Function to generate a deterministic UID based on node content and path
function generateStaticUID(node, parentPath = '') {
    // Create a unique string based on the node's content and position
    const contentString = `${parentPath}${node.title}`;
    
    // Use SHA-256 to create a hash, then take first 9 characters
    const hash = crypto.createHash('sha256')
        .update(contentString)
        .digest('hex')
        .substr(0, 9);
    
    return hash;
}

// Function to add UIDs to nodes at a specific depth
function addUIDToNodes(node, depth = 0, parentPath = '') {
    const currentPath = `${parentPath}/${node.title}`;
    
    if (node.children && depth === 2) {
        node.uid = generateStaticUID(node, currentPath);
    }
    
    if (node.children) {
        node.children.forEach(child => 
            addUIDToNodes(child, depth + 1, currentPath)
        );
    }
}

// Function to split JSON data into navigation and references
function splitJSONData(tree, navigation = [], references = []) {
    tree.forEach(node => {
        let navItem = {
            title: node.title,
            uid: node.uid || null,
            childrenLength: node.children ? node.children.length : 0
        };

        if (node.children && !node.uid) {
            navItem.children = [];
            splitJSONData(node.children, navItem.children, references);
        }

        navigation.push(navItem);

        if (node.uid) {
            references.push({
                uid: node.uid,
                details: node
            });
        }
    });
    return { navigation, references };
}

// Main processing function
async function processData() {
    const datas = await getJsonDataFileNameFromFolder('data/4.step-data');

    for (let d of datas) {
        const { data, filename } = d;

        // Step 1: Add UIDs to nodes at level 2
        data.forEach(node => addUIDToNodes(node));

        // Step 2: Split the data into navigation and reference
        const { navigation, references } = splitJSONData(data);

        // Step 3: Write files
        const outputDir = `${process.cwd()}/data/5.step-data/${filename}`;
        await makeDirectory(outputDir);
        
        fs.writeFileSync(
            `${outputDir}/navigation.json`, 
            JSON.stringify(navigation, null, 2)
        );
        
        fs.writeFileSync(
            `${outputDir}/references.json`, 
            JSON.stringify(references, null, 2)
        );

        console.log(`Navigation and references files for ${filename} have been created.`);
    }
}

// Execute the processing
processData().catch(console.error);