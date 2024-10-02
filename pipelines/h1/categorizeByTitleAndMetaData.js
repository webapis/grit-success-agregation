import metaData from '../../meta-data/h1.js'; // Assuming h1 is still needed for the pipeline logic



function pipeline({ giyim, yasam, taki, kozmetik,h }) {
    // Create the pipeline and export it
    const h1 = metaData({ giyim, yasam, taki, kozmetik })
    // Build $switch conditions dynamically using h1 keywords from external file
    const keywordConditions = Object.keys(h1).map(group => ({
        case: {
            $or: h1[group].map(keyword => {
                console.log('group', group)
                // Use $regexMatch with 'i' option to handle case-insensitive matches
                return {
                    $regexMatch: { input: "$title", regex: keyword.trim(), options: "i" }
                };
            })
        },
        then: group
    }));

    // Define the pipeline array
    const stage =
    {
        $addFields: {
            // Stage 1: Add a new field 'h1' using $switch
            [h]: {
                $switch: {
                    branches: keywordConditions,
                    default: "unknown"
                }
            },
        }
    }

    return stage
}

export default pipeline

/*
1.i need to create mongodb aggregation pipeline stage
2. mongodb runs on nodejs environment
3.array of  javascript objects will pass though this stage.
4. stage checks first condition that should be met in order to perform operation on next condition
5. first condition is "h2": "unknown" should be true
6. if first condition is true perform next operation if second condition met otherwise allow passage of this object intact to next stage on line
7.if second condition is met perform following operation:
-categorizes documents based on matching keywords. 
    1. Importing the Keywords:
        import h1 from '../../meta-data/h1.js';
        The code imports an external file (h1.js), which contains keyword groups. These keywords are used later to build dynamic conditions. Each keyword group likely represents some kind of classification or label.


        3.sample of the object is:
[
  {
    "_id": "66f7feab1b2ee904f045c0dd",
    "title": "Büzgü Detaylı Bikini Üstü",
    "price": "899.95",
    "link": "https://www.yargici.com/p/cok-renkli-buzgu-detayli-bikini-ustu-24ykbw1511x575",
    "pageTitle": "Bikini & Mayo",
    "currency": "TL",
    "pageUrl": "https://www.yargici.com/yeni-sezon-bikini-mayo",
    "h1": "giyim",
    "h2": "unknown"
  },...
]
4.we need to work on field "h2" if its value is "unknown" otherwise it should be skipped to the next stage;
5.this stage check if "pageUrl"  contains "https://www.yargici.com"(dynamic condition)   and "title" contains "Bikini"(array of dynamic conditions)  if so "h2" s value should to set to "Kadın".
6. sample dynamic condition:
let dynamicConditions = {
    kadın: [
        { pageUrl:"https://www.yargici.com",title:["Bikini","Mayo"] }
    ],
    erkek: [
        { pageUrl:"https://www.avva.com",title:["Boxer","Bere"] }
    ]
};

7. this code will run on node js env and dynamicConditions will be loaded from a json file
*/
