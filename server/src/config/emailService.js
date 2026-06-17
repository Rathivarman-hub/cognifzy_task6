import { google } from 'googleapis';

/**
 * Gmail API OAuth2 Email Service
 *
 * Setup Steps:
 * 1. Go to https://console.cloud.google.com/ and create a new project.
 * 2. Enable "Gmail API" from APIs & Services > Library.
 * 3. Go to APIs & Services > Credentials > Create Credentials > OAuth Client ID.
 *    - Application type: Web application
 *    - Add Authorized redirect URI: https://developers.google.com/oauthplayground
 * 4. Copy Client ID and Client Secret into your .env file.
 * 5. Go to https://developers.google.com/oauthplayground
 *    - Click the gear icon ⚙️ (top right) → check "Use your own OAuth credentials"
 *    - Paste your Client ID and Client Secret.
 *    - In Step 1, select scope: https://mail.google.com/
 *    - Click "Authorize APIs" → sign in with your Gmail account.
 *    - Click "Exchange authorization code for tokens".
 *    - Copy the Refresh Token into your .env file.
 * 6. Set GMAIL_SENDER_EMAIL in .env to the Gmail address you authorized.
 */

const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

/**
 * Sends an email using the Gmail API with OAuth2 authentication.
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML email body
 */
export const sendEmail = async ({ to, subject, html }) => {
  // Get a fresh access token using the refresh token
  const { token: accessToken } = await oAuth2Client.getAccessToken();

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  const senderEmail = process.env.GMAIL_SENDER_EMAIL;
  const senderName = process.env.GMAIL_SENDER_NAME || 'Auth App';

  // Build RFC 2822 email message
  const emailLines = [
    `From: "${senderName}" <${senderEmail}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=UTF-8`,
    ``,
    html,
  ];

  const rawMessage = emailLines.join('\n');

  // Gmail API requires base64url-encoded message
  const encodedMessage = Buffer.from(rawMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: encodedMessage },
  });
};
