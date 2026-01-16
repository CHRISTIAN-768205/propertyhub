const nodemailer = require('nodemailer');

// Email transporter (reuse existing one or create new)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// ==================== WELCOME EMAILS ====================

// Send welcome email to new tenants
const sendTenantWelcomeEmail = async (userEmail, userName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || `PropertyHub <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: '🏠 Welcome to PropertyHub!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white !important; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #667eea; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 32px;">🎉 Welcome to PropertyHub!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Find Your Perfect Home</p>
            </div>
            
            <div class="content">
              <p>Hi <strong>${userName}</strong>,</p>
              
              <p>Welcome to <strong>PropertyHub</strong> - Kenya's most trusted property rental platform! 🏡</p>
              
              <p>We're excited to help you find your dream home. Here's what you can do:</p>
              
              <div class="feature">
                <strong>🔍 Search & Filter</strong><br>
                Find properties by location, price, amenities, and more
              </div>
              
              <div class="feature">
                <strong>❤️ Save Favorites</strong><br>
                Bookmark properties you love and compare them side-by-side
              </div>
              
              <div class="feature">
                <strong>⭐ Read Reviews</strong><br>
                See what other tenants say about properties
              </div>
              
              <div class="feature">
                <strong>📧 Instant Inquiries</strong><br>
                Contact landlords directly with one click
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">Start Browsing Properties</a>
              </div>
              
              <h3 style="color: #667eea;">💡 Pro Tips:</h3>
              <ul>
                <li>Set up your search preferences to get personalized property alerts</li>
                <li>Read property reviews before making inquiries</li>
                <li>Save multiple favorites to compare side-by-side</li>
                <li>Act fast - great properties get rented quickly!</li>
              </ul>
              
              <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;">🔔 <strong>Want Property Alerts?</strong><br>
                Set your preferences in your profile to receive notifications when new properties match your criteria!</p>
              </div>
              
              <p>Need help? Reply to this email or visit our help center.</p>
              
              <p>Happy house hunting! 🏠✨</p>
              
              <div class="footer">
                <p><strong>PropertyHub</strong></p>
                <p>Your trusted property rental platform</p>
                <p style="color: #999; font-size: 11px;">This is an automated message.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to tenant:', userEmail);
    return true;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return false;
  }
};

// Send welcome email to new landlords
const sendLandlordWelcomeEmail = async (userEmail, userName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || `PropertyHub <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: '🏢 Welcome to PropertyHub - Start Listing Your Properties!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #ef4444; color: white !important; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #ef4444; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 32px;">🏢 Welcome Aboard!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Start Renting Your Properties Today</p>
            </div>
            
            <div class="content">
              <p>Hi <strong>${userName}</strong>,</p>
              
              <p>Welcome to <strong>PropertyHub</strong> - where landlords find quality tenants fast! 🚀</p>
              
              <p>You've joined Kenya's fastest-growing property rental platform. Here's what you can do:</p>
              
              <div class="feature">
                <strong>➕ List Properties</strong><br>
                Add unlimited properties with photos and detailed descriptions
              </div>
              
              <div class="feature">
                <strong>📊 Manage Inquiries</strong><br>
                Receive and respond to rental inquiries instantly
              </div>
              
              <div class="feature">
                <strong>✅ Approve Bookings</strong><br>
                Review and approve tenant requests with one click
              </div>
              
              <div class="feature">
                <strong>⭐ Get Reviews</strong><br>
                Build your reputation with tenant reviews and ratings
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">Go to Dashboard</a>
              </div>
              
              <h3 style="color: #ef4444;">🎯 Quick Start Guide:</h3>
              <ol>
                <li><strong>Add Your First Property</strong> - Include high-quality photos and detailed descriptions</li>
                <li><strong>Set Competitive Pricing</strong> - Research similar properties in your area</li>
                <li><strong>Respond Quickly</strong> - Fast responses lead to faster rentals</li>
                <li><strong>Keep Listings Updated</strong> - Mark properties as unavailable when rented</li>
              </ol>
              
              <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;">💰 <strong>Pro Tip:</strong><br>
                Properties with 5+ photos and detailed amenities get 3x more inquiries!</p>
              </div>
              
              <p>Need help getting started? Reply to this email - we're here to help!</p>
              
              <p>Best of luck with your rentals! 🏠💼</p>
              
              <div class="footer">
                <p><strong>PropertyHub</strong></p>
                <p>Your trusted property rental platform</p>
                <p style="color: #999; font-size: 11px;">This is an automated message.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to landlord:', userEmail);
    return true;
  } catch (error) {
    console.error('❌ Error sending landlord welcome email:', error);
    return false;
  }
};

// ==================== PROPERTY ALERT EMAILS ====================

