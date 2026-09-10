const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Shared layout wrapper matching Kaizen UI styling (without logo image)
const wrapEmailTemplate = (innerContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kaizen AI</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F9FC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8F9FC; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 540px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); overflow: hidden; text-align: left;" cellspacing="0" cellpadding="0">
          
          <!-- Header / Brand Section -->
          <tr>
            <td style="padding: 32px 36px 20px 36px;">
              <div>
                <span style="font-size: 20px; font-weight: 700; color: #0F172A; line-height: 1.1;">
                  Kaizen
                </span>
                <span style="display: inline-block; font-size: 10px; font-weight: 700; background-color: #EEF2FF; color: #4F46E5; padding: 2px 7px; border-radius: 999px; margin-left: 4px; vertical-align: middle;">
                  AI
                </span>
              </div>
              <div style="font-size: 10px; font-weight: 600; letter-spacing: 0.12em; color: #94A3B8; text-transform: uppercase; margin-top: 3px;">
                Resume Optimizer
              </div>
            </td>
          </tr>

          <!-- Dynamic Body Content -->
          <tr>
            <td style="padding: 0 36px 36px 36px;">
              ${innerContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAFC; border-top: 1px solid #F1F5F9; padding: 20px 36px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94A3B8; line-height: 1.5;">
                &copy; ${new Date().getFullYear()} Kaizen AI Resume Optimizer. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const sendOTPEmail = async (email, otp, userName, purpose = 'verification') => {
  try {
    let subject, badgeText, title, description;

    if (purpose === 'verification') {
      subject = 'Verify Your Email - Kaizen AI';
      badgeText = 'Email Verification';
      title = 'Verify your email address';
      description = 'Use the code below to complete your email verification and unlock full access to Kaizen AI.';
    } else if (purpose === 'password-reset') {
      subject = 'Password Reset Request - Kaizen AI';
      badgeText = 'Security Notice';
      title = 'Reset your password';
      description = 'We received a request to reset your password. Use this code to proceed with creating a new one.';
    } else if (purpose === 'login') {
      subject = 'Your Login Code - Kaizen AI';
      badgeText = 'Secure Authentication';
      title = 'Login verification code';
      description = 'Enter the one-time passcode below to securely sign in to your Kaizen account.';
    }

    const htmlContent = wrapEmailTemplate(`
      <div style="display: inline-block; background-color: #EEF2FF; border: 1px solid #E0E7FF; border-radius: 999px; padding: 4px 12px; font-size: 12px; font-weight: 600; color: #4F46E5; margin-bottom: 16px;">
        ✦ ${badgeText}
      </div>
      <h1 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 700; color: #0F172A; letter-spacing: -0.02em;">
        ${title}
      </h1>
      <p style="margin: 0 0 8px 0; font-size: 15px; line-height: 1.6; color: #475569;">
        Hi <strong>${userName}</strong>,
      </p>
      <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #64748B;">
        ${description}
      </p>

      <!-- Code Box Component -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
        <tr>
          <td align="center" style="background: linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%); border: 1.5px dashed #C7D2FE; border-radius: 12px; padding: 24px;">
            <div style="font-size: 32px; font-weight: 800; letter-spacing: 0.28em; color: #4F46E5; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">
              ${otp}
            </div>
            <div style="font-size: 12px; font-weight: 500; color: #6366F1; margin-top: 8px;">
              ⏱ Expires in 5 minutes
            </div>
          </td>
        </tr>
      </table>

      <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #94A3B8;">
        If you didn't initiate this request, you can safely ignore this email. No changes will be made to your account.
      </p>
    `);

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`${purpose} email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send email');
  }
};

const sendWelcomeEmail = async (email, userName) => {
  try {
    const htmlContent = wrapEmailTemplate(`
      <div style="display: inline-block; background-color: #EEF2FF; border: 1px solid #E0E7FF; border-radius: 999px; padding: 4px 12px; font-size: 12px; font-weight: 600; color: #4F46E5; margin-bottom: 16px;">
        ✦ Next-Gen AI Resume & ATS Engine
      </div>
      <h1 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 700; color: #0F172A; letter-spacing: -0.02em;">
        Your Resume, <span style="background: linear-gradient(90deg, #4F46E5, #9333EA); -webkit-background-clip: text; -webkit-text-fill-color: #4F46E5; font-weight: 800;">Perfected by AI.</span>
      </h1>
      <p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.6; color: #475569;">
        Hi <strong>${userName}</strong>, welcome to Kaizen!
      </p>
      <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #64748B;">
        Stop submitting applications into the black hole. Kaizen benchmarks your resume against real job listings and rewrites bullet points to match ATS algorithms in seconds.
      </p>

      <!-- Checklist Feature Box -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px 20px; margin-bottom: 28px;">
        <tr>
          <td>
            <div style="font-size: 13px; font-weight: 600; color: #059669; padding: 4px 0;">
              ✔ Upload and automatically score your resume
            </div>
            <div style="font-size: 13px; font-weight: 600; color: #059669; padding: 4px 0;">
              ✔ Benchmark against real ATS hiring algorithms
            </div>
            <div style="font-size: 13px; font-weight: 600; color: #059669; padding: 4px 0;">
              ✔ High-impact bullet point rewrites in seconds
            </div>
          </td>
        </tr>
      </table>

      <!-- Primary Action CTA Button -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center">
            <a href="${process.env.FRONTEND_URL}" target="_blank" style="display: inline-block; background-color: #4F46E5; color: #FFFFFF; font-size: 14px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);">
              Get Started Free &rarr;
            </a>
          </td>
        </tr>
      </table>
    `);

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to Kaizen - Your AI Resume Optimizer',
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Welcome email error:', error);
    throw new Error('Failed to send welcome email');
  }
};

const sendPasswordChangedEmail = async (email, userName) => {
  try {
    const htmlContent = wrapEmailTemplate(`
      <div style="display: inline-block; background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 999px; padding: 4px 12px; font-size: 12px; font-weight: 600; color: #059669; margin-bottom: 16px;">
        ✔ Security Update
      </div>
      <h1 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 700; color: #0F172A; letter-spacing: -0.02em;">
        Password Changed Successfully
      </h1>
      <p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.6; color: #475569;">
        Hi <strong>${userName}</strong>,
      </p>
      <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #64748B;">
        The password associated with your Kaizen account was recently updated. You can now use your new credentials to sign in.
      </p>

      <!-- Alert Box -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FFFBEB; border: 1px solid #FDE68A; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
        <tr>
          <td>
            <div style="font-size: 13px; color: #92400E; line-height: 1.5;">
              <strong>Didn't make this change?</strong> Please reset your password immediately or reach out to our support team to secure your account.
            </div>
          </td>
        </tr>
      </table>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center">
            <a href="${process.env.FRONTEND_URL}/login" target="_blank" style="display: inline-block; background-color: #4F46E5; color: #FFFFFF; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 8px;">
              Go to Account &rarr;
            </a>
          </td>
        </tr>
      </table>
    `);

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Changed - Kaizen AI',
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Password changed email error:', error);
    throw new Error('Failed to send password changed email');
  }
};

module.exports = { sendOTPEmail, sendWelcomeEmail, sendPasswordChangedEmail };