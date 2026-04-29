const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendOrderConfirmation = async (email, orderId, orderDetails) => {
  const mailOptions = {
    from: 'orders@mbabazicloset.rw',
    to: email,
    subject: `Order Confirmation - ${orderId}`,
    html: `
      <h2>Order Confirmed! ✅</h2>
      <p>Thank you for your purchase with MBABAZI CLOSET</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Total Amount:</strong> ${orderDetails.total.toLocaleString()} RWF</p>
      <p><strong>Delivery Fee:</strong> ${orderDetails.deliveryFee === 0 ? 'FREE 🚚' : orderDetails.deliveryFee + ' RWF'}</p>
      <p>Your order will be delivered in 2-3 business days.</p>
      <hr>
      <p>Need help? Contact support@mbabazicloset.rw or call +250 (0) 798 000 000</p>
    `
  };
  
  return transporter.sendMail(mailOptions);
};

const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: 'welcome@mbabazicloset.rw',
    to: email,
    subject: 'Welcome to MBABAZI CLOSET! 🇷🇼',
    html: `
      <h2>Welcome ${name}!</h2>
      <p>Welcome to Rwanda's premium fashion destination.</p>
      <p>Enjoy exclusive deals and style tips by being part of our community.</p>
      <p><a href="https://mbabazicloset.rw/products">Shop Now</a></p>
    `
  };
  
  return transporter.sendMail(mailOptions);
};

const sendContactMessage = async (name, email, message) => {
  const mailOptions = {
    from: 'contact-form@mbabazicloset.rw',
    to: process.env.ADMIN_EMAIL || 'admin@mbabazicloset.rw',
    subject: `New Contact Message from ${name}`,
    html: `
      <h2>New Message from MBABAZI CLOSET Website</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
  };
  
  return transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (email, resetUrl) => {
  const mailOptions = {
    from: 'security@mbabazicloset.rw',
    to: email,
    subject: 'Password Reset Request - MBABAZI CLOSET',
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your MBABAZI CLOSET account.</p>
      <p>Please click the link below to reset your password. This link will expire in 1 hour.</p>
      <p><a href="${resetUrl}" style="background-color: #f59e0b; color: black; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px;">Reset Password</a></p>
      <p>If you did not request this, please ignore this email.</p>
    `
  };
  
  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendOrderConfirmation,
  sendWelcomeEmail,
  sendContactMessage,
  sendPasswordResetEmail
};
