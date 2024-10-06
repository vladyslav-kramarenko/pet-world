import React from 'react';
import { Pet } from '../../types/Pet';
import './PetCard.css';

import defaultDog from '../../assets/dog.png';
import defaultCat from '../../assets/cat.jpg';
import defaultPet from '../../assets/paw.png'; // General default image for other types

type PetCardProps = {
    pet: Pet;
};

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
    // Determine the default image based on pet type
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

    // Map age to categories like baby, adult, etc.
    const ageCategory = (age: string) => {
        switch (age.toLowerCase()) {
            case 'young':
                return 'Baby';
            case 'adult':
                return 'Adult';
            case 'senior':
                return 'Senior';
            default:
                return age; // If no category mapping, return the raw value
        }
    };

    // Determine if the price should be displayed or marked as "Free"
    const displayPrice: string = pet.price && pet.price > 0 ? `₴ ${pet.price.toLocaleString()}` : 'Free';

    return (
        <div className="pet-card">
            <img
                src={pet.main_image_url || getDefaultImage(pet.pet_type)} // Use pet image if available; otherwise, use default
                alt={pet.pet_name}
                className="pet-image"
            />
            <h3>{pet.pet_name}</h3>
            <p>{pet.description}</p>
            <div className="pet-info">
                <p>
                    <span className="icon-location"></span> {pet.province}, {pet.country}
                </p>
                <p>
                    <span className="icon-gender"></span> {pet.gender}
                </p>
                <p>
                    <span className="icon-age"></span> {ageCategory(pet.age)}
                </p>
            </div>
            <p className="pet-price">{displayPrice}</p>
            <a href={`/pets/${pet.pet_id}`}>View Profile</a><a href={`/edit/${pet.pet_id}`}>Edit</a>
        </div>
    );
};

export default PetCard;
