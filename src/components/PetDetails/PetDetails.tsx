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
                <p>Contact Person: {pet.contact_name}</p>
                <p>Phone Number: {pet.contact_phone}</p>
            </div>

            {/* Characteristics */}
            <div className="pet-characteristics">
                <h3>Characteristics</h3>
                <p><span>Type: </span>{pet.pet_type}</p>
                <p><span>Gender: </span>{pet.gender}</p>
                <p><span>Age: </span>{pet.exact_age}</p>
                <p><span>Location: </span>{pet.town}, {pet.province}, {pet.country}</p>
                <p><span>Owner: </span>Private Owner</p>
            </div>

            {/* Health Status */}
            <div className="pet-health">
                <h3>Health Status</h3>
                <div className="health-tags">
                    {pet.isSterilized && <span className="tag health-tag">Sterilized</span>}
                    {pet.isVaccinated && <span className="tag health-tag">Vaccinated</span>}
                    {pet.hasChip && <span className="tag health-tag">Chipped</span>}
                    {pet.hasParasiteTreatment && <span className="tag health-tag">Parasite Treated</span>}
                </div>
            </div>

            {/* Documents */}
            <div className="pet-documents">
                <h3>Documents</h3>
                <div className="document-tags">
                    {pet.hasVetPassport && <span className="tag document-tag">Vet Passport</span>}
                    {pet.hasPedigree && <span className="tag document-tag">Pedigree</span>}
                    {pet.hasFCICertificate && <span className="tag document-tag">FCI Certificate</span>}
                </div>
            </div>
        </div>
    );
};

export default PetDetails;
