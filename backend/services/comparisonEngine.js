const services = require("../../data/services.json");
const hospitals = require("../../data/hospitals.json");
const hospitalServices = require("../../data/hospital_services.json");

function compareHospitals(serviceName, priorities) {

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
                rating: hospital.rating,
                phone : hospital.phone,
                booking_link : hospital.booking_link

            };
        });

    // MULTI-PRIORITY ranking logic (DAY 5 upgrade)
    if (priorities && priorities.length > 0) {

        results.sort((a, b) => {

            for (let priority of priorities) {

                if (priority === "low_price") {
                    if (a.price !== b.price) {
                        return a.price - b.price;
                    }
                }

                if (priority === "fast_report") {
                    if (a.report_time_hours !== b.report_time_hours) {
                        return a.report_time_hours - b.report_time_hours;
                    }
                }

                if (priority === "high_rating") {
                    if (a.rating !== b.rating) {
                        return b.rating - a.rating;
                    }
                }
            }

            return 0;
        });
    }

    return results;
}

module.exports = compareHospitals;
