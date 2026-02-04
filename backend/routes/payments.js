const express = require('express');
const router = express.Router();
const axios = require('axios');
const Order = require('../models/Order');

// MTN MoMo Payment
router.post('/momo', async (req, res) => {
  try {
    const { orderId, amount, phoneNumber } = req.body;
    
    // Validate request
    if (!orderId || !amount || !phoneNumber) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Initialize MoMo request
    const momoRequest = {
      amount,
      currency: 'RWF',
      externalId: orderId,
      payer: {
        partyIdType: 'MSISDN',
        partyId: phoneNumber
      },
      payerMessage: 'Fit Aura & Steppers Purchase',
      payeeNote: 'Payment for order'
    };
    
    // Call MoMo API (replace with actual endpoint)
    // const momoResponse = await axios.post(
    //   'https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay',
    //   momoRequest,
    //   {
    //     headers: {
    //       'X-Reference-Id': orderId,
    //       'Authorization': `Bearer ${process.env.MTN_MOMO_API_KEY}`
    //     }
    //   }
    // );
    
    // Update order with transaction ID (mock implementation)
    const order = await Order.findById(orderId);
    order.paymentStatus = 'pending';
    order.transactionId = `MOMO_${Date.now()}`;
    await order.save();
    
    res.json({ message: 'Payment initiated', transactionId: order.transactionId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Airtel Payment
router.post('/airtel', async (req, res) => {
  try {
    const { orderId, amount, phoneNumber } = req.body;
    
    if (!orderId || !amount || !phoneNumber) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Airtel payment implementation
    const airtelRequest = {
      request: {
        amount,
        currency: 'RWF',
        msisdn: phoneNumber,
        merchant_uid: 'FITAURA'
      }
    };
    
    // Update order
    const order = await Order.findById(orderId);
    order.paymentStatus = 'pending';
    order.transactionId = `AIRTEL_${Date.now()}`;
    await order.save();
    
    res.json({ message: 'Payment initiated', transactionId: order.transactionId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Payment webhook callback
router.post('/webhook', async (req, res) => {
  try {
    const { transactionId, status } = req.body;
    
    const order = await Order.findOne({ transactionId });
    if (order) {
      order.paymentStatus = status === 'successful' ? 'completed' : 'failed';
      order.status = status === 'successful' ? 'confirmed' : 'cancelled';
      await order.save();
    }
    
    res.json({ message: 'Webhook processed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
