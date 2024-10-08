import fs from 'fs'

const data = JSON.parse(fs.readFileSync(`${process.cwd()}/data/nav/giyim.json`, { encoding: 'utf-8' }))
debugger



debugger

// Function to generate a unique ID

function generateUID() {
    return Math.random().toString(36).substr(2, 9);
}

// Function to add UIDs to nodes at a specific depth
function addUIDToNodes(node, depth = 0) {
    if (node.children && depth === 2) {
        node.uid = generateUID();  // Add UID at level 2
    }
    if (node.children) {
        node.children.forEach(child => addUIDToNodes(child, depth + 1));  // Recursively process children
    }
}

// Function to split JSON data into navigation and references
function splitJSONData(tree, navigation = [], references = []) {
    tree.forEach(node => {
        // Create a shallow copy for the navigation item
        let navItem = {
            title: node.title,
            uid: node.uid || null
        };
        
        if (node.children) {
            navItem.children = [];
            splitJSONData(node.children, navItem.children, references);  // Recursively process children
        }

        // Add to navigation
        navigation.push(navItem);

        // Add to reference if the node has a UID
        if (node.uid) {
            references.push({
                uid: node.uid,
                details: node  // Store all details under this UID
            });
        }
    });
    return { navigation, references };
}

// Sample input data
const inputData = [
    {
        "title": "kadın",
        "children": [
            {
                "title": "üst giyim",
                "children": [
                    {
                        "title": "gömlek",
                        "children": [
                            {
                                "title": "www.adl.com.tr",
                                "children": [
                                    {
                                        "_id": "66f7feab1b2ee904f045105e",
                                        "image": [
                                            "https://example.com/image1.jpg"
                                        ],
                                        "title": "Çizgili Lacivert Erkek Yaka Çizgili Gömlek",
                                        "price": "1799.95",
                                        "link": "https://example.com/product1",
                                        "currency": "TL"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

// Step 1: Add UIDs to nodes at level 2
data.forEach(node => addUIDToNodes(node));

// Step 2: Split the data into navigation and reference
const result = splitJSONData(data);
debugger
// Output the result
console.log("Navigation:", JSON.stringify(result.navigation, null, 4));
console.log("References:", JSON.stringify(result.references, null, 4));
