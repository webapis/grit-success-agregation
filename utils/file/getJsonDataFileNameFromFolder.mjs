import { promises as fs } from 'fs';
import path from 'path';

const getJsonDataFileNameFromFolder = async (folderPath) => {
  try {
    const fdPath = `${process.cwd()}/${folderPath}`;
    // Read the contents of the directory
    const files = await fs.readdir(fdPath);

    // Filter for JSON files
    const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');

    // Read and parse each JSON file, returning both filename (without extension) and data
    const jsonData = await Promise.all(jsonFiles.map(async file => {
      const filePath = path.join(fdPath, file);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const parsedJSONData = JSON.parse(fileContent);

      if (parsedJSONData.length > 0) {
        // Return filename without the .json extension
        return { filename: path.basename(file, '.json'), data: parsedJSONData };
      } else {
        throw `Data from ${filePath} path is empty`;
      }
    }));

    return jsonData;
  } catch (error) {
    console.error('Error reading JSON files:', error);
    throw error;
  }
};

export default getJsonDataFileNameFromFolder;
