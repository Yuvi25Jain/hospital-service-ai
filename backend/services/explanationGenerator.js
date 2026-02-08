function generateExplanation(results, intent) {

    if (!results || results.length === 0) {
        return "No suitable hospitals found.";
    }

    const best = results[0];

    let reasons = [];

    if (intent.priorities.includes("low_price")) {
        reasons.push("affordable pricing");
    }

    if (intent.priorities.includes("fast_report")) {
        reasons.push("fast report delivery");
    }

    if (intent.priorities.includes("high_rating")) {
        reasons.push("high patient ratings");
    }

    const reasonText = reasons.join(" and ");

    return `Based on your request for ${reasonText} in ${intent.service}, ${best.hospital} is recommended as the best option.`;
}



module.exports = generateExplanation;
