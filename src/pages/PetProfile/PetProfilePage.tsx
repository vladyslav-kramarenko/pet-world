import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPetById } from '../../services/apiService';
import { Pet } from '../../types/Pet';
import PetDetails from '../../components/PetDetails/PetDetails';
import ImageGallery from '../../components/ImageGallery/ImageGallery';
import './PetProfilePage.css';
import defaultDog from '../../assets/dog.png';
import defaultCat from '../../assets/cat.jpg';
import defaultPet from '../../assets/paw.png'; // General default image for other types

const PetProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [pet, setPet] = useState<Pet | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getDefaultImage = (petType: string) => {
        switch (petType?.toLowerCase()) {
            case 'dog':
                return defaultDog;
            case 'cat':
                return defaultCat;
            default:
                return defaultPet; // General default for other pet types
        }
    };

    useEffect(() => {
        const fetchPet = async () => {
            try {
                if (id) {
                    const fetchedPet = await fetchPetById(id);
                    setPet(fetchedPet);
                } else {
                    setError('No ID found in URL params');
                }
            } catch (error) {
                setError('Error fetching pet details.');
            }
        };

        fetchPet();
    }, [id]);

    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!pet) return <p>Loading...</p>;

    return (
        <div className="pet-profile-container">
            <div className="pet-image-section">
                <img
                    src={pet.main_image_url || getDefaultImage(pet.pet_type)}
                    alt={pet.pet_name}
                    className="pet-image"
                />

                <div className="pet-description">
                    <h3>Description:</h3>
                    <p>{pet.description || 'No description available.'}</p>
                </div>

                {/* Image Gallery */}
                <ImageGallery images={pet.images || []} />
            </div>

            <div className="pet-details-section">
                <h2 className="pet-name">{pet.pet_name}</h2>
                <p className="pet-price">{pet.price ? `$${pet.price.toLocaleString()}` : 'Free'}</p>

                {/* Pet Details */}
                <PetDetails pet={pet} />
            </div>
        </div>
    );
};

export default PetProfilePage;
