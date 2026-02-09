const express = require("express");
const cors = require("cors");
const compareHospitals = require("./services/comparisonEngine");
const extractIntent = require("./services/intentExtractor");
const generateExplanation = require("./services/explanationGenerator");
const generateReasoning = require("./services/reasoningEngine");
const generateBookingOptions = require("./services/bookingGenerator");



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

app.post("/agent", (req, res) => {

    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({
            error: "message is required"
        });
    }

    const intent = extractIntent(userMessage);
    // Follow-up logic

// Case 1: no service detected
if (!intent.service) {
    return res.json({
        reply: "Which service are you looking for? Example: MRI, Blood Test, CT Scan.",
        suggestions: []
    });
}

// Case 2: service detected but no priorities
if (intent.priorities.length === 0) {
    return res.json({
        reply: `You selected ${intent.service}. What matters more — lowest price, fastest report, or highest rating?`,
        suggestions: []
    });
}

    console.log(intent);

if (!intent || !intent.service || !intent.priorities) {
   return res.json({
       reply: "I'm not sure what you need yet. Try asking something like:\n- cheap MRI\n- fast blood test\n- best rated CT scan",
       suggestions: []
   });
}


    const result = compareHospitals(intent.service, intent.priorities);

    const explanation = generateExplanation(result, intent);
    const reasoning = generateReasoning(result, intent);
    const bookingOptions = generateBookingOptions(result);



res.json({
    reply: explanation,
    reasoning: reasoning,
    suggestions: result,
    bookingOptions: bookingOptions,
    detectedIntent: intent
});

});




// Server start
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
