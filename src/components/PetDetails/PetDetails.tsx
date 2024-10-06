import React from 'react';
import { Pet } from '../../types/Pet';
import './PetDetails.css';

type PetDetailsProps = {
    pet: Pet;
};

const PetDetails: React.FC<PetDetailsProps> = ({ pet }) => {
    return (
        <div className="pet-details">
            {/* Contact Information */}
            <div className="pet-contact">
                <h3>Contact</h3>
                <p>Contact Person: Maria</p>
                <p>Phone Number: +1 (123) 456-7890</p>
            </div>

            {/* Characteristics */}
            <div className="pet-characteristics">
                <h3>Characteristics</h3>
                <p><span>Type: </span>{pet.pet_type}</p>
                <p><span>Breed: </span>Unknown</p>
                <p><span>Gender: </span>{pet.gender}</p>
                <p><span>Age: </span>{pet.age}</p>
                <p><span>Color: </span>Brown</p>
                <p><span>Location: </span>{pet.province}, {pet.country}</p>
                <p><span>Owner: </span>Private Owner</p>
            </div>

            {/* Health Status */}
            <div className="pet-health">
                <h3>Health Status</h3>
                {pet.health_status?.map((status, index) => (
                    <span key={index} className="tag health-tag">{status}</span>
                ))}
            </div>

            {/* Documents */}
            <div className="pet-documents">
                <h3>Documents</h3>
                {pet.documents?.map((doc, index) => (
                    <span key={index} className="tag document-tag">{doc}</span>
                ))}
            </div>
        </div>
    );
};

export default PetDetails;
