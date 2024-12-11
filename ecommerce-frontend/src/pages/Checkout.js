import React from 'react';

function Checkout({ cartItems, user }) {
    // Calculate total price
    const totalPrice = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0; // Ensure price is a valid number
        return sum + price * item.quantity;
    }, 0);

    const handlePlaceOrder = async () => {
        if (!user) {
            alert('Please log in to place an order.');
            return;
        }
        console.log('User:', user); // Check if user object includes the id
        try {
            const response = await fetch('http://localhost:5002/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    cartItems,
                    totalPrice,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Order placed successfully! Order ID: ${data.orderId}`);
            } else {
                alert(data.message || 'Failed to place order.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('An error occurred while placing the order.');
        }
    };

    return (
        <div>
            <h1>Checkout Page</h1>
            <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
            <ul>
                {cartItems.map((item, index) => (
                    <li key={index}>
                        {item.name} - $
                        {item.price && !isNaN(item.price)
                            ? parseFloat(item.price).toFixed(2)
                            : 'N/A'}{' '}
                        x {item.quantity}
                    </li>
                ))}
            </ul>
            <button onClick={handlePlaceOrder}>Place Order</button>
        </div>
    );
}

export default Checkout;



