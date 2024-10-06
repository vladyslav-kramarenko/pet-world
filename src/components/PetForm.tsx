// src/components/PetForm.tsx

import React, { useState } from 'react';
import { Pet } from '../types/Pet';
import './PetForm.css';

type PetFormProps = {
    initialPet?: Pet;  // Initial pet data, optional for new pets
    onSubmit: (petData: Pet) => void;
};

const PetForm: React.FC<PetFormProps> = ({ initialPet, onSubmit }) => {
    const [petData, setPetData] = useState<Pet>({
        pet_id: initialPet?.pet_id || '',
        pet_name: initialPet?.pet_name || '',
        pet_type: initialPet?.pet_type || '',
        age: initialPet?.age || 'Baby',
        country: initialPet?.country || '',
        province: initialPet?.province || '',
        town: initialPet?.town || '',
        description: initialPet?.description || '',
        price: initialPet?.price || 0,
        health_status: initialPet?.health_status || ['Not specified'],
        documents: initialPet?.documents || ['No documents'],
        main_image_url: initialPet?.main_image_url || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPetData((prev) => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Pet) => {
        const { value } = e.target;
        setPetData((prev) => ({
            ...prev,
            [field]: value.split(',').map((item) => item.trim()),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(petData);
    };

    return (
        <form onSubmit={handleSubmit} className="pet-form">
            <label>Pet Name:</label>
            <input type="text" name="pet_name" value={petData.pet_name} onChange={handleChange} required />

            <label>Type:</label>
            <input type="text" name="pet_type" value={petData.pet_type} onChange={handleChange} required />

            <label>Age:</label>
            <input type="text" name="age" value={petData.age} onChange={handleChange} required />

            <label>Country:</label>
            <input type="text" name="country" value={petData.country} onChange={handleChange} required />

            <label>Province:</label>
            <input type="text" name="province" value={petData.province} onChange={handleChange} required />

            <label>Town:</label>
            <input type="text" name="town" value={petData.town} onChange={handleChange} required />

            <label>Price:</label>
            <input type="number" name="price" value={petData.price} onChange={handleChange} required />

            <label>Health Status (comma separated):</label>
            <input
                type="text"
                name="health_status"
                value={petData.health_status.join(', ')}
                onChange={(e) => handleArrayChange(e, 'health_status')}
                required
            />

            <label>Documents (comma separated):</label>
            <input
                type="text"
                name="documents"
                value={petData.documents.join(', ')}
                onChange={(e) => handleArrayChange(e, 'documents')}
                required
            />

            <label>Description:</label>
            <textarea name="description" value={petData.description} onChange={handleChange} required></textarea>

            <label>Image URL:</label>
            <input type="text" name="image_url" value={petData.main_image_url} onChange={handleChange} />

            <button type="submit">Submit</button>
        </form>
    );
};

export default PetForm;
