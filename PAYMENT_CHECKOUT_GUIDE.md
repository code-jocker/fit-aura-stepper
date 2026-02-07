# Testing Payment & Checkout Flow

## Quick Start Guide

### 1. Admin Login & Add Test Products
```
URL: http://localhost:3001/login
Admin Tab → Username: mbabazi → Password: 12345
```

**Add Sample Product:**
- Name: Nike Air Jordan
- Brand: Nike
- Category: Shoes
- Price: 250000 RWF
- Sale Price: 175000 RWF
- Images: 
  ```
  https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500,
  https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500
  ```
- Sizes: 36,37,38,39,40,41,42
- Colors: Black,White,Red,Blue
- Stock: 50

### 2. Browse Products as Customer
```
URL: http://localhost:3001/products
```

- Filter by category
- View product details
- Add items to cart (select size, color, quantity)

### 3. View Cart
```
URL: http://localhost:3001/cart
```

Features:
- See itemized cart with prices
- Sale prices displayed (crossed out original)
- Adjust quantities
- Remove items
- Free delivery option for Kigali

### 4. Complete Checkout
```
URL: http://localhost:3001/checkout
```

**Fill Form:**
- Full Name: John Doe
- Email: john@example.com
- Phone: +250788123456
- Address: Kigali Street
- City: Kigali (or any city for delivery fee test)
- Payment Method: MTN MoMo or Airtel
- Notes: (optional) Special instructions

**Expected Behavior:**
1. ✅ Order created on backend
2. ✅ Payment instructions alert appears
3. ✅ Shows Order ID, Amount, Payment Instructions
4. ✅ Redirects to Order Confirmation page
5. ✅ Cart clears after checkout

### 5. Order Confirmation
```
URL: http://localhost:3001/order-confirmation/{orderId}
```

- Displays order details
- Shows reference number for payment
- Provides tracking information

---

## Key Features Testing

### Sale Price Display
- Product with sale price should show:
  - Green sale price
  - Strikethrough original price
  - Both in cart and checkout

### Image Display (Admin)
- Admin can see product images in gallery
- Multiple images per product
- Hover effect (scale) on images
- Fallback to placeholder if URL breaks

### Delivery Fee Logic
- City = "Kigali" → Free Delivery ✅
- City = "Huye" or others → 5,000 RWF fee ✅

### Payment Methods
- MTN MoMo option available
- Airtel Money option available
- Selected method shows in payment instructions

---

## Sample Test URLs for Images

You can use these public image URLs for testing:

**Shoes:**
```
https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500
https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500
https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500
```

**Clothes:**
```
https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500
https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500
https://images.unsplash.com/photo-1539533057409-fc22eebca4d4?w=500
```

**Accessories:**
```
https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500
https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500
https://images.unsplash.com/photo-1535368633090-55ddf11ecb0b?w=500
```

---

## Troubleshooting

### Images Not Loading
- Check URL is publicly accessible
- Use full URL with protocol (https://...)
- Wait a few seconds for image to load

### Cart Not Updating
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors
- Ensure localStorage is enabled

### Checkout Failing
- Fill all required fields (marked with *)
- Check browser console for API errors
- Ensure backend is running (port 5000)
- Check network tab for 400/500 errors

### Order Not Created
- Check MongoDB connection
- Verify backend is running
- Check backend logs for errors
- Test API directly: `http://localhost:5000/api/health`

---

## API Endpoints Reference

```
POST /api/auth/admin-login
POST /api/products
GET /api/products
PUT /api/products/{id}
DELETE /api/products/{id}
POST /api/orders
GET /api/orders/{id}
```

---

**Test Environment**: Development
**Backend**: http://localhost:5000
**Frontend**: http://localhost:3001
**Database**: MongoDB (local or Atlas)
