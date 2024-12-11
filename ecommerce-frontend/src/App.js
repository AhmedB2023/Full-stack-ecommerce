import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import Checkout from './pages/Checkout';
import Reserve from './pages/Reserve';

function App() {
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);

    const handleAddToCart = (product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find((item) => item.id === product.id);
            if (existingProduct) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    const handleRemoveFromCart = (productToRemove) => {
        setCart((prevCart) =>
            prevCart
                .map((item) =>
                    item.id === productToRemove.id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const handleSignup = async (username, password, email) => {
        try {
            const response = await fetch('http://localhost:5002/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, email }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
            } else {
                alert(data.message || 'Signup failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('An error occurred during signup.');
        }
    };

    const handleLogin = async (username, password, navigate) => {
        try {
            const response = await fetch('http://localhost:5002/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.user && data.user.id) {
                    setUser(data.user);
                    console.log('User after login:', data.user);
                    alert('Login successful!');
                    navigate('/');
                } else {
                    console.error('Login response missing user ID:', data);
                    alert('Invalid login response. Please try again.');
                }
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login.');
        }
    };

    const handleLogout = () => {
        setUser(null);
        alert('You have successfully logged out.');
    };

    return (
        <Router>
            <Header user={user} handleLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route
                    path="/products"
                    element={
                        <ProtectedRoute user={user}>
                            <Products handleAddToCart={handleAddToCart} cart={cart} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute user={user}>
                            <Checkout cartItems={cart} user={user} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/cart"
                    element={<Cart cartItems={cart} handleRemoveFromCart={handleRemoveFromCart} />}
                />
                <Route
                    path="/login"
                    element={
                        <Login
                            handleLogin={(username, password, navigate) => {
                                handleLogin(username, password, navigate);
                            }}
                        />
                    }
                />
                <Route path="/signup" element={<Signup handleSignup={handleSignup} />} />
                <Route path="/reserve" element={<Reserve />} />
            </Routes>
        </Router>
    );
}

export default App;




