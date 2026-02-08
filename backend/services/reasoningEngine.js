function generateReasoning(results, intent) {

    if (!results || results.length === 0) {
        return [];
    }

    const best = results[0];

    let reasons = [];

    // Compare against others
    const prices = results.map(r => r.price);
    const times = results.map(r => r.report_time_hours);
    const ratings = results.map(r => r.rating);

    if (intent.priorities.includes("low_price")) {
        if (best.price === Math.min(...prices)) {
            reasons.push("offers the lowest price");
        }
    }

    if (intent.priorities.includes("fast_report")) {
        if (best.report_time_hours === Math.min(...times)) {
            reasons.push("provides fastest report time");
        }
    }

    if (intent.priorities.includes("high_rating")) {
        if (best.rating === Math.max(...ratings)) {
            reasons.push("has highest patient rating");
        }
    }

    return reasons;
}

module.exports = generateReasoning;
