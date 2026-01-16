const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Commission = require('../models/Commission');
const { auth } = require('../middleware/auth');

// ==========================================
// INITIATE PAYMENT (After Booking Created)
// ==========================================
router.post('/:bookingId/initiate-payment', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { phoneNumber, paymentMethod } = req.body; // e.g., "254712345678", "mpesa"
    
    const booking = await Booking.findById(bookingId)
      .populate('propertyId', 'title price');
    
    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found' 
      });
    }
    
    // Calculate total amount (rent + commission)
    const totalAmount = booking.monthlyRent + booking.commissionAmount;
    
    console.log('💳 Initiating payment:', {
      booking: bookingId,
      property: booking.propertyId.title,
      rent: booking.monthlyRent,
      commission: booking.commissionAmount,
      total: totalAmount,
      phone: phoneNumber
    });
    
    // ==========================================
    // M-PESA STK PUSH (Simulated for now)
    // ==========================================
    // In production, you'd call M-Pesa API here:
    // const mpesaResponse = await initiateSTKPush(phoneNumber, totalAmount);
    
    // For now, we'll simulate it:
    const transactionId = `TXN${Date.now()}`;
    
    // Update booking with payment details
    booking.paymentMethod = paymentMethod;
    booking.paymentStatus = 'pending'; // Will be 'paid' after confirmation
    booking.transactionId = transactionId;
    await booking.save();
    
    console.log('✅ Payment initiated:', transactionId);
    
    res.json({
      success: true,
      message: 'Payment initiated. Please complete payment on your phone.',
      paymentDetails: {
        transactionId: transactionId,
        amount: totalAmount,
        breakdown: {
          rent: booking.monthlyRent,
          platformFee: booking.commissionAmount,
          total: totalAmount
        },
        phoneNumber: phoneNumber,
        status: 'pending'
      }
    });
    
  } catch (error) {
    console.error('❌ Payment initiation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to initiate payment',
      error: error.message 
    });
  }
});

// ==========================================
// CONFIRM PAYMENT (Called by M-Pesa callback or manually)
// ==========================================
router.post('/:bookingId/confirm-payment', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { transactionId, mpesaReceiptNumber } = req.body;
    
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found' 
      });
    }
    
    // Verify transaction (in production, verify with M-Pesa)
    if (booking.transactionId !== transactionId) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid transaction ID' 
      });
    }
    
    // Update booking payment status
    booking.paymentStatus = 'paid';
    booking.paidAt = new Date();
    if (mpesaReceiptNumber) {
      booking.transactionId = mpesaReceiptNumber; // Update with M-Pesa receipt
    }
    await booking.save();
    
    // Update commission status
    await Commission.findOneAndUpdate(
      { booking: bookingId },
      { 
        status: 'collected',
        collectedAt: new Date()
      }
    );
    
    console.log('✅ Payment confirmed:', {
      booking: bookingId,
      transaction: transactionId,
      amount: booking.monthlyRent + booking.commissionAmount
    });
    
    res.json({
      success: true,
      message: 'Payment confirmed successfully!',
      booking: {
        id: booking._id,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        paidAt: booking.paidAt,
        amount: booking.monthlyRent + booking.commissionAmount
      }
    });
    
  } catch (error) {
    console.error('❌ Payment confirmation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to confirm payment',
      error: error.message 
    });
  }
});

// ==========================================
// CHECK PAYMENT STATUS
// ==========================================
router.get('/:bookingId/payment-status', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .select('paymentStatus paymentMethod transactionId paidAt monthlyRent commissionAmount');
    
    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found' 
      });
    }
    
    const totalAmount = booking.monthlyRent + booking.commissionAmount;
    
    res.json({
      success: true,
      payment: {
        status: booking.paymentStatus,
        method: booking.paymentMethod,
        transactionId: booking.transactionId,
        paidAt: booking.paidAt,
        amount: totalAmount,
        breakdown: {
          rent: booking.monthlyRent,
          platformFee: booking.commissionAmount,
          total: totalAmount
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Error checking payment status:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to check payment status',
      error: error.message 
    });
  }
});

// ==========================================
// M-PESA CALLBACK (Webhook from M-Pesa)
// ==========================================
router.post('/mpesa-callback', async (req, res) => {
  try {
    console.log('📱 M-Pesa callback received:', req.body);
    
    // Parse M-Pesa response
    const { Body } = req.body;
    const resultCode = Body?.stkCallback?.ResultCode;
    const transactionId = Body?.stkCallback?.CheckoutRequestID;
    const mpesaReceipt = Body?.stkCallback?.CallbackMetadata?.Item?.find(
      item => item.Name === 'MpesaReceiptNumber'
    )?.Value;
    
    if (resultCode === 0) {
      // Payment successful
      console.log('✅ M-Pesa payment successful:', mpesaReceipt);
      
      // Find booking by transaction ID
      const booking = await Booking.findOne({ transactionId: transactionId });
      
      if (booking) {
        booking.paymentStatus = 'paid';
        booking.paidAt = new Date();
        booking.transactionId = mpesaReceipt;
        await booking.save();
        
        // Update commission
        await Commission.findOneAndUpdate(
          { booking: booking._id },
          { status: 'collected', collectedAt: new Date() }
        );
        
        console.log('✅ Booking payment updated:', booking._id);
      }
    } else {
      // Payment failed
      console.log('❌ M-Pesa payment failed:', resultCode);
      
      const booking = await Booking.findOne({ transactionId: transactionId });
      if (booking) {
        booking.paymentStatus = 'failed';
        await booking.save();
      }
    }
    
    // Always respond to M-Pesa
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    
  } catch (error) {
    console.error('❌ M-Pesa callback error:', error);
    res.json({ ResultCode: 1, ResultDesc: 'Failed' });
  }
});

module.exports = router;