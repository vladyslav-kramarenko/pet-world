import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PetForm from '../../components/PetForm/PetForm';
import { Pet } from '../../types/Pet';
import { fetchPetById, updatePet, createPet } from '../../services/apiService';
import AuthService from '../../services/AuthService';  // Import the AuthService
import './EditPetPage.css';

const EditPetPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [pet, setPet] = useState<Pet | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState<string | null>(null);  // State to store userId
    const navigate = useNavigate();

    const isCreateMode = !id; // If no id, assume we're creating a new pet

    // Fetch the current user and set the userId
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const user = await AuthService.getCurrentUser();
                if (user) {
                    setUserId(user.username);  // Set userId (assuming username is the userId)
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUserId();
    }, []);

    // Fetch the pet if editing
    useEffect(() => {
        if (id) {
            const fetchPet = async () => {
                try {
                    const petData = await fetchPetById(id);
                    setPet(petData);
                } catch (err) {
                    setError('Error fetching pet data.');
                } finally {
                    setLoading(false);
                }
            };
            fetchPet();
        } else {
            setLoading(false); // Skip loading if it's in create mode
        }
    }, [id]);

    // Handle pet submission (both create and edit)
    const handleSubmit = async (petData: Pet) => {
        try {
            if (isCreateMode) {
                await createPet(petData);
            } else {
                await updatePet(id as string, petData);
            }
            navigate('/'); // Navigate back to the main page
        } catch (err) {
            setError('Error submitting pet. Please try again.');
        }
    };

    if (loading || !userId) return <p>Loading...</p>;  // Wait for userId to load
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="pet-form-container">
            <h1>{isCreateMode ? 'Create New Pet' : 'Edit Pet'}</h1>
            <PetForm
                initialPet={pet || undefined}  // For create mode, pass undefined
                onSubmit={handleSubmit}
                userId={userId}  // Pass the userId to PetForm
            />
        </div>
    );
};

export default EditPetPage;
