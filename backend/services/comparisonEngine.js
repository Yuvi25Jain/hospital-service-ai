const services = require("../../data/services.json");
const hospitals = require("../../data/hospitals.json");
const hospitalServices = require("../../data/hospital_services.json");

function compareHospitals(serviceName, priority) {

    // find service id
    const service = services.find(s => s.name === serviceName);

    if (!service) {
        return [];
    }

    // find hospitals offering that service
    let results = hospitalServices
        .filter(hs => hs.service_id === service.id)
        .map(hs => {
            const hospital = hospitals.find(h => h.id === hs.hospital_id);

            return {
                hospital: hospital.name,
                price: hs.price,
                report_time_hours: hs.report_time_hours,
                rating: hospital.rating
            };
        });

    // ranking logic
    if (priority === "low_price") {
        results.sort((a, b) => a.price - b.price);
    }

    if (priority === "fast_report") {
        results.sort((a, b) => a.report_time_hours - b.report_time_hours);
    }

    if (priority === "high_rating") {
        results.sort((a, b) => b.rating - a.rating);
    }

    return results;
}

module.exports = compareHospitals;
