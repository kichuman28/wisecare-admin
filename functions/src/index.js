const functions = require('firebase-functions');
const { generateAgoraToken } = require('./agora');

// Expose the token generation endpoint
exports.generateAgoraToken = functions.https.onCall(generateAgoraToken); 