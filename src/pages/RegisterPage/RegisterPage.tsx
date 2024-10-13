import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import AuthService from '../../services/AuthService';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import './RegisterPage.css'; // Import CSS for styling

const RegisterPage: React.FC = () => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>(''); // Confirm Password
    const [confirmationCode, setConfirmationCode] = useState<string>('');
    const [isConfirmationRequired, setIsConfirmationRequired] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [agreement, setAgreement] = useState<boolean>(false); // Checkbox for agreement
    const [showPassword, setShowPassword] = useState<boolean>(false); // Toggle password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false); // Toggle confirm password visibility
    const [loading, setLoading] = useState<boolean>(false); // Loading state for form submission
    const [resendCooldown, setResendCooldown] = useState<number>(0); // Cooldown for resending code

    const navigate = useNavigate();

    // Cooldown Timer Effect
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const validatePassword = (password: string) =>
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,}$/.test(password);

    // Register user
    const handleRegister = async () => {
        if (!agreement) {
            setError('Please agree to the terms and conditions.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (!validatePassword(password)) {
            setError('Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.');
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const result = await AuthService.signUp(email, password, firstName, lastName);
            console.log('User sign-up result:', result);
            setIsConfirmationRequired(true); // Proceed to confirmation stage
        } catch (err: any) {
            if (err.name === 'UsernameExistsException' || err.code === 'UsernameExistsException') {
                navigate('/login', {state: {message: 'This email is already registered. Please log in.'}});
            } else {
                console.error('Error registering user:', err);
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };


    // Confirm user registration
    const handleConfirmation = async () => {
        try {
            setLoading(true);
            await AuthService.confirmSignUp(email, confirmationCode);
            setError('Confirmation successful! Please log in.');
            setTimeout(() => navigate('/login'), 2000); // After success, navigate to login after a short delay
        } catch (err) {
            console.error('Error confirming sign up:', err);
            setError('Confirmation failed, please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Resend confirmation code (with cooldown)
    const handleResendCode = async () => {
        if (resendCooldown === 0) {
            try {
                await AuthService.resendSignUp(email);
                setResendCooldown(60); // Set 60 seconds cooldown before resending
            } catch (err) {
                console.error('Error resending code:', err);
                setError('Failed to resend confirmation code. Please try again later.');
            }
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
                            <label>Email*</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                required
                            />
                            <label>Password*</label>
                            <div className="password-input-container">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password-visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash/> : <FaEye/>}
                                </button>
                            </div>
                            {password && (
                                <p className="password-requirements">
                                    Password must be at least 8 characters long, include an uppercase letter, a number,
                                    and a special character.
                                </p>
                            )}
                            <label>Confirm Password*</label>
                            <div className="password-input-container">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm Password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password-visibility"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash/> : <FaEye/>}
                                </button>
                            </div>
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
                            <button type="button" onClick={handleRegister} className="register-button"
                                    disabled={loading}>
                                {loading ? 'Registering...' : 'Register'}
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
                        <button type="button" onClick={handleConfirmation} className="confirm-button"
                                disabled={loading}>
                            {loading ? 'Confirming...' : 'Confirm'}
                        </button>
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={resendCooldown > 0}
                            className="resend-button"
                        >
                            {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend Confirmation Code'}
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
