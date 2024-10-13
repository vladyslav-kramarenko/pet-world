import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import PetCard from '../../components/PetCard/PetCard'; // Import PetCard component
import './UserProfilePage.css';
import { fetchPetsByOwner } from "../../services/apiService";

const UserProfilePage: React.FC = () => {
    const [userDetails, setUserDetails] = useState<any>(null);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [pets, setPets] = useState<any[]>([]); // Store pets owned by the user
    const navigate = useNavigate();

    // Fetch the user details from the server
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userAttributes = await AuthService.getCurrentUserAttributes();
                setUserDetails(userAttributes);
                setFirstName(userAttributes.given_name || '');
                setLastName(userAttributes.family_name || '');
                const ownedPets = await fetchPetsByOwner(userAttributes.sub); // Fetch pets by owner
                setPets(ownedPets);
            } catch (err: any) {
                console.error('Error fetching user details:', err);
                setError('Unable to fetch user details. Please try again.');
                if (err.message.includes('User needs to be authenticated')) {
                    navigate('/login', { state: { message: 'Please log in to access your profile.' } });
                }
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

    // Handle edit pet click
    const handleEditPet = (petId: string) => {
        navigate(`/pets/${petId}/edit`);
    };

    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!userDetails) return <p>Loading user details...</p>;

    return (
        <div className="profile-page-container">
            <div className="profile-section">
                <h1>Profile Settings</h1>
                <div className="profile-details">
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
                    <label>
                        Last Name:
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="profile-input"
                        />
                    </label>
                    <button onClick={handleSaveChanges} className="save-button">Save Changes</button>
                    {successMessage && <p className="success-message">{successMessage}</p>}
                </div>
            </div>

            <div className="pets-section">
                <h2>Your Pets</h2>
                <div className="pets-grid">
                    {pets.map(pet => (
                        <PetCard
                            key={pet.pet_id}
                            pet={pet}
                            onClick={() => handleEditPet(pet.pet_id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
