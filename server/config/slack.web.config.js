const { WebClient } = require('@slack/web-api');

// Read a token from the environment variables
const token = 'xoxb-1519091841045-1629098860436-R0a1V8ZocbhpL6bx6oom6Bh1';

// Initialize
const web = new WebClient(token);

exports.web = web;