
const hostNames = {
    "kadın": [
        "https://www.adl.com.tr",
        "https://www.alfa-beta.com.tr",
        "https://arzukaprol.com",
        "https://www.ayyildiz.com.tr",
        "https://www.barrusglobal.com",
        "https://www.batikmoda.com",
        "https://berr-in.com",
        "https://www.bsl.com.tr",
        "https://biancoenero.com.tr",
        "https://www.birelin.com",
        "https://clothing.beautyomelette.com",
        "https://cosmetics.beautyomelette.com",
        "https://joinus.com.tr",
        "https://jusdepommes.com",
        "https://www.shopseizetheday.com",
        "https://www.sorbe.co",
        "https://www.themolc.com",
        "https://www.tubaergin.com",
        "https://www.twist.com.tr",
        "https://www.victoriassecret",
        "https://www.atolyeno6.com.tr",
        "https://www.rueonline.com",
        "https://www.setre.com",
        "https://www.sherin.com.tr",
        "https://www.nocturne.com.tr",
        "https://rivus.com.tr",
        "https://diproject.co",
        "https://www.ekolonline.com",
        "https://www.fever.com.tr",
        "https://gustoeshop.com",
        "https://ihandmore.com",
        "https://www.ipekyol.com.tr",
        "https://kasha.com.tr",
        "https://en.love-onfriday.com",
        "https://lovemetoo.com.tr",
        "https://www.lovemybody.com.tr",
        "https://www.machka.com.tr",
        "https://www.modalogy.com.tr",
        "https://www.muun.com.tr",
        "https://www.naarstore.com",
        "https://www.naramaxx.com",
        "https://nihanpeker.com",
        "https://www.nisalin.com",
        "https://www.nisantriko.com",
        "https://sagaza.com",
        "https://tuvanam.com",
        "https://www.wheneverco.com",
        "https://www.oxxo.com.tr",
        "https://manuatelier.com",
        "https://tr.manuatelier.com"

    ],
    "erkek": [
        "https://www.avva.com.tr",
        "https://victorbaron.com.tr",
        "https://www.altinyildizclassics.com",
        "https://www.brango.com.tr",
        "https://www.wemsey.com.tr"
    ],
    "unisex": ["https://eclecticconceptstore.com.tr"]

}
// Load regex patterns from JSON file


const buildPipeline = (patterns) => {
    let conditions = [];

    // Loop through each gender (kadın, erkek, unisex, etc.)
    for (const [gender, regexArray] of Object.entries(patterns)) {
        regexArray.forEach(regex => {
            conditions.push({
                "case": { "$regexMatch": { "input": "$link", "regex": regex } },  // Use "case" instead of "if"
                "then": gender
            });
        });
    }

    // Add a default case when none of the regex patterns match
    conditions.push({
        "case": true,  // Default case
        "then": null
    });

    return {
        "$addFields": {
            "h2": {
                "$switch": {
                    "branches": conditions
                }
            }
        }
    };
};

const pipeline = buildPipeline(hostNames);

export default pipeline;
