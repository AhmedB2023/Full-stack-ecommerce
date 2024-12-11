import React from "react";
import { useNavigate } from "react-router-dom";

function Cart({ cartItems, handleRemoveFromCart }) {
    const navigate = useNavigate(); // Hook for navigation

    // Calculate total price
    const totalPrice = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0; // Ensure price is a valid number
        return sum + price * item.quantity;
    }, 0);

    return (
        <div>
            <h1>Cart Page</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    <ul>
                        {cartItems.map((item, index) => (
                            <li key={index}>
                                {item.name} - $
                                {item.price
                                    ? parseFloat(item.price).toFixed(2)
                                    : "N/A"}{" "}
                                x {item.quantity}
                                <button onClick={() => handleRemoveFromCart(item)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
                    <button onClick={() => navigate("/checkout")}>
                        Checkout
                    </button>
                </div>
            )}
        </div>
    );
}

export default Cart;




