import fs from 'fs';
import path from 'path';

function getJsonFilesFromDirectory(directory) {
    let jsonFiles = [];

    // Read all items in the directory
    const items = fs.readdirSync(directory);

    items.forEach(item => {
        const fullPath = path.join(directory, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            // Recursively get JSON files from subdirectories
            jsonFiles = jsonFiles.concat(getJsonFilesFromDirectory(fullPath));
        } else if (path.extname(item) === '.json') {
            // Add JSON file to the list
            jsonFiles.push(fullPath);
        }
    });

    return jsonFiles;
}

export default function mergeJsonFiles(folderPath) {
    try {
        // Get all JSON files from the directory and its subdirectories
        const jsonFiles = getJsonFilesFromDirectory(folderPath);

        let mergedData = {};

        // Read and merge each JSON file
        jsonFiles.forEach(filePath => {
            const fileData = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf-8' }));

            fileData.forEach(obj => {
                for (const key in obj) {
                    if (!mergedData[key]) {
                        mergedData[key] = obj[key]; // Add new key
                    } else {
                        mergedData[key] = mergedData[key].concat(obj[key]); // Merge arrays
                    }
                }
            });
        });

    
        // Return the merged data instead of writing to a file
        return mergedData;
    } catch (error) {
        console.error('Error merging JSON files:', error);
        return null;
    }
}

// // Usage example
// const folderPath = path.join(process.cwd(), 'meta-data');
// const mergedData = mergeJsonFiles(folderPath);
// console.log('Merged Data:', mergedData);