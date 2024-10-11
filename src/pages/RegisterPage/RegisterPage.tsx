import React, { useState } from 'react';
import { confirmSignUp, signUp } from '@aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css'; // Import CSS for styling

const RegisterPage: React.FC = () => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [username, setUsername] = useState<string>(''); // Username will be a combination of first and last name
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>(''); // Confirm Password
    const [confirmationCode, setConfirmationCode] = useState<string>('');
    const [isConfirmationRequired, setIsConfirmationRequired] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [agreement, setAgreement] = useState<boolean>(false); // Checkbox for agreement
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!agreement) {
            setError('Please agree to the terms and conditions.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setError(null);

        try {
            // Combine first and last name to create username
            const combinedUsername = `${firstName} ${lastName}`;
            setUsername(combinedUsername);

            // AWS Amplify Sign Up with response type definition
            const result = await signUp({
                username: combinedUsername,
                password,
                options: {
                    userAttributes: {
                        email,
                        'custom:location': location, // Custom attribute for location
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
        <div className="register-container">
            <div className="register-form">
                {!isConfirmationRequired ? (
                    <>
                        <h1>Welcome!</h1>
                        <p>Please enter your information to register</p>
                        <form>
                            <label>First Name*</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="First Name"
                                required
                            />
                            <label>Last Name*</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Last Name"
                                required
                            />
                            <label>Location*</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="City or Town"
                                required
                            />
                            <label>Email*</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                required
                            />
                            <label>Password*</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                            />
                            <label>Confirm Password*</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                required
                            />
                            <div className="agreement-checkbox">
                                <input
                                    type="checkbox"
                                    id="agreement"
                                    checked={agreement}
                                    onChange={(e) => setAgreement(e.target.checked)}
                                />
                                <label htmlFor="agreement">
                                    I agree to the <a href="#">Privacy Policy</a> and <a href="#">Terms of Use</a>.
                                </label>
                            </div>
                            <button type="button" onClick={handleRegister} className="register-button">
                                Register
                            </button>
                            {error && <p className="error-message">{error}</p>}
                        </form>
                    </>
                ) : (
                    <>
                        <h1>Confirm Registration</h1>
                        <p>Please enter the confirmation code sent to your email</p>
                        <input
                            type="text"
                            value={confirmationCode}
                            onChange={(e) => setConfirmationCode(e.target.value)}
                            placeholder="Confirmation Code"
                            required
                        />
                        <button type="button" onClick={handleConfirmation} className="confirm-button">
                            Confirm
                        </button>
                        {error && <p className="error-message">{error}</p>}
                    </>
                )}
                <p className="login-link">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
