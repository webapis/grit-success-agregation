import fs from 'fs';
import { makeDirectory } from 'make-dir';

import ImageValidator from '../ImageValidator.js';

const data = JSON.parse(fs.readFileSync(`${process.cwd()}/data/3.2.step-data/validation.json`, { encoding: 'utf-8' }));
console.log('Before Price Map', data.length);

// Create an instance of ImageValidator
const imageValidator = new ImageValidator({ maxConcurrent: 5 }); // Adjust options as needed

// Initialize counters for valid and invalid entries
let validCount = 0;
let invalidCount = 0;

const validatedData = await Promise.all(data.map(async (m) => {
    try {
        // Validate the image URL
        const validationResult = await imageValidator.validateImage(m.img); // Assuming 'img' is the field with the URL

        // Increment counters based on validation result
        if (validationResult.valid) {
            validCount++;
            console.log(`Valid Entry: ${validCount}`); // Log valid entry details if needed
        } else {
            invalidCount++;
            console.log(`Invalid Entry: ${invalidCount}`); // Log invalid entry details if needed
        }

        return {
            ...m,
            priceString: m.price,
            imageValid: validationResult.valid, // Add validation result to the mapped object
            // validationError: validationResult.error || null // Capture any error if validation fails
        };
    } catch (error) {
        console.error(`Error validating entry ${JSON.stringify(m)}:`, error);
        invalidCount++; // Count as invalid if there's an error
        return {
            ...m,
            priceString: m.price,
            imageValid: false, // Mark as invalid due to error
            // validationError: error.message || null // Capture the error message if needed
        };
    }
}));

console.log('After Price Map', validatedData.length);
console.log(`Total Valid Entries: ${validCount}`);
console.log(`Total Invalid Entries: ${invalidCount}`);

await makeDirectory('data/3.3.step-data');
fs.writeFileSync('data/3.3.step-data/withValidImageUrl.json', JSON.stringify(validatedData));