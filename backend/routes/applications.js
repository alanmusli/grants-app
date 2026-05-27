const express = require('express');
const router = express.Router();

// 🚀 Our temporary "Database" for the prototype
let mockApplications = [];

// GET all applications
router.get('/', (req, res) => {
    res.json(mockApplications);
});

// NEW: GET a single application by ID
router.get('/:id', (req, res) => {
    // Find the application where the ID matches the one in the URL
    const app = mockApplications.find(a => a.id.toString() === req.params.id);
    if (app) {
        res.json(app);
    } else {
        res.status(404).json({ error: "Апликацијата не е пронајдена" });
    }
});

// POST new application
router.post('/', (req, res) => {
    const { conferenceName, paperTitle, destination, travelDate, estimatedCosts } = req.body;
    const newApplication = {
        id: Date.now(), 
        status: 'во разгледување',
        createdAt: new Date().toISOString(),
        conference: { name: conferenceName },
        paper: { title: paperTitle },
        destination: destination,
        travelDate: travelDate,
        estimatedCosts: estimatedCosts,
        applicant: req.session?.user?.casUsername || 'demo_научник'
    };
    mockApplications.unshift(newApplication);
    res.status(201).json({ message: "Успешно зачувано", application: newApplication });
});

// NEW: PUT update application status (Approve/Reject)
router.put('/status', (req, res) => {
    const { applicationId, status, justification } = req.body;
    const appIndex = mockApplications.findIndex(a => a.id.toString() === applicationId.toString());
    
    if (appIndex !== -1) {
        mockApplications[appIndex].status = status;
        mockApplications[appIndex].justification = justification || '';
        res.json({ message: "Статусот е ажуриран", application: mockApplications[appIndex] });
    } else {
        res.status(404).json({ error: "Апликацијата не е пронајдена" });
    }
});

module.exports = router;