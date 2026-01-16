const axios = require('axios');

class MPesaService {
  constructor() {
    this.environment = process.env.MPESA_ENVIRONMENT || 'sandbox';
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.shortcode = process.env.MPESA_SHORTCODE;
    this.passkey = process.env.MPESA_PASSKEY;
    
    // API URLs
    this.baseURL = this.environment === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';
    
    this.authURL = `${this.baseURL}/oauth/v1/generate?grant_type=client_credentials`;
    this.stkPushURL = `${this.baseURL}/mpesa/stkpush/v1/processrequest`;
    this.queryURL = `${this.baseURL}/mpesa/stkpushquery/v1/query`;
    
    console.log(`🔌 M-Pesa Service initialized (${this.environment} mode)`);
  }

  // Get OAuth Access Token
  async getAccessToken() {
    try {
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      
      const response = await axios.get(this.authURL, {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      });
      
      console.log('✅ M-Pesa access token obtained');
      return response.data.access_token;
    } catch (error) {
      console.error('❌ M-Pesa auth error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with M-Pesa');
    }
  }

  // Generate Password for STK Push
  generatePassword(timestamp) {
    const data = `${this.shortcode}${this.passkey}${timestamp}`;
    return Buffer.from(data).toString('base64');
  }

  // Generate Timestamp (YYYYMMDDHHmmss)
  generateTimestamp() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  // Initiate STK Push (Lipa Na M-Pesa Online)
  async stkPush(phoneNumber, amount, accountReference, transactionDesc) {
    try {
      console.log('💳 Initiating STK Push...', {
        phone: phoneNumber,
        amount: amount,
        reference: accountReference
      });

      // Get access token
      const accessToken = await this.getAccessToken();
      
      // Generate timestamp and password
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);
      
      // Format phone number (must be 254XXXXXXXXX)
      let formattedPhone = phoneNumber.replace(/\s/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.substring(1);
      }
      if (!formattedPhone.startsWith('254')) {
        formattedPhone = '254' + formattedPhone;
      }

      // STK Push request body
      const requestBody = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(amount), // Must be integer
        PartyA: formattedPhone, // Phone number
        PartyB: this.shortcode, // Business shortcode
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc || 'Payment for PropertyHub'
      };

      console.log('📤 Sending STK Push request...');
      
      // Send STK Push
      const response = await axios.post(this.stkPushURL, requestBody, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ STK Push initiated:', response.data);

      return {
        success: true,
        checkoutRequestID: response.data.CheckoutRequestID,
        merchantRequestID: response.data.MerchantRequestID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
        customerMessage: response.data.CustomerMessage
      };
      
    } catch (error) {
      console.error('❌ STK Push error:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.errorMessage || error.message
      };
    }
  }

  // Query STK Push Status
  async queryStkPush(checkoutRequestID) {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);

      const requestBody = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID
      };

      const response = await axios.post(this.queryURL, requestBody, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ STK Query response:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ STK Query error:', error.response?.data || error.message);
      throw error;
    }
  }
}

// Export singleton instance
module.exports = new MPesaService();