// Send property match alert to users
const sendPropertyMatchAlert = async (userEmail, userName, properties) => {
  try {
    const propertyList = properties.map(prop => `
      <div style="background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border: 1px solid #e5e7eb;">
        <h3 style="margin: 0 0 10px 0; color: #667eea;">${prop.name}</h3>
        <p style="margin: 5px 0; color: #666;">📍 ${prop.location}</p>
        <p style="margin: 5px 0; color: #10b981; font-size: 18px; font-weight: bold;">${prop.cost}</p>
        ${prop.amenities && prop.amenities.length > 0 ? `
          <p style="margin: 10px 0; color: #666;">
            <strong>Amenities:</strong> ${prop.amenities.slice(0, 5).join(', ')}
            ${prop.amenities.length > 5 ? ` +${prop.amenities.length - 5} more` : ''}
          </p>
        ` : ''}
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
           style="display: inline-block; margin-top: 10px; padding: 8px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">
          View Property
        </a>
      </div>
    `).join('');

    const mailOptions = {
      from: process.env.EMAIL_FROM || `PropertyHub <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `🏠 ${properties.length} New ${properties.length === 1 ? 'Property Matches' : 'Properties Match'} Your Search!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🎯 New Property Alert!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Properties matching your preferences</p>
            </div>
            
            <div class="content">
              <p>Hi <strong>${userName}</strong>,</p>
              
              <p>Great news! We found <strong>${properties.length}</strong> new ${properties.length === 1 ? 'property that matches' : 'properties that match'} your search preferences:</p>
              
              ${propertyList}
              
              <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;">⚡ <strong>Act Fast!</strong><br>
                These properties won't last long. Contact landlords today!</p>
              </div>
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
                   style="display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px;">
                  Browse All Properties
                </a>
              </div>
              
              <p style="font-size: 12px; color: #666;">Don't want these alerts? Update your preferences in your account settings.</p>
              
              <div class="footer">
                <p><strong>PropertyHub</strong></p>
                <p>Your trusted property rental platform</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Property alert sent to:', userEmail);
    return true;
  } catch (error) {
    console.error('❌ Error sending property alert:', error);
    return false;
  }
};

// ==================== BOOKING REMINDER EMAILS ====================

// Send move-in reminder to tenant
const sendMoveInReminder = async (booking, property) => {
  try {
    const moveInDate = new Date(booking.moveInDate);
    const daysUntil = Math.ceil((moveInDate - new Date()) / (1000 * 60 * 60 * 24));

    const mailOptions = {
      from: process.env.EMAIL_FROM || `PropertyHub <${process.env.EMAIL_USER}>`,
      to: booking.userEmail,
      subject: `🗓️ Reminder: Move-in Date Approaching - ${property.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .countdown { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; border: 2px solid #8b5cf6; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🗓️ Move-in Reminder</h1>
            </div>
            
            <div class="content">
              <p>Hi <strong>${booking.userName}</strong>,</p>
              
              <p>This is a friendly reminder about your upcoming move-in date!</p>
              
              <div class="countdown">
                <h2 style="margin: 0; color: #8b5cf6; font-size: 48px;">${daysUntil}</h2>
                <p style="margin: 5px 0 0 0; color: #666;">day${daysUntil === 1 ? '' : 's'} until move-in</p>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #8b5cf6;">📋 Booking Details</h3>
                <p><strong>Property:</strong> ${property.name}</p>
                <p><strong>Location:</strong> ${property.location}</p>
                <p><strong>Move-in Date:</strong> ${moveInDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Monthly Rent:</strong> ${property.cost}</p>
              </div>
              
              <h3 style="color: #8b5cf6;">✅ Move-in Checklist:</h3>
              <ul>
                <li>Confirm move-in time with landlord</li>
                <li>Arrange utilities (electricity, water, internet)</li>
                <li>Prepare first month's rent + security deposit</li>
                <li>Plan furniture delivery (if applicable)</li>
                <li>Do final property walkthrough with landlord</li>
                <li>Get all keys and gate remotes</li>
              </ul>
              
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <p style="margin: 0;">⚠️ <strong>Important:</strong><br>
                Contact your landlord at least 2 days before move-in to confirm all details!</p>
              </div>
              
              <p>Excited for your new home! 🏠🎉</p>
              
              <div class="footer">
                <p><strong>PropertyHub</strong></p>
                <p>Your trusted property rental platform</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Move-in reminder sent to:', booking.userEmail);
    return true;
  } catch (error) {
    console.error('❌ Error sending move-in reminder:', error);
    return false;
  }
};

module.exports = {
  sendTenantWelcomeEmail,
  sendLandlordWelcomeEmail,
  sendPropertyMatchAlert,
  sendMoveInReminder
};