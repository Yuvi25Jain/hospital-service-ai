const express = require("express");
const cors = require("cors");
const compareHospitals = require("./services/comparisonEngine");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Load JSON data
const services = require("../data/services.json");
const hospitals = require("../data/hospitals.json");
const hospitalServices = require("../data/hospital_services.json");

// Test route
app.get("/", (req, res) => {
  res.send("Backend server running");
});

// API routes
app.get("/services", (req, res) => {
  res.json(services);
});

app.get("/hospitals", (req, res) => {
  res.json(hospitals);
});

app.get("/hospital-services", (req, res) => {
  res.json(hospitalServices);
});

app.get("/compare", (req, res) => {

    const service = req.query.service;
    const priority = req.query.priority;

    // Validation check
    if (!service || !priority) {
        return res.status(400).json({
            error: "service and priority are required"
        });
    }

    const result = compareHospitals(service, priority);

    // No results found
    if (result.length === 0) {
        return res.status(404).json({
            error: "No matching hospitals found"
        });
    }

    res.json(result);
});


// Server start
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
