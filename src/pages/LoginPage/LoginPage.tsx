import React, {useState} from 'react';
import AuthService from '../../services/AuthService'; // Use the updated AuthService
import {useNavigate} from 'react-router-dom';
import './LoginPage.css';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await AuthService.signIn(email, password); // Using AuthService
            navigate('/profile');  // Navigate to profile page upon successful login
        } catch (err) {
            console.error('Login failed:', err);
            setError('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={"loginPage-container"}>
            <div className="login-container">
                <h1>Login</h1>
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
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                {error && <p style={{color: 'red'}}>{error}</p>}
            </div>
        </div>
    );
};

export default LoginPage;
