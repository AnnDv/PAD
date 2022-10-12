const express = require('express');
const morgan = require('morgan');

// add logging information about incoming requests
const setupLogging = (app) => {
    app.use(morgan('combined'));
}

exports.setupLogging = setupLogging;