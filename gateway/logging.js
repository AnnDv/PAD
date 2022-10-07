const express = require('express');
const morgan = require('morgan');

const setupLogging = (app) => {
    app.use(morgan('combined'));
}

exports.setupLogging = setupLogging;