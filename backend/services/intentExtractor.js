function extractIntent(message) {

    if (!message) return null;

    const text = message.toLowerCase();

    let service = null;
    let priority = null;

    // Service detection
    const serviceMap = {
        "mri": "MRI Scan",
        "xray": "X-Ray",
        "x-ray": "X-Ray",
        "blood": "Blood Test",
        "ct": "CT Scan"
    };

    for (const key in serviceMap) {
        if (text.includes(key)) {
            service = serviceMap[key];
            break;
        }
    }

    // Priority detection
    if (/cheap|lowest|budget|affordable/.test(text)) {
        priority = "low_price";
    }

    if (/fast|quick|urgent/.test(text)) {
        priority = "fast_report";
    }

    if (/best|top|rating/.test(text)) {
        priority = "high_rating";
    }

    return { service, priority };
}

module.exports = extractIntent;
