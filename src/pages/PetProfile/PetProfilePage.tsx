import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPetById } from '../../services/apiService';
import { Pet } from '../../types/Pet';
import './PetProfilePage.css';
import defaultDog from '../../assets/dog.png';
import defaultCat from '../../assets/cat.jpg';
import defaultPet from '../../assets/paw.png'; // General default image for other types

const PetProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    console.log('Extracted ID from params:', id);  // Log to confirm the ID is correctly extracted

    const [pet, setPet] = useState<Pet | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getDefaultImage = (petType: string) => {
        switch (petType.toLowerCase()) {
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
                    console.log(`Fetching pet with ID: ${id}`); // Log ID before making the API call
                    const fetchedPet = await fetchPetById(id);
                    console.log('Fetched pet details:', fetchedPet); // Log the fetched details
                    setPet(fetchedPet);
                } else {
                    console.warn('No ID found in URL params');
                }
            } catch (error) {
                console.error('Error fetching pet details:', error); // Log any errors
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
                {/* Render the main image */}
                <img
                    src={pet.main_image_url || getDefaultImage(pet.pet_type)}
                    alt={pet.pet_name}
                    className="pet-image"
                />

                {/* Pet Description Moved Here */}
                <div className="pet-description">
                    <h3>Description:</h3>
                    <p>{pet.description}</p>
                </div>

                {/* Render the image gallery */}
                <div className="pet-gallery">
                    {pet.images?.map((imageUrl, index) => (
                        <img
                            key={index}
                            src={imageUrl}
                            alt={`Gallery ${index}`}
                            className="pet-thumbnail"
                        />
                    ))}
                </div>
            </div>

            <div className="pet-details-section">
                <h2 className="pet-name">{pet.pet_name}</h2>
                <p className="pet-price">{pet.price ? `$ ${pet.price.toLocaleString()}` : 'Free'}</p>

                {/* Pet Characteristics */}
                <ul className="pet-characteristics">
                    <li>Type: {pet.pet_type}</li>
                    <li>Age: {pet.age}</li>
                    <li><span className="icon-location"></span>: {`${pet.town}, ${pet.province}, ${pet.country}`}</li>
                    <li><span className="icon-gender"></span>: {pet.gender}</li>
                </ul>
            </div>
        </div>
    );
};

export default PetProfilePage;
