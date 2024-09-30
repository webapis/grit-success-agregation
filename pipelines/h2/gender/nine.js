let genderValues = {
    erkek: ["https://www.baysapkaci.com.tr/sal-sapka-takim"],
    kadın: ["https://www.baysapkaci.com.tr/plaj-cantasi",
        "https://silkandcashmere.com/collections/sac-aksesuarlari",
        "https://silkandcashmere.com/collections/bere",
        "https://silkandcashmere.com/collections/aksesuar-yeni-gelenler",
        "https://www.baysapkaci.com.tr/tumu-c-0",
        "https://www.dahliabianca.com/yeni-gelenler-2",
        "https://www.dahliabianca.com/indirim",
        "https://www.yargici.com/beachworks-mayo-bikini",
        "https://www.yargici.com/beachworks-plaj-elbisesi",
        "https://www.yargici.com/beachworks-gomlek-bluz",
        "https://www.yargici.com/beachworks-sort-pantolon",
        "https://www.yargici.com/beachworks-plaj-cantasi",
        "https://www.yargici.com/beachworks-sapka",
        "https://www.yargici.com/beachworks-gunes-gozlugu-ipi",
        "https://www.yargici.com/beachworks-kolye",
        "https://www.yargici.com/beachworks-kupe"

    ]
};

let stage =
{
    $set: {
        h2: {
            $cond: [
                { $and: [{ $eq: ["$h2", "unknown"] }, { $in: ["$pageUrl", genderValues.erkek] }] },
                "erkek",
                {
                    $cond: [
                        { $and: [{ $eq: ["$h2", "unknown"] }, { $in: ["$pageUrl", genderValues.kadın] }] },
                        "kadın",
                        "$h2" // Default to original value if no match
                    ]
                }
            ]
        }
    }
}

export default stage


