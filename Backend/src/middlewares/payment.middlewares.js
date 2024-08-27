import Razorpay from 'razorpay';
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, 
  key_secret: process.env.RAZORPAY_KEY_SECRET, 
});

const paymentMiddleware = (req, res, next) => {
    const { amount, currency, receipt, totalPrice } = req.body;

    if (!totalPrice || !currency || !receipt) {
        return res.status(400).json({ error: 'Missing required payment details' });
    }

    const options = {
        amount: totalPrice, // Amount is already in the smallest currency unit (paisa for INR)
        currency,
        receipt,
        payment_capture: '1', // Automatically capture payment
    };

    razorpayInstance.orders.create(options, (err, order) => {
        if (err) {
            return res.status(500).json({ error: 'Error creating payment order' });
        }

        req.order = order;
        next(); // Proceed to the next middleware or route handler
    });
};


export{
    paymentMiddleware
}
