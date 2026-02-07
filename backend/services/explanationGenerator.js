function generateExplanation(results, intent) {

    if (!results || results.length === 0) {
        return "No suitable hospitals found.";
    }

    const best = results[0];

    let reason = "";

    if (intent.priority === "low_price") {
        reason = "offers the lowest price";
    }

    if (intent.priority === "fast_report") {
        reason = "provides the fastest report time";
    }

    if (intent.priority === "high_rating") {
        reason = "has the highest rating";
    }

    return `${best.hospital} is recommended because it ${reason} for ${intent.service}.`;
}

module.exports = generateExplanation;
