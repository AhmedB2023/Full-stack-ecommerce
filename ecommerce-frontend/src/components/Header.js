import { Link } from 'react-router-dom';
import '../styles/Header.css'

function Header({ user, handleLogout }) {
    return (
        <header>
            <nav className="navbar">
                <ul className="navbar-list">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/products">Products</Link></li>
                    <li><Link to="/cart">Cart</Link></li>
                    {!user ? (
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/signup">Sign Up</Link></li> {/* Add Signup Link */}
                        </>
                    ) : (
                        <>
                            <li>Hello, {user.username}</li>
                            <li>
                                <button onClick={handleLogout} className="logout-button">
                                    Logout
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;




