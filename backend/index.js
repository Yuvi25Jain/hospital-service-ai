const express = require("express");
const cors = require("cors");

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

// Server start
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
