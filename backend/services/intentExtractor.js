function extractIntent(message) {

    if (!message) return null;

    const text = message.toLowerCase();

    let service = null;
    let priorities = [];

    // Detect service
    

if (text.includes("mri")) {
    service = "MRI Scan";
}

if (text.includes("xray") || text.includes("x-ray")) {
    service = "X-Ray";
}

if (text.includes("blood")) {
    service = "Blood Test";
}

if (text.includes("ct")) {
    service = "CT Scan";
}

if (text.includes("general") || text.includes("checkup")) {
    service = "General Checkup";
}


    // Detect multiple priorities
    if (/cheap|lowest|budget|affordable/.test(text)) {
        priorities.push("low_price");
    }

    if (/fast|quick|urgent/.test(text)) {
        priorities.push("fast_report");
    }

    if (/best|top|rating/.test(text)) {
        priorities.push("high_rating");
    }

    return {
        service,
        priorities
    };
}

module.exports = extractIntent;
