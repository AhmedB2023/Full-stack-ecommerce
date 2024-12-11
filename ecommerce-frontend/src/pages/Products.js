import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Products({ handleAddToCart }) {
    const [products, setProducts] = useState([]); // State to store products
    const [searchQuery, setSearchQuery] = useState(''); // State for search input
    const [error, setError] = useState(null); // State for error messages
    const navigate = useNavigate(); // Hook to navigate programmatically

    // Fetch products from the backend
    const fetchProducts = async (query = '') => {
        try {
            const response = await fetch(`http://localhost:5002/api/search?query=${query}`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError(err.message);
        }
    };

    // Handle search input change
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        fetchProducts(query); // Fetch products matching the search query
    };

    // Handle Reserve button click
    const handleReserveClick = (productId) => {
        navigate(`/reserve?productId=${productId}`); // Navigate to the reserve page with the product ID
    };

    // Fetch all products on initial load
    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div>
            <h1>Products Page</h1>
            {/* Search Input */}
            <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={handleSearch}
                style={{
                    padding: '10px',
                    width: '100%',
                    maxWidth: '400px',
                    marginBottom: '20px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                }}
            />
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <ul>
                    {products.map((product) => (
                        <li key={product.id}>
                            <div>
                                {product.name} - ${product.price}
                            </div>
                            <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
                            <button onClick={() => handleReserveClick(product.id)}>Reserve</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Products;





