import React, { useState } from 'react';
import { confirmSignUp, signUp } from '@aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [confirmationCode, setConfirmationCode] = useState<string>('');
    const [isConfirmationRequired, setIsConfirmationRequired] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            // AWS Amplify Sign Up with response type definition
            const result = await signUp({
                username,
                password,
                options: {
                    userAttributes: {
                        email,
                    },
                },
            });
            console.log('User sign-up result:', result);
            setIsConfirmationRequired(true); // To show the confirmation input
        } catch (err) {
            console.error('Error registering user:', err);
            setError('Registration failed. Please try again.');
        }
    };

    const handleConfirmation = async () => {
        try {
            // AWS Amplify Confirm Sign Up
            await confirmSignUp({
                username,
                confirmationCode,
            });

            navigate('/login'); // Redirect to login page after successful confirmation
        } catch (err) {
            console.error('Error confirming sign up:', err);
            setError('Confirmation failed, please try again.');
        }
    };

    return (
        <div>
            {!isConfirmationRequired ? (
                <>
                    <h2>Register</h2>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <button onClick={handleRegister}>Register</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </>
            ) : (
                <>
                    <h2>Confirm Registration</h2>
                    <input
                        type="text"
                        value={confirmationCode}
                        onChange={(e) => setConfirmationCode(e.target.value)}
                        placeholder="Confirmation Code"
                    />
                    <button onClick={handleConfirmation}>Confirm</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </>
            )}
        </div>
    );
};

export default RegisterPage;
