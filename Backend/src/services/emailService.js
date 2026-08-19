const nodemailer = require ('nodemailer');
require ('dotenv').config();


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

 const sendOTPEmail = async (email, otp, userName, purpose = 'verification') => {
  try {
    let subject, htmlContent;

    if (purpose === 'verification') {
      subject = 'Email Verification - Resume Optimizer';
      htmlContent = `
        <h2>Email Verification</h2>
        <p>Hi ${userName},</p>
        <p>Your OTP for email verification is:</p>
        <h3 style="color: #007bff;">${otp}</h3>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `;
    } else if (purpose === 'password-reset') {
      subject = 'Password Reset - Resume Optimizer';
      htmlContent = `
        <h2>Password Reset Request</h2>
        <p>Hi ${userName},</p>
        <p>Your OTP for password reset is:</p>
        <h3 style="color: #007bff;">${otp}</h3>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `;
    } else if (purpose === 'login') {
      subject = 'Login OTP - Resume Optimizer';
      htmlContent = `
    <h2>Login Verification</h2>
    <p>Hi ${userName},</p>
    <p>Your OTP to log in is:</p>
    <h3 style="color: #007bff;">${otp}</h3>
    <p>This OTP will expire in 5 minutes.</p>
  `;
    }

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
    const htmlContent = `
      <h2>Welcome to Resume Optimizer!</h2>
      <p>Hi ${userName},</p>
      <p>Thank you for joining us. You can now:</p>
      <ul>
        <li>Upload and optimize your resume</li>
        <li>Analyze job descriptions</li>
        <li>Get AI-powered recommendations</li>
      </ul>
      <p>Get started now: <a href="${process.env.FRONTEND_URL}">Click here</a></p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to Resume Optimizer',
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
    const htmlContent = `
      <h2>Password Changed</h2>
      <p>Hi ${userName},</p>
      <p>Your password has been successfully changed.</p>
      <p>If you did not make this change, please contact support immediately.</p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Changed - Resume Optimizer',
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