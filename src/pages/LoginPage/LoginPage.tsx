import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import './LoginPage.css';

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
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </div>
        </div>
    );
};

export default LoginPage;
