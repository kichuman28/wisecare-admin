const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

// Get environment variables
const appId = process.env.AGORA_APP_ID;
const appCertificate = process.env.AGORA_APP_CERTIFICATE;

// Token expiration time in seconds
const expirationTimeInSeconds = 3600; // 1 hour

exports.generateAgoraToken = async (req, res) => {
  try {
    const { channelName, uid } = req.body;

    if (!channelName || !uid) {
      return res.status(400).json({ error: 'Channel name and UID are required' });
    }

    if (!appId || !appCertificate) {
      return res.status(500).json({ error: 'Agora credentials not configured' });
    }

    // Calculate privilege expire time
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTimestamp + expirationTimeInSeconds;

    // Build token with uid
    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      RtcRole.PUBLISHER,
      privilegeExpireTime
    );

    return res.json({
      token,
      expiresIn: expirationTimeInSeconds
    });
  } catch (error) {
    console.error('Error generating Agora token:', error);
    return res.status(500).json({ error: 'Failed to generate token' });
  }
}; 