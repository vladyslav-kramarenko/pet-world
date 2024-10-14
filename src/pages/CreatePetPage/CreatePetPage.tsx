import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PetForm from '../../components/PetForm/PetForm';
import { Pet } from '../../types/Pet';
import { createPet } from '../../services/apiService';
import AuthService from '../../services/AuthService'; // Import AuthService
import './CreatePetPage.css';

const CreatePetPage: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null); // State to store userId
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch the current user and set the userId
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const user = await AuthService.getCurrentUser();
                if (user) {
                    setUserId(user.username);  // Set userId (assuming username is the userId)
                } else {
                    // Redirect to login if the user is not logged in
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                navigate('/login'); // Redirect if there's an error fetching the user
            } finally {
                setLoading(false);
            }
        };

        fetchUserId();
    }, [navigate]);

    // Handle pet submission
    const handleSubmit = async (petData: Pet) => {
        try {
            await createPet(petData);
            navigate('/'); // Navigate back to the main page after successful creation
        } catch (err) {
            setError('Error submitting pet. Please try again.');
        }
    };

    if (loading || !userId) return <p>Loading...</p>; // Wait for userId to load
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="pet-form-container">
            <h1>Create New Pet</h1>
            <PetForm
                initialPet={undefined} // No initial pet since we're creating
                onSubmit={handleSubmit}
                userId={userId} // Pass the userId to PetForm
            />
        </div>
    );
};

export default CreatePetPage;
