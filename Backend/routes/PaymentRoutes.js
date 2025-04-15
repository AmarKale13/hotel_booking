const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const verifyToken = require('../middlewares/auth').verifyToken;
const { isAuthenticated } = require('../middlewares/auth');

// POST /api/create-checkout-session
// This endpoint creates a Stripe Checkout session.
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { amount, hotelId, bookingData } = req.body;
    // amount should be provided in the smallest currency unit (e.g., cents for USD)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd', // Change to your currency if needed
          product_data: {
            name: 'Hotel Booking Payment',
            description: `Payment for booking hotel ${hotelId}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/payment-cancelled',
      metadata: {
        hotelId: hotelId,
        bookingData: JSON.stringify(bookingData)
      }
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// POST /api/verify-payment
// This endpoint verifies the payment details (assume verification is already done on the frontend or via webhook)
// and then creates a booking record in the database.
router.post('/verify-payment',
  verifyToken,            // ← attach the middleware here
  async (req, res) => {
    try {
      // now req.userId is defined
      const userId    = req.userId;
      const { hotelId, bookingData, amount, paymentId, sessionId } = req.body;

      // sanity check
      if (!hotelId || !userId || !sessionId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // retrieve Stripe session to confirm payment
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (!session || session.payment_status !== 'paid') {
        return res.status(400).json({ message: "Payment not verified" });
      }

      // avoid duplicate bookings
      let booking = await Booking.findOne({ sessionId });
      if (booking) {
        return res.json({ success: true, booking });
      }

      // create new booking
      booking = new Booking({
        hotel:       hotelId,
        userId,                           // ← must match your schema’s required field
        checkInDate:  bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        name:          bookingData.name,
        mobile:        bookingData.mobile,
        email:         bookingData.email,
        amount,
        paymentId,
        sessionId,
        status:      'confirmed'
      });

      await booking.save();
      res.json({ success: true, booking });
      console.log("Payment Verification Successful, booking saved.");
    } catch (error) {
      console.error("Error verifying payment and creating booking:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  }
);


module.exports = router;
