import React, { useState } from 'react';

function Reserve() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState('');

    const handleReserve = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5002/api/reserve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, productId, quantity }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`Reservation successful! Your reservation ID is ${data.reservationId}`);
            } else {
                setMessage(data.message || 'Failed to create reservation.');
            }
        } catch (error) {
            console.error('Error creating reservation:', error);
            setMessage('An error occurred while creating the reservation.');
        }
    };

    return (
        <div>
            <h1>Reserve a Product</h1>
            <form onSubmit={handleReserve}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Phone:</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Product ID:</label>
                    <input
                        type="text"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Quantity:</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min="1"
                        required
                    />
                </div>
                <button type="submit">Reserve</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Reserve;
