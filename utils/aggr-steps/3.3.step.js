//image url validation
import fs from 'fs';
import { makeDirectory } from 'make-dir';

import ImageValidator from '../ImageValidator.js';

const data = JSON.parse(fs.readFileSync(`${process.cwd()}/data/3.2.step-data/validation.json`, { encoding: 'utf-8' }));
console.log('Before Price Map', data.length);

// Create an instance of ImageValidator
const imageValidator = new ImageValidator({ maxConcurrent: 5 }); // Adjust options as needed

const validatedData = await Promise.all(data.map(async (m) => {
    try {
            // Validate the image URL

    const validationResult = await imageValidator.validateImage(m.img); // Assuming 'imageUrl' is the field with the URL
debugger
    return {
        ...m,
        priceString: m.price,
        imageValid: validationResult.valid, // Add validation result to the mapped object
        validationError: validationResult.error || null // Capture any error if validation fails
    };
    } catch (error) {
        throw error
        debugger
    }

}));

console.log('After Price Map', validatedData.length);
await makeDirectory('data/3.3.step-data');
fs.writeFileSync('data/3.3.step-data/withValidImageUrl.json', JSON.stringify(validatedData));