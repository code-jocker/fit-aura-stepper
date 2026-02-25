const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Models (Early load to prevent issues)
const Product = require('./models/Product');
const Category = require('./models/Category');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/api/payments', require('./routes/payments'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/subscribe', require('./routes/subscribe'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/promotions', require('./routes/promotions'));
app.use('/api/messages', require('./routes/messages'));

// Catch-all for unmatched /api routes
app.use('/api/*', (req, res) => {
  console.warn(`⚠️ Unmatched API request: ${req.method} ${req.originalUrl}`);
  res.status(400).json({
    message: 'Invalid API endpoint',
    error: 'Bad Request'
  });
});

// Serve static assets in production
const frontendBuildPath = path.resolve(__dirname, '..', 'frontend', 'build');
console.log('Static assets path:', frontendBuildPath);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(frontendBuildPath));

  app.get('*', (req, res) => {
    // Only handle non-API routes
    if (!req.path.startsWith('/api')) {
      const indexPath = path.join(frontendBuildPath, 'index.html');
      // Explicitly allow indexing for the main pages
      res.header('X-Robots-Tag', 'index, follow');
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error('Error sending index.html:', err);
          res.status(500).send('Frontend build not found. Please ensure the build command succeeded.');
        }
      });
    }
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong on the server!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});




/*
  
  // Join user's personal room
  socket.join(socket.user.id);

  // If user is admin, join admin room
  if (socket.user.role === 'admin') {
    socket.join('admin_room');
  }
  
  // If user is delivery, join delivery room
  if (socket.user.role === 'delivery') {
    socket.join('delivery_room');
  }
  
  // If user is support, join support room
  if (socket.user.role === 'support') {
    socket.join('support_room');
  }
  
  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.user.id);
  });
  
  // Send message
  socket.on('send_message', async (data) => {
    const { receiverId, content, type, tempId } = data;
    const Message = require('./models/Message');
    const User = require('./models/User');

    try {
      let finalReceiverId = receiverId;

      // Handle sending to admin
      if (receiverId === 'admin') {
        const admin = await User.findOne({ role: 'admin' });
        if (admin) {
          finalReceiverId = admin._id.toString();
        } else {
          return; 
        }
      }

      // Handle sending to delivery
      if (receiverId === 'delivery') {
        const delivery = await User.findOne({ role: 'delivery' });
        if (delivery) {
          finalReceiverId = delivery._id.toString();
        } else {
          return; 
        }
      }

      // Handle sending to support
      if (receiverId === 'support') {
        const support = await User.findOne({ role: 'support' });
        if (support) {
          finalReceiverId = support._id.toString();
        } else {
          return; 
        }
      }

      const message = new Message({
        senderId: socket.user.id,
        receiverId: finalReceiverId,
        content,
        type: type || 'chat',
        isRead: false
      });
      await message.save();
      
      const populatedMessage = await message.populate('senderId receiverId', 'name role email');
      
      // Convert to object to append tempId if present
      const responseData = populatedMessage.toObject();
      if (tempId) responseData.tempId = tempId;

      // Emit to receiver's room
      io.to(finalReceiverId).emit('receive_message', responseData);
      
      // Also emit back to sender (for confirmation/UI update)
      io.to(socket.user.id).emit('receive_message', responseData);

      // If sending to admin, also emit to admin_room
      if (receiverId === 'admin') {
        io.to('admin_room').emit('receive_message', responseData);
        io.to('admin_room').emit('update_conversations', responseData);
      } else if (receiverId === 'delivery') {
        io.to('delivery_room').emit('receive_message', responseData);
        io.to('delivery_room').emit('update_conversations', responseData);
      } else if (receiverId === 'support') {
        io.to('support_room').emit('receive_message', responseData);
        io.to('support_room').emit('update_conversations', responseData);
      } else {
        // If admin sending to user, also update admin conversations to show latest message
        // This ensures all admins see the sent message in their conversation list
        io.to('admin_room').emit('update_conversations', responseData);
        // Also for delivery and support
        io.to('delivery_room').emit('update_conversations', responseData);
        io.to('support_room').emit('update_conversations', responseData);
      }

    } catch (err) {
      console.error('Message save error:', err);
    }
  });

  // Mark messages as read
  socket.on('mark_read', async (data) => {
    const { senderId, receiverId } = data; // senderId is the person who sent the messages we are reading
    const Message = require('./models/Message');
    const User = require('./models/User');
    
    try {
      // Update all unread messages from senderId to receiverId (socket.user.id)
      
      let actualReceiverId = socket.user.id;
      let actualSenderId = senderId;

      // Handle 'admin' sender (user marking admin messages as read)
      if (senderId === 'admin') {
        const admin = await User.findOne({ role: 'admin' });
        if (admin) {
          actualSenderId = admin._id;
        }
      }

      // Handle 'delivery' sender
      if (senderId === 'delivery') {
        const delivery = await User.findOne({ role: 'delivery' });
        if (delivery) {
          actualSenderId = delivery._id;
        }
      }

      // Handle 'support' sender
      if (senderId === 'support') {
        const support = await User.findOne({ role: 'support' });
        if (support) {
          actualSenderId = support._id;
        }
      }
      
      // If the user is admin reading user messages, receiverId passed might be 'admin'
      // But actualReceiverId is the admin's personal ID (socket.user.id)
      
      await Message.updateMany(
        { senderId: actualSenderId, receiverId: actualReceiverId, isRead: false },
        { $set: { isRead: true } }
      );
      
      // Notify the sender that their messages were read
      if (senderId === 'admin') {
         // If sender was 'admin' (virtual), notify all admins
         io.to('admin_room').emit('messages_read', { by: socket.user.id });
      } else if (senderId === 'delivery') {
         io.to('delivery_room').emit('messages_read', { by: socket.user.id });
      } else if (senderId === 'support') {
         io.to('support_room').emit('messages_read', { by: socket.user.id });
      } else {
         io.to(senderId).emit('messages_read', { by: socket.user.id });
      }
      
      // If admin read it, update admin conversations (clear unread count)
      if (socket.user.role === 'admin') {
         // Broadcast to all admins that this conversation is read
         io.to('admin_room').emit('update_conversations', { 
           senderId: { _id: senderId }, // To match structure used in frontend
           isReadUpdate: true 
         });
      }
      // If delivery read it, update delivery conversations
      if (socket.user.role === 'delivery') {
         io.to('delivery_room').emit('update_conversations', { 
           senderId: { _id: senderId },
           isReadUpdate: true 
         });
      }
      // If support read it, update support conversations
      if (socket.user.role === 'support') {
         io.to('support_room').emit('update_conversations', { 
           senderId: { _id: senderId },
           isReadUpdate: true 
         });
      }
    } catch (err) {
      console.error('Mark read error:', err);
    }
  });
  
  // Stock updates
  socket.on('check_stock', (productId) => {
    // Emit stock updates in real-time
  });
});
*/

const startServer = async () => {
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    connectDB().catch(err => {
      console.error('Database connection error:', err.message);
    });
  });
};

startServer();

module.exports = { app };
