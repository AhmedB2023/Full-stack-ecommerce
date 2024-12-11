const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const saltRounds = 10; // Number of salt rounds for password hashing

// Products API Route
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows); // Send all products as JSON
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
    const { username, password, email } = req.body; // Ensure password is destructured here

    try {
        console.log('Request received at signup endpoint:', req.body); // Debugging log
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (username, password, email) VALUES ($1, $2, $3)',
            [username, hashedPassword, email]
        );

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user.' });
    }
});


// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Log the username and password received
        console.log('Login request:', { username, password });

        // Find the user in the database
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        
       

        if (userResult.rows.length === 0) {
            console.error('User not found');
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = userResult.rows[0];

        // Log the hashed password from the database
        console.log('Hashed password from DB:', user.password);

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // Log the password comparison result
        console.log('Password validation result:', isPasswordValid);

        if (!isPasswordValid) {
            console.error('Incorrect password');
            return res.status(401).json({ message: 'Incorrect password.' });
        }

        // Include the user's ID in the response
        res.status(200).json({
            message: 'Login successful.',
            user: {
                id: user.id,
                username: user.username,
            },
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ message: 'Server error during login.' });
    }
});


// Save Order Route
app.post('/api/orders', async (req, res) => {
    console.log('Request Body:', req.body); // Log the incoming request body for debugging

    const { userId, cartItems, totalPrice } = req.body;

    if (!userId || typeof userId !== 'number') {
        return res.status(400).json({ message: 'Invalid or missing userId.' });
    }

    try {
        // Insert the order into the database
        const result = await pool.query(
            'INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING id',
            [userId, totalPrice]
        );

        const orderId = result.rows[0].id;
        console.log('Order ID:', orderId); // Log the order ID for debugging

        // Insert each cart item into the order_items table
        const orderItemsQueries = cartItems.map((item) =>
            pool.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
                [orderId, item.id, item.quantity, item.price]
            )
        );

        await Promise.all(orderItemsQueries);

        res.status(201).json({ message: 'Order placed successfully!', orderId });
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ message: 'Failed to place order.' });
    }
});

// Search products endpoint
app.get('/api/search', async (req, res) => {
    const { query } = req.query; // Extract the search query from the request
    try {
        const result = await pool.query(
            'SELECT * FROM products WHERE LOWER(name) LIKE $1',
            [`%${query.toLowerCase()}%`]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Failed to search products' });
    }
});

// Reservation endpoint
app.post('/api/reserve', async (req, res) => {
    const { name, phone, productId, quantity } = req.body;

    try {
        // Insert the reservation into the database
        const result = await pool.query(
            'INSERT INTO reservations (name, phone, product_id, quantity) VALUES ($1, $2, $3, $4) RETURNING id',
            [name, phone, productId, quantity]
        );

        const reservationId = result.rows[0].id;

        // Respond with the reservation ID
        res.status(201).json({ message: 'Reservation successful!', reservationId });
    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({ message: 'Failed to create reservation.' });
    }
});



// Start the server
const PORT = 5002; // Use a different port
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
