function generateBookingOptions(results) {

    if (!results || results.length === 0) {
        return [];
    }

    // Offer booking for top 2 hospitals
    return results.slice(0,2).map(r => ({
        hospital: r.hospital,
        phone: r.phone,
        booking_link: r.booking_link
    }));
}

module.exports = generateBookingOptions;
