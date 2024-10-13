import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import './LoginPage.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface LocationState {
    state?: {
        message?: string;
    };
}

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // For any messages passed from RegisterPage or redirection
    const [showPassword, setShowPassword] = useState<boolean>(false); // Toggle password visibility
    const navigate = useNavigate();
    const location = useLocation() as LocationState;

    // On component mount, check if there is a message passed via navigation state
    useEffect(() => {
        if (location.state?.message) {
            setMessage(location.state.message);
        }
    }, [location.state]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Clear any previous errors

        try {
            await AuthService.signIn(email, password);
            navigate('/profile');  // Navigate to profile page upon successful login
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password', { state: { email } }); // Navigate to Forgot Password page
    };

    return (
        <div className="loginPage-container">
            <div className="login-container">
                <h1>Login</h1>
                {/* Display message if passed from RegisterPage or redirect */}
                {message && <p style={{color: 'green'}}>{message}</p>}
                <form onSubmit={handleLogin}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label>Password:</label>
                    <div className="password-input-container">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password-visibility"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <button className="submit-button" type="submit">Login</button>
                </form>
                {error && <p style={{color: 'red'}}>{error}</p>}

                <p className="forgot-password-link" onClick={handleForgotPassword}>
                    Forgot your password?
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
