import React, { useState, useEffect } from 'react';
import './PetForm.css';
import { Pet } from '../../types/Pet';
import { AGE_CATEGORIES } from "../../constants/petAttributes";
import { PROVINCES } from "../../constants/locations";

interface PetFormProps {
    initialPet?: Pet;
    onSubmit: (petData: Pet) => void;
    userId: string; // Assuming the user ID is passed as a prop
}

const PetForm: React.FC<PetFormProps> = ({ initialPet, onSubmit, userId }) => {
    const [petData, setPetData] = useState<Pet>({
        pet_name: initialPet?.pet_name || '',
        pet_type: initialPet?.pet_type || '',
        exact_age: initialPet?.exact_age || '', // Consistent use of exact_age
        age_category: initialPet?.age_category || 'unknown', // Default to unknown
        country: 'Canada',
        province: initialPet?.province || '',
        town: initialPet?.town || '',
        price: initialPet?.price || 0,
        description: initialPet?.description || '',
        main_image_url: initialPet?.main_image_url || '',
        images: initialPet?.images || [], // Initialize as an empty array if undefined
        owner_id: initialPet?.owner_id || userId, // Automatically set owner_id based on the userId prop
        contact_name: initialPet?.contact_name || '',
        contact_phone: initialPet?.contact_phone || '',
        hasChip: initialPet?.hasChip || false,
        hasPedigree: initialPet?.hasPedigree || false,
        hasFCICertificate: initialPet?.hasFCICertificate || false,
        hasParasiteTreatment: initialPet?.hasParasiteTreatment || false,
        hasVetPassport: initialPet?.hasVetPassport || false,
        isSterilized: initialPet?.isSterilized || false,
        isVaccinated: initialPet?.isVaccinated || false,
    });

    // Effect to auto-select age category based on the exact age
    useEffect(() => {
        const exactAge = Number(petData.exact_age);
        let category = 'unknown';
        if (!isNaN(exactAge)) {
            if (exactAge < 1) {
                category = 'baby';
            } else if (exactAge >= 1 && exactAge <= 2) {
                category = 'young';
            } else if (exactAge > 2 && exactAge <= 7) {
                category = 'adult';
            } else {
                category = 'senior';
            }
        }
        setPetData((prev) => ({ ...prev, age_category: category }));
    }, [petData.exact_age]);

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPetData({ ...petData, [name]: value });
    };

    // Handle checkbox changes
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setPetData({ ...petData, [name]: checked });
    };

    // Handle price change to ensure it is non-negative
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const validPrice = Math.max(Number(value), 0); // Ensure price is positive
        setPetData({ ...petData, price: validPrice });
    };

    // Handle main image file selection
    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file); // Create a URL for the selected file
            setPetData({ ...petData, main_image_url: imageUrl });
        }
    };

    // Handle additional images selection
    const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const imageUrls = Array.from(files).map(file => URL.createObjectURL(file)); // Create URLs for all selected files
            setPetData({ ...petData, images: imageUrls });
        }
    };

    // Handle age category change and clear exact age when manually changed
    const handleAgeCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setPetData((prev) => ({ ...prev, age_category: value, exact_age: '' }));
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(petData);
    };

    return (
        <form onSubmit={handleSubmit} className="pet-form">
            <div className="form-section">
                <div className="form-group">
                    <label>Pet Name*:</label>
                    <input name="pet_name" value={petData.pet_name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Type*:</label>
                    <input name="pet_type" value={petData.pet_type} onChange={handleChange} required />
                </div>

                {/* Exact Age and Age Category */}
                <div className="form-group">
                    <label>Exact Age (in years):</label>
                    <input
                        type="number"
                        name="exact_age"
                        value={petData.exact_age}
                        onChange={handleChange}
                        min="0"
                        placeholder="Enter exact age in years"
                    />
                </div>

                <div className="form-group">
                    <label>Age Category*:</label>
                    <select name="age_category" value={petData.age_category} onChange={handleAgeCategoryChange} required>
                        {AGE_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Country*:</label>
                    <input name="country" value={petData.country} readOnly />
                </div>

                <div className="form-group">
                    <label>Province*:</label>
                    <select name="province" value={petData.province} onChange={handleChange} required>
                        <option value="">Select Province</option>
                        {PROVINCES['Canada'].map((province) => (
                            <option key={province} value={province}>
                                {province}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Town:</label>
                    <input name="town" value={petData.town} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Price*:</label>
                    <input
                        type="number"
                        name="price"
                        value={petData.price}
                        onChange={handlePriceChange}
                        min="0"
                        required
                    />
                </div>

                {/* Main Image Picker */}
                <div className="form-group">
                    <label>Main Image*:</label>
                    <input type="file" accept="image/*" onChange={handleMainImageChange} required />
                    {petData.main_image_url && (
                        <img src={petData.main_image_url} alt="Main Image" width="100" />
                    )}
                </div>

                {/* Additional Images Picker */}
                <div className="form-group">
                    <label>Additional Images:</label>
                    <input type="file" accept="image/*" multiple onChange={handleAdditionalImagesChange} />
                    {petData.images?.length > 0 && ( // Use optional chaining here
                        <div className="image-preview">
                            {petData.images.map((img, index) => (
                                <img key={index} src={img} alt={`Additional Image ${index + 1}`} width="100" />
                            ))}
                        </div>
                    )}
                </div>

                <div className="form-group full-width">
                    <label>Description:</label>
                    <textarea name="description" value={petData.description} onChange={handleChange} />
                </div>
            </div>

            {/* Contact Information */}
            <div className="form-section">
                <div className="form-group">
                    <label>Contact Name*:</label>
                    <input name="contact_name" value={petData.contact_name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Contact Phone*:</label>
                    <input name="contact_phone" value={petData.contact_phone} onChange={handleChange} required />
                </div>
            </div>

            <button type="submit" className="submit-button">Submit</button>
        </form>
    );
};

export default PetForm;
