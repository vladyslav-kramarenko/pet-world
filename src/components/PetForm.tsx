// src/components/PetForm.tsx

import React, { useState } from 'react';
import { Pet } from '../types/Pet';

type PetFormProps = {
    initialPet?: Pet;  // Initial values for the pet form (optional)
    onSubmit: (petData: Pet) => void;
};

const PetForm: React.FC<PetFormProps> = ({ initialPet, onSubmit }) => {
    // Set up form state with initial values or defaults
    const [petData, setPetData] = useState<Pet>({
        pet_id: initialPet?.pet_id || '',
        pet_name: initialPet?.pet_name || '',
        pet_type: initialPet?.pet_type || '',
        age: initialPet?.age || 'Unknown',
        country: initialPet?.country || '',
        province: initialPet?.province || '',
        town: initialPet?.town || '',
        description: initialPet?.description || '',
        price: initialPet?.price || 0,
        gender: initialPet?.gender || 'Unknown',
        health_status: initialPet?.health_status || [],  // Default to empty array
        documents: initialPet?.documents || [],          // Default to empty array
        image_url: initialPet?.image_url || '',
    });

    // Handle changes to form inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPetData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle changes to array inputs like health_status and documents
    const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof Pet) => {
        const { value } = e.target;
        const arrayValues = value.split(',').map((item) => item.trim());  // Split by comma and trim whitespace
        setPetData((prev) => ({ ...prev, [fieldName]: arrayValues }));
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(petData);
    };

    return (
        <form onSubmit={handleSubmit}>
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

            <label>Gender:</label>
            <input type="text" name="gender" value={petData.gender} onChange={handleChange} />

            <label>Health Status:</label>
            <input
                type="text"
                name="health_status"
                value={petData.health_status.join(', ')} // Join array into string for display
                onChange={(e) => handleArrayChange(e, 'health_status')} // Update array field
            />

            <label>Documents:</label>
            <input
                type="text"
                name="documents"
                value={petData.documents.join(', ')} // Join array into string for display
                onChange={(e) => handleArrayChange(e, 'documents')} // Update array field
            />

            <label>Image URL:</label>
            <input type="text" name="image_url" value={petData.image_url} onChange={handleChange} />

            <label>Description:</label>
            <textarea name="description" value={petData.description} onChange={handleChange}></textarea>

            <button type="submit">Submit</button>
        </form>
    );
};

export default PetForm;
