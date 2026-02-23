
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const io = require('socket.io-client');
const dotenv = require('dotenv');
const path = require('path');

// Load backend env
dotenv.config();

const SOCKET_URL = 'http://localhost:5000';

const runTest = async () => {
  try {
    console.log('Connecting to DB to get tokens...');
    if (!process.env.MONGODB_URI) {
         console.error('MONGODB_URI is missing');
         process.exit(1);
    }
    
    // Increase timeout
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 30000 });
    
    // Get Admin
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
        console.error('Admin not found! Run setup-admin.js first.');
        process.exit(1);
    }
    
    // Get Customer
    let customer = await User.findOne({ email: 'customer@test.com' });
    if (!customer) {
       customer = await User.create({
         name: 'Test Customer',
         email: 'customer@test.com',
         password: 'password123',
         role: 'customer'
       });
       console.log('Created test customer');
    }

    const adminToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const customerToken = jwt.sign({ id: customer._id, role: customer.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Tokens generated.');
    await mongoose.disconnect();

    // Connect Customer
    console.log('Connecting Customer...');
    const customerSocket = io(SOCKET_URL, {
      auth: { token: customerToken }
    });

    // Connect Admin
    console.log('Connecting Admin...');
    const adminSocket = io(SOCKET_URL, {
      auth: { token: adminToken }
    });

    // Setup Listeners
    customerSocket.on('connect', () => console.log('✅ Customer Connected'));
    customerSocket.on('connect_error', (err) => console.error('❌ Customer Connection Error:', err.message));
    
    adminSocket.on('connect', () => console.log('✅ Admin Connected'));
    adminSocket.on('connect_error', (err) => console.error('❌ Admin Connection Error:', err.message));

    // Admin listening
    adminSocket.on('receive_message', (msg) => {
      console.log('🔵 Admin Received:', msg.content);
      if (msg.content === 'Hello Admin from Test Script') {
        console.log('Sending reply...');
        adminSocket.emit('send_message', {
          receiverId: msg.senderId._id || msg.senderId, // depending on population
          content: 'Hello Customer, I received your message.',
          type: 'chat'
        });
      }
    });

    // Customer listening
    customerSocket.on('receive_message', (msg) => {
      console.log('🟢 Customer Received:', msg.content, msg.tempId ? `(TempID: ${msg.tempId})` : '');

      if (msg.tempId === 123456789) {
        console.log('✅ TempID echo successful');
      }

      if (msg.content === 'Hello Customer, I received your message.') {
        console.log('✅ Test Passed: Full Cycle Complete');
        customerSocket.disconnect();
        adminSocket.disconnect();
        process.exit(0);
      }
    });

    // Wait for connections then send message
    setTimeout(() => {
        if (customerSocket.connected) {
            console.log('Sending message from Customer...');
            customerSocket.emit('send_message', {
                receiverId: 'admin',
                content: 'Hello Admin from Test Script',
                type: 'chat',
                tempId: 123456789
            });
        } else {
            console.log('Customer not connected, cannot send message.');
        }
    }, 3000);

    // Timeout
    setTimeout(() => {
        console.error('❌ Test Timed Out');
        process.exit(1);
    }, 15000);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runTest();
