
const data = [
    {
        "üst giyim": [
            [
                "elbise",
                "elibise",
                "ebise",
                "Elbise",
                "ELBİSE",
                "DRESS",
                "Valencia Black"
            ],
            [
                "pardesü"
            ],
            [
                "tişört",
                "tshirt",
                "tişört",
                "tsihrt",
                "t-Shirt",
                "TSHİRT",
                "TİŞÖRT",
                "Kısa Kol Basic",
                "T-Shirt",
                "Ecru"
            ],
            // Other categories and keywords
        ],
        // Other parent nodes and their subcategories
    }
];
export default function getParentNodeName(keyword, data) {
    try {
        for (const parentNode of data) {
            for (const parentNodeName in parentNode) {
                const subcategories = parentNode[parentNodeName];
                for (const subcategory of subcategories) {
                    if (Array.isArray(subcategory)) {
                   
                        if (subcategory.map(m=>m.toLowerCase()).includes(keyword.toLowerCase())) {
                            return { parentNodeName, subcategory };
                        }
                    } else {
                        if (subcategory.toLowerCase() === keyword.toLowerCase()) {
                          
                            return { parentNodeName, subcategory };
                        }
                    }
                }
            }
        }
    } catch (error) {
        debugger
        throw error
    }


    return null; // Return null if keyword is not found
}
