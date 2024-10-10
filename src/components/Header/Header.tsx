import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, getCurrentUser } from '@aws-amplify/auth'; // Import signOut and getCurrentUser from Amplify
import './Header.css';
import logo from "../../assets/logo_white.png"; // Create a CSS file for styling the header

const Header: React.FC = () => {
    const [user, setUser] = useState<any>(null); // State to track authenticated user
    const navigate = useNavigate();

    // Check if user is authenticated on component mount
    useEffect(() => {
        const checkUser = async () => {
            try {
                const currentUser = await getCurrentUser(); // Get the current user
                setUser(currentUser); // Set the user state
            } catch (err) {
                setUser(null); // If no user is authenticated, set the user to null
            }
        };
        checkUser();
    }, []);

    // Handle user sign out
    const handleSignOut = async () => {
        try {
            await signOut(); // Sign the user out
            setUser(null); // Clear the user state
            navigate('/login'); // Navigate to the login page
        } catch (err) {
            console.error('Error signing out:', err);
        }
    };

    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="logo">
                    <div className={"logo-wrapper"}>
                        <img src={logo} alt="PetWorld Logo"/>
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
                            <button onClick={handleSignOut} className="signout-button">
                                Sign Out
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
