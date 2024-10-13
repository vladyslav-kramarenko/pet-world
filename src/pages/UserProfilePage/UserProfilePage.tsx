import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import './UserProfilePage.css'; // Import the CSS file for styling

const UserProfilePage: React.FC = () => {
    const [userDetails, setUserDetails] = useState<any>(null);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    // Fetch the user details from the server
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userAttributes = await AuthService.getCurrentUserAttributes();
                setUserDetails(userAttributes);
                setFirstName(userAttributes.given_name || '');
                setLastName(userAttributes.family_name || '');
            } catch (err) {
                console.error('Error fetching user details:', err);
                setError('Unable to fetch user details. Please try again.');
                navigate('/login', { state: { message: 'Please log in to access your profile.' } });
            }
        };

        fetchUserDetails();
    }, [navigate]);

    // Handle saving the changes
    const handleSaveChanges = async () => {
        try {
            await AuthService.updateUserAttributes(firstName, lastName);
            setSuccessMessage('Profile updated successfully.');
            setTimeout(() => setSuccessMessage(null), 5000); // Remove the success message after 5 seconds
        } catch (err) {
            setError('Failed to update profile.');
        }
    };

    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!userDetails) return <p>Loading user details...</p>;

    return (
        <div className="user-profile-container">
            <div className="user-profile">
                <h1>Welcome, {firstName}</h1>
                <p>Email: {userDetails.email}</p>

                <label>
                    First Name:
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="profile-input"
                    />
                </label>
                <br />
                <label>
                    Last Name:
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="profile-input"
                    />
                </label>
                <br />
                <button onClick={handleSaveChanges} className="save-button">Save Changes</button>

                {successMessage && <p className="success-message">{successMessage}</p>}
            </div>
        </div>
    );
};

export default UserProfilePage;
