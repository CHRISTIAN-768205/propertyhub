const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const Subscription = require('../models/Subscription');
const Commission = require('../models/Commission');
const { auth, checkRole } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify email connection
transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Send NEW BOOKING notification to LANDLORD (when tenant submits inquiry)
const sendNewBookingEmailToLandlord = async (booking, property, landlord) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || `PropertyHub <${process.env.EMAIL_USER}>`,
      to: landlord.email,
      subject: `🔔 New Booking Request - ${property.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .detail-row { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #666; display: inline-block; width: 140px; }
            .value { color: #333; }
            .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 10px 10px 10px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🔔 New Booking Request!</h1>
            </div>
            
            <div class="content">
              <p>Hello <strong>${landlord.fullName || landlord.name}</strong>,</p>
              
              <p>You have received a new rental inquiry for your property:</p>
              
              <div class="details">
                <h3 style="margin-top: 0; color: #667eea;">🏠 Property Details</h3>
                <div class="detail-row">
                  <span class="label">Property:</span>
                  <span class="value"><strong>${property.title}</strong></span>
                </div>
                <div class="detail-row">
                  <span class="label">Address:</span>
                  <span class="value">${property.address}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Monthly Rent:</span>
                  <span class="value"><strong>KES ${property.price?.toLocaleString()}</strong></span>
                </div>
              </div>
              
              <div class="details">
                <h3 style="margin-top: 0; color: #667eea;">👤 Tenant Information</h3>
                <div class="detail-row">
                  <span class="label">Name:</span>
                  <span class="value"><strong>${booking.userName}</strong></span>
                </div>
                <div class="detail-row">
                  <span class="label">Email:</span>
                  <span class="value">${booking.userEmail}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Phone:</span>
                  <span class="value"><strong>${booking.phone}</strong></span>
                </div>
                <div class="detail-row">
                  <span class="label">Move-in Date:</span>
                  <span class="value">${new Date(booking.moveInDate).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                ${booking.message ? `
                <div class="detail-row">
                  <span class="label">Message:</span>
                  <span class="value">${booking.message}</span>
                </div>
                ` : ''}
              </div>
              
              <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;">⏰ <strong>Action Required:</strong> Please review this booking and respond within 24 hours.</p>
              </div>
              
              <p style="text-align: center;">
                <a href="http://localhost:3000/landlord-dashboard" class="button" style="color: white;">View Dashboard</a>
              </p>
              
              <p><strong>Next Steps:</strong></p>
              <ol>
                <li>Log in to your PropertyHub dashboard</li>
                <li>Go to the "Bookings" tab</li>
                <li>Review the booking details</li>
                <li>Click "Approve" or "Reject"</li>
                <li>Contact the tenant to arrange viewing/signing</li>
              </ol>
              
              <div class="footer">
                <p><strong>PropertyHub</strong></p>
                <p>Your trusted property rental platform</p>
                <p style="color: #999; font-size: 11px;">This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ New booking notification sent to landlord:', landlord.email);
    return true;
  } catch (error) {
    console.error('❌ Error sending landlord notification:', error);
    return false;
  }
};

// Send approval email to TENANT
const sendApprovalEmail = async (booking, property) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || `PropertyHub <${process.env.EMAIL_USER}>`,
      to: booking.userEmail,
      subject: `✅ Booking Approved - ${property.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; color: #666; }
            .value { color: #333; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
            ul { padding-left: 20px; }
            li { margin: 8px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🎉 Booking Approved!</h1>
            </div>
            
            <div class="content">
              <p>Dear <strong>${booking.userName}</strong>,</p>
              
              <p>Great news! Your rental inquiry has been <strong style="color: #10b981;">APPROVED</strong> by the landlord.</p>
              
              <div class="details">
                <h3 style="margin-top: 0; color: #667eea;">📋 Booking Details</h3>
                
                <div class="detail-row">
                  <span class="label">🏠 Property:</span>
                  <span class="value">${property.title}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">📍 Location:</span>
                  <span class="value">${property.address}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">💰 Monthly Rent:</span>
                  <span class="value">KES ${property.price?.toLocaleString()}</span>
                </div>
                
                <div class="detail-row">
                  <span class="label">📅 Move-in Date:</span>
                  <span class="value">${new Date(booking.moveInDate).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>
              
              <h3 style="color: #667eea;">🎯 Next Steps</h3>
              <p>The landlord will contact you shortly via:</p>
              <ul>
                <li>📧 Email: <strong>${booking.userEmail}</strong></li>
                <li>📱 Phone: <strong>${booking.phone}</strong></li>
              </ul>
              
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
    console.log('✅ Approval email sent to tenant:', booking.userEmail);
    return true;
  } catch (error) {
    console.error('❌ Error sending approval email:', error);
    return false;
  }
};

// Send rejection email to TENANT
const sendRejectionEmail = async (booking, property) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || `PropertyHub <${process.env.EMAIL_USER}>`,
      to: booking.userEmail,
      subject: `Booking Update - ${property.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">📬 Booking Update</h1>
            </div>
            
            <div class="content">
              <p>Dear <strong>${booking.userName}</strong>,</p>
              
              <p>Thank you for your interest in <strong>${property.title}</strong>.</p>
              
              <p>Unfortunately, the landlord is unable to accommodate your booking request at this time.</p>
              
              <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;">💡 <strong>Good News:</strong> We have many other great properties available!</p>
              </div>
              
              <p style="text-align: center;">
                <a href="http://localhost:3000" class="button" style="color: white;">Browse More Properties</a>
              </p>
              
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
    console.log('✅ Rejection email sent to tenant:', booking.userEmail);
    return true;
  } catch (error) {
    console.error('❌ Error sending rejection email:', error);
    return false;
  }
};

// ============================================
// CREATE NEW BOOKING - WITH COMMISSION!
// ============================================
router.post('/', async (req, res) => {
  try {
    console.log('📝 Creating booking/inquiry...');
    console.log('Request body:', req.body);
    
    const { propertyId, userName, userEmail, phone, moveInDate, message } = req.body;
    
    // Validate required fields
    if (!propertyId) return res.status(400).json({ message: 'Property ID is required' });
    if (!userName) return res.status(400).json({ message: 'Name is required' });
    if (!userEmail) return res.status(400).json({ message: 'Email is required' });
    if (!phone) return res.status(400).json({ message: 'Phone is required' });
    if (!moveInDate) return res.status(400).json({ message: 'Move-in date is required' });
    
    // Get property WITH landlord data populated
    const property = await Property.findById(propertyId).populate('landlordId');
    
    if (!property) {
      console.log('❌ Property not found:', propertyId);
      return res.status(404).json({ message: 'Property not found' });
    }
    
    if (!property.landlordId) {
      console.log('❌ Property has no landlord assigned');
      return res.status(500).json({ message: 'Property configuration error - no landlord assigned' });
    }
    
    console.log('✅ Property found:', property.title);
    console.log('✅ Landlord:', property.landlordId.email);
    
    // ==========================================
    // COMMISSION CALCULATION (NEW!)
    // ==========================================
    let subscription = await Subscription.findOne({ landlord: property.landlordId._id });
    
    // Create FREE subscription if doesn't exist
    if (!subscription) {
      subscription = await Subscription.create({
        landlord: property.landlordId._id,
        plan: 'free',
        status: 'active'
      });
      console.log('📝 Created FREE subscription for landlord');
    }
    
    // Get commission rate (15% for FREE, 5% for PREMIUM)
    const commissionRate = subscription.getCommissionRate();
    const monthlyRent = property.price || 0;
    const commissionAmount = (monthlyRent * commissionRate) / 100;
    const landlordPayout = monthlyRent - commissionAmount;
    
    console.log('💰 Commission calculated:', {
      plan: subscription.plan,
      rate: `${commissionRate}%`,
      rent: monthlyRent,
      commission: commissionAmount,
      landlordGets: landlordPayout
    });
    // ==========================================
    
    // Create booking with LANDLORD ID + COMMISSION DATA
    const booking = new Booking({
      propertyId: propertyId,
      landlordId: property.landlordId._id,
      userName,
      userEmail,
      phone,
      moveInDate: new Date(moveInDate),
      message: message || '',
      status: 'pending',
      // Commission fields (NEW!)
      monthlyRent: monthlyRent,
      commissionRate: commissionRate,
      commissionAmount: commissionAmount,
      landlordPayout: landlordPayout
    });
    
    await booking.save();
    console.log('✅ Booking created successfully:', booking._id);
    console.log('✅ Assigned to landlord:', booking.landlordId);
    
    // Create commission record for tracking (NEW!)
    await Commission.create({
      booking: booking._id,
      landlord: property.landlordId._id,
      amount: commissionAmount,
      rate: commissionRate,
      plan: subscription.plan,
      status: 'pending',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    });
    console.log('✅ Commission record created');
    
    // Send email notification to LANDLORD
    console.log('📧 Sending notification to landlord...');
    const landlordEmailSent = await sendNewBookingEmailToLandlord(
      booking, 
      property, 
      property.landlordId
    );
    
    if (landlordEmailSent) {
      console.log('✅ Landlord notified successfully');
    } else {
      console.log('⚠️ Failed to notify landlord via email (check email config)');
    }
    
    res.status(201).json({
      message: 'Rental inquiry submitted successfully! The landlord has been notified and will contact you soon.',
      booking,
      commission: {
        plan: subscription.plan,
        rate: commissionRate,
        amount: commissionAmount,
        landlordPayout: landlordPayout
      },
      landlordNotified: landlordEmailSent
    });
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    res.status(500).json({ 
      message: 'Error creating booking', 
      error: error.message 
    });
  }
});

// ============================================
// GET LANDLORD'S BOOKINGS - FIXED!
// ============================================
router.get('/landlord-bookings', auth, checkRole('landlord'), async (req, res) => {
  try {
    console.log(`📋 Fetching bookings for landlord: ${req.user.id}`);
    
    const bookings = await Booking.find({ landlordId: req.user.id })
      .populate('propertyId', 'title address images price')
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${bookings.length} bookings for landlord`);
    
    // Add tenant info from booking itself (not populated)
    const bookingsWithTenant = bookings.map(booking => ({
      ...booking.toObject(),
      tenantId: {
        name: booking.userName,
        email: booking.userEmail,
        phone: booking.phone
      }
    }));
    
    res.json(bookingsWithTenant);
  } catch (error) {
    console.error('❌ Error fetching landlord bookings:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// UPDATE BOOKING STATUS (Approve/Reject) - WITH COMMISSION UPDATE!
// ============================================
router.patch('/:id/status', auth, checkRole('landlord'), async (req, res) => {
  try {
    const { status } = req.body;
    console.log(`📝 Updating booking ${req.params.id} to status: ${status}`);
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Check authorization
    if (booking.landlordId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Get property for email
    const property = await Property.findById(booking.propertyId);
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    // Update status
    booking.status = status;
    
    // Update payment status based on booking status (NEW!)
    if (status === 'confirmed') {
      booking.paymentStatus = 'pending';
      booking.confirmedAt = new Date();
      
      // Update commission status to 'collected' when confirmed
      await Commission.findOneAndUpdate(
        { booking: booking._id },
        { 
          status: 'collected',
          collectedAt: new Date()
        }
      );
      console.log('✅ Commission marked as collected');
    } else if (status === 'cancelled' || status === 'rejected') {
      booking.paymentStatus = 'refunded';
      booking.cancelledAt = new Date();
      
      // Update commission status to 'refunded'
      await Commission.findOneAndUpdate(
        { booking: booking._id },
        { status: 'refunded' }
      );
      console.log('✅ Commission marked as refunded');
    }
    
    await booking.save();
    console.log('✅ Booking status updated');
    
    // Send appropriate email to tenant
    let emailSent = false;
    if (status === 'confirmed') {
      console.log('📧 Sending approval email to tenant...');
      emailSent = await sendApprovalEmail(booking, property);
    } else if (status === 'cancelled' || status === 'rejected') {
      console.log('📧 Sending rejection email to tenant...');
      emailSent = await sendRejectionEmail(booking, property);
    }
    
    res.json({
      success: true,
      message: emailSent 
        ? `Booking ${status}! Tenant has been notified via email.` 
        : `Booking ${status}! (Email notification failed - check config)`,
      booking,
      emailSent
    });
  } catch (error) {
    console.error('❌ Error updating booking status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete booking
router.delete('/:id', auth, checkRole('landlord'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check authorization
    if (booking.landlordId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await booking.deleteOne();
    
    console.log('✅ Booking deleted');
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting booking:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;