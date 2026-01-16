const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  // Check if using SendGrid
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  }
  
  // Use SMTP (Gmail, Mailtrap, etc.)
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'PropertyHub <noreply@propertyhub.com>',
      to: user.email,
      subject: 'Password Reset Request - PropertyHub',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏠 PropertyHub</h1>
              <p>Password Reset Request</p>
            </div>
            <div class="content">
              <h2>Hello ${user.fullName},</h2>
              <p>We received a request to reset your password for your PropertyHub account.</p>
              <p>Click the button below to reset your password:</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul>
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>Your password will remain unchanged</li>
                </ul>
              </div>
              <p>Best regards,<br>The PropertyHub Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>&copy; ${new Date().getFullYear()} PropertyHub. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hello ${user.fullName},

We received a request to reset your password for your PropertyHub account.

To reset your password, please visit the following link:
${resetUrl}

This link will expire in 1 hour.

If you didn't request this reset, please ignore this email and your password will remain unchanged.

Best regards,
The PropertyHub Team
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent to:', user.email);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

// Send welcome email (optional)
const sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'PropertyHub <noreply@propertyhub.com>',
      to: user.email,
      subject: 'Welcome to PropertyHub!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏠 Welcome to PropertyHub!</h1>
            </div>
            <div class="content">
              <h2>Hello ${user.fullName},</h2>
              <p>Thank you for joining PropertyHub! We're excited to help you manage your properties.</p>
              <p>You can now:</p>
              <ul>
                <li>📝 List your properties</li>
                <li>📊 Track rental inquiries</li>
                <li>👥 Connect with potential tenants</li>
                <li>⭐ Build your landlord reputation</li>
              </ul>
              <p style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin-dashboard" class="button">Go to Dashboard</a>
              </p>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Best regards,<br>The PropertyHub Team</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', user.email);
    return true;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    // Don't throw - welcome email failure shouldn't block registration
    return false;
  }
};

// Send newsletter welcome email
const sendNewsletterWelcomeEmail = async (email) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'PropertyHub <noreply@propertyhub.com>',
      to: email,
      subject: '🎉 Welcome to PropertyHub Newsletter!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 40px 30px; 
              text-align: center; 
              border-radius: 10px 10px 0 0; 
            }
            .content { 
              background: #f9f9f9; 
              padding: 30px; 
              border-radius: 0 0 10px 10px; 
            }
            .highlight { 
              background: #fff3cd; 
              border-left: 4px solid #ffc107; 
              padding: 15px; 
              margin: 20px 0; 
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              color: #666; 
              font-size: 12px; 
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
            }
            .unsubscribe {
              color: #999;
              text-decoration: underline;
              font-size: 11px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 32px;">🏠 PropertyHub</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px;">Welcome to Our Newsletter!</p>
            </div>
            <div class="content">
              <h2>Hello! 👋</h2>
              <p>Thank you for subscribing to PropertyHub's newsletter!</p>
              
              <div class="highlight">
                <strong>📬 What to Expect:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>🏘️ New property listings in your area</li>
                  <li>💡 Tips for finding the perfect rental</li>
                  <li>📊 Market insights and trends</li>
                  <li>🎁 Exclusive deals and promotions</li>
                  <li>📰 PropertyHub news and updates</li>
                </ul>
              </div>
              
              <p>We promise to keep your inbox clean and send only valuable content. No spam, ever!</p>
              
              <p style="text-align: center; margin-top: 30px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">
                  Browse Properties Now
                </a>
              </p>
              
              <p style="margin-top: 30px;">Best regards,<br><strong>The PropertyHub Team</strong></p>
            </div>
            <div class="footer">
              <p>You're receiving this because you subscribed to PropertyHub newsletter.</p>
              <p>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe?email=${encodeURIComponent(email)}" 
                   class="unsubscribe">
                  Unsubscribe from newsletter
                </a>
              </p>
              <p>&copy; ${new Date().getFullYear()} PropertyHub. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Welcome to PropertyHub Newsletter!

Thank you for subscribing!

What to Expect:
- New property listings in your area
- Tips for finding the perfect rental
- Market insights and trends
- Exclusive deals and promotions
- PropertyHub news and updates

We promise to keep your inbox clean and send only valuable content.

Best regards,
The PropertyHub Team

To unsubscribe: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe?email=${encodeURIComponent(email)}
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Newsletter welcome email sent to:', email);
    return true;
  } catch (error) {
    console.error('❌ Error sending newsletter email:', error);
    throw error;
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendNewsletterWelcomeEmail
};