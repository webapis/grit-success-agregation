import { promises as fs } from 'fs';
import path from 'path';

/**
 * Get all folder names within a directory
 * @param {string} directoryPath - Path to the directory
 * @param {Object} options - Optional configuration
 * @param {boolean} options.fullPath - Whether to return full paths (default: false)
 * @param {boolean} options.recursive - Whether to search recursively (default: false)
 * @returns {Promise<string[]>} Array of folder names or paths
 */
const getFolderNames = async (directoryPath, options = {}) => {
  const { fullPath = false, recursive = false } = options;
  
  try {
    const basePath = path.resolve(process.cwd(), directoryPath);
    const folders = [];

    // Recursive helper function
    async function processDirectory(currentPath) {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const folderPath = path.join(currentPath, entry.name);
          folders.push(fullPath ? folderPath : entry.name);
          
          if (recursive) {
            await processDirectory(folderPath);
          }
        }
      }
    }

    await processDirectory(basePath);
    return folders;
  } catch (error) {
    console.error('Error reading directory:', error);
    throw error;
  }
};

/**
 * Get detailed information about folders within a directory
 * @param {string} directoryPath - Path to the directory
 * @returns {Promise<Object[]>} Array of folder information objects
 */
const getFolderDetails = async (directoryPath) => {
  try {
    const basePath = path.resolve(process.cwd(), directoryPath);
    const entries = await fs.readdir(basePath, { withFileTypes: true });
    const folderDetails = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const folderPath = path.join(basePath, entry.name);
        const stats = await fs.stat(folderPath);

        folderDetails.push({
          name: entry.name,
          path: folderPath,
          created: stats.birthtime,
          modified: stats.mtime,
          accessed: stats.atime,
          size: stats.size
        });
      }
    }

    return folderDetails;
  } catch (error) {
    console.error('Error getting folder details:', error);
    throw error;
  }
};

export { getFolderNames, getFolderDetails };