import { google } from 'googleapis';


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
