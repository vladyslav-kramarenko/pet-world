import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import './ForgotPasswordPage.css';

interface LocationState {
    state?: {
        email?: string;
    };
}

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [codeSent, setCodeSent] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation() as LocationState;

    // Pre-fill email from login page if passed
    React.useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email);
        }
    }, [location.state]);

    const handleForgotPassword = async () => {
        try {
            const result = await AuthService.forgotPassword(email);

            // Check the response to see if the next step requires code confirmation
            if (result.nextStep?.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
                setCodeSent(true);
                setSuccessMessage(`A password reset code has been sent to: ${result.nextStep.codeDeliveryDetails.destination}`);
                setErrorMessage(null);
            }
        } catch (error) {
            setErrorMessage('Error occurred. Please check your email address and try again.');
            setSuccessMessage(null);
        }
    };

    return (
        <div className="forgotPassword-container">
            <div className="forgot-password-box">
                <h1>Reset Password</h1>
                <p>Enter your email address and we will send you a reset code.</p>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
                <button onClick={handleForgotPassword} className="reset-button">
                    {codeSent ? 'Resend Code' : 'Send Reset Code'}
                </button>
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
