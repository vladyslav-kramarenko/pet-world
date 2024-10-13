import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import './Header.css';
import logo from "../../assets/logo_white.png";

const Header: React.FC = () => {
    const [user, setUser] = useState<any>(null); // State to track authenticated user
    const navigate = useNavigate();

    // Check if user is authenticated on component mount
    useEffect(() => {
        const checkUser = async () => {
            try {
                const currentUser = await AuthService.getCurrentUser(); // Get the current user
                setUser(currentUser);
            } catch (err) {
                console.error('Error checking user authentication:', err);
                setUser(null); // If no user is authenticated, set the user to null
            }
        };
        checkUser();
    }, []);

    // Handle user sign out
    const handleSignOut = async () => {
        try {
            await AuthService.signOut();
            setUser(null); // Clear the user state
            navigate('/login');
        } catch (err) {
            console.error('Error signing out:', err);
        }
    };

    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="logo">
                    <div className={"logo-wrapper"}>
                        <img src={logo} alt="PetWorld Logo" />
                    </div>
                    <h2>PetWorld</h2>
                </Link>
                <nav className="nav-links">
                    {!user ? (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/profile">Profile</Link>
                            <button onClick={handleSignOut}>Sign Out</button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
