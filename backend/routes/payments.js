const express = require('express');
const router = express.Router();
const axios = require('axios');
const Order = require('../models/Order');

const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

// Initialize Flutterwave Payment
router.post('/flutterwave/initialize', async (req, res) => {
  try {
    const { orderId, amount, email, phone, name } = req.body;

    if (!orderId || !amount || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!FLUTTERWAVE_SECRET_KEY) {
      console.error('❌ FLUTTERWAVE_SECRET_KEY is not defined');
      return res.status(500).json({ message: 'Payment gateway not configured' });
    }

    const tx_ref = `MBABAZI-${orderId}-${Date.now()}`;

    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      {
        tx_ref: tx_ref,
        amount: amount,
        currency: 'RWF',
        redirect_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/order-success`,
        customer: {
          email: email,
          phonenumber: phone,
          name: name,
        },
        customizations: {
          title: 'MBABAZI CLOSET',
          description: `Payment for Order #${orderId}`,
          logo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/MBABAZI.JPG`,
        },
        payment_options: 'card,mobilemoneyrwanda,ussd',
      },
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.status === 'success') {
      // Update order with transaction reference
      const order = await Order.findById(orderId);
      if (order) {
        order.transactionId = tx_ref;
        await order.save();
      }

      res.json({
        status: 'success',
        link: response.data.data.link,
        tx_ref: tx_ref
      });
    } else {
      res.status(400).json({ message: 'Failed to initialize payment' });
    }
  } catch (error) {
    console.error('Flutterwave Initialize Error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Payment initialization failed',
      error: error.response?.data?.message || error.message 
    });
  }
});

// Verify Flutterwave Payment
router.get('/flutterwave/verify', async (req, res) => {
  const { transaction_id, tx_ref } = req.query;

  try {
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    const data = response.data.data;
    const orderId = tx_ref.split('-')[1]; // Extract orderId from tx_ref

    const order = await Order.findById(orderId);

    if (
      response.data.status === 'success' &&
      data.status === 'successful' &&
      data.amount >= order.total &&
      data.currency === 'RWF'
    ) {
      // Success
      order.paymentStatus = 'completed';
      order.status = 'confirmed';
      await order.save();
      res.json({ status: 'success', message: 'Payment verified successfully' });
    } else {
      // Failed
      order.paymentStatus = 'failed';
      await order.save();
      res.status(400).json({ status: 'failed', message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Flutterwave Verify Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Internal server error during verification' });
  }
});

// Webhook for Flutterwave
router.post('/webhook/flutterwave', async (req, res) => {
  // Verify the signature from Flutterwave
  const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
  const signature = req.headers['verif-hash'];

  if (!signature || signature !== secretHash) {
    return res.status(401).end();
  }

  const payload = req.body;
  
  if (payload.status === 'successful') {
    const tx_ref = payload.txRef || payload.tx_ref;
    const orderId = tx_ref.split('-')[1];
    
    const order = await Order.findById(orderId);
    if (order && order.paymentStatus !== 'completed') {
      order.paymentStatus = 'completed';
      order.status = 'confirmed';
      await order.save();
    }
  }

  res.status(200).end();
});

// Original legacy routes kept for compatibility
router.post('/momo', async (req, res) => {
  try {
    const { orderId, amount, phoneNumber } = req.body;
    if (!orderId || !amount || !phoneNumber) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const order = await Order.findById(orderId);
    order.paymentStatus = 'pending';
    order.transactionId = `MOMO_${Date.now()}`;
    await order.save();
    res.json({ message: 'Payment initiated via MoMo', transactionId: order.transactionId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/airtel', async (req, res) => {
  try {
    const { orderId, amount, phoneNumber } = req.body;
    if (!orderId || !amount || !phoneNumber) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const order = await Order.findById(orderId);
    order.paymentStatus = 'pending';
    order.transactionId = `AIRTEL_${Date.now()}`;
    await order.save();
    res.json({ message: 'Payment initiated via Airtel', transactionId: order.transactionId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
