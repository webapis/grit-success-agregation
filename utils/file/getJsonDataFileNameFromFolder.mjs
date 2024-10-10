
import { promises as fs } from 'fs';
import path from 'path';

const getJsonDataFromFolder = async (folderPath) => {
  const jsonData = [];

  const readDirectory = async (dir) => {
    const files = await fs.readdir(dir, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(dir, file.name);

      if (file.isDirectory()) {
        // Recursively read subdirectories
        await readDirectory(filePath);
      } else if (path.extname(file.name).toLowerCase() === '.json') {
        // Read and parse JSON files
        const fileContent = await fs.readFile(filePath, 'utf8');
        const parsedJSONData = JSON.parse(fileContent);

        if (parsedJSONData.length > 0) {
          jsonData.push({
            folder: path.basename(dir), // Get the folder name
            filename: path.basename(file.name, '.json'), 
            data: parsedJSONData,
          });
        } else {
          throw new Error(`Data from ${filePath} is empty`);
        }
      }
    }
  };

  try {
    await readDirectory(path.join(process.cwd(), folderPath));
    return jsonData;
  } catch (error) {
    console.error('Error reading JSON files:', error);
    throw error;
  }
};

export default getJsonDataFromFolder;
// import { promises as fs } from 'fs';
// import path from 'path';

// const getJsonDataFileNameFromFolder = async (folderPath) => {
//   try {
//     const fdPath = `${process.cwd()}/${folderPath}`;
//     // Read the contents of the directory
//     const files = await fs.readdir(fdPath);

//     // Filter for JSON files
//     const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');

//     // Read and parse each JSON file, returning both filename (without extension) and data
//     const jsonData = await Promise.all(jsonFiles.map(async file => {
//       const filePath = path.join(fdPath, file);
//       const fileContent = await fs.readFile(filePath, 'utf8');
//       const parsedJSONData = JSON.parse(fileContent);

//       if (parsedJSONData.length > 0) {
//         // Return filename without the .json extension
//         return { filename: path.basename(file, '.json'), data: parsedJSONData };
//       } else {
//         throw `Data from ${filePath} path is empty`;
//       }
//     }));

//     return jsonData;
//   } catch (error) {
//     console.error('Error reading JSON files:', error);
//     throw error;
//   }
// };

// export default getJsonDataFileNameFromFolder;
