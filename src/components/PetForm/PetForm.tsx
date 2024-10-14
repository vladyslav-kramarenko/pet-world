import React, {useEffect, useState} from 'react';
import './PetForm.css';
import { Pet } from '../../types/Pet';
import { AGE_CATEGORIES, PET_TYPES } from "../../constants/petAttributes";
import { PROVINCES } from "../../constants/locations";

interface PetFormProps {
    initialPet?: Pet;
    onSubmit: (petData: Pet, mainImage: File, additionalImages: File[]) => void;
    userId: string;
}

const PetForm: React.FC<PetFormProps> = ({ initialPet, onSubmit, userId }) => {
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [additionalImages, setAdditionalImages] = useState<File[]>([]);

    const [petData, setPetData] = useState<Pet>({
        pet_name: initialPet?.pet_name || '',
        pet_type: initialPet?.pet_type || '',
        gender: initialPet?.gender || '',
        exact_age: initialPet?.exact_age || '',
        age_category: initialPet?.age_category || 'unknown',
        country: 'Canada',
        province: initialPet?.province || '',
        town: initialPet?.town || '',
        price: initialPet?.price || 0,
        description: initialPet?.description || '',
        main_image_url: initialPet?.main_image_url || '',
        images: initialPet?.images || [],
        owner_id: initialPet?.owner_id || userId,
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
                category = 'Baby';
            } else if (exactAge >= 1 && exactAge <= 2) {
                category = 'Young';
            } else if (exactAge > 2 && exactAge <= 7) {
                category = 'Adult';
            } else {
                category = 'Senior';
            }
        }
        setPetData((prev) => ({ ...prev, age_category: category }));
    }, [petData.exact_age]);
    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPetData({ ...petData, [name]: value });
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setMainImage(e.target.files[0]);
        }
    };

    const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAdditionalImages(Array.from(e.target.files));
        }
    };

    // Handle age category change and clear exact age when manually changed
    const handleAgeCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setPetData((prev) => ({ ...prev, age_category: value, exact_age: '' }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mainImage) {
            onSubmit(petData, mainImage, additionalImages);  // Pass the petData, main image, and gallery images
        } else {
            alert("Main image is required.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="pet-form">
            <div className="form-section">
                <div className="form-group">
                    <label className="required">Pet Name:</label>
                    <input name="pet_name" value={petData.pet_name} onChange={handleChange} required/>
                </div>

                <div className="form-group">
                    <label className="required">Type:</label>
                    <select name="pet_type" value={petData.pet_type} onChange={handleChange} required>
                        {PET_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

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
                    <label className="required">Age Category:</label>
                    <select name="age_category" value={petData.age_category} onChange={handleAgeCategoryChange}
                            required>
                        {AGE_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="required">Gender:</label>
                    <select name="gender" value={petData.gender} onChange={handleChange} required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="required">Country:</label>
                    <input name="country" value={petData.country} readOnly/>
                </div>

                <div className="form-group">
                    <label className="required">Province:</label>
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
                    <input name="town" value={petData.town} onChange={handleChange}/>
                </div>

                <div className="form-group">
                    <label className="required">Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={petData.price}
                        onChange={handleChange}
                        min="0"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Main Image*:</label>
                    <input type="file" accept="image/*" onChange={handleMainImageChange} required/>
                    {mainImage && <img src={URL.createObjectURL(mainImage)} alt="Main Image" width="100"/>}
                </div>

                <div className="form-group">
                    <label>Additional Images:</label>
                    <input type="file" accept="image/*" multiple onChange={handleAdditionalImagesChange}/>
                    <div className="image-preview">
                        {additionalImages.map((img, index) => (
                            <img key={index} src={URL.createObjectURL(img)} alt={`Additional Image ${index + 1}`}
                                 width="100"/>
                        ))}
                    </div>
                </div>

                <div className="form-group full-width">
                    <label>Description:</label>
                    <textarea name="description" value={petData.description} onChange={handleChange}/>
                </div>
            </div>

            <div className="form-section">
                <div className="form-group">
                    <label className="required">Contact Name:</label>
                    <input name="contact_name" value={petData.contact_name} onChange={handleChange} required/>
                </div>
                <div className="form-group">
                    <label className="required">Contact Phone:</label>
                    <input name="contact_phone" value={petData.contact_phone} onChange={handleChange} required />
                </div>
            </div>

            <button type="submit" className="submit-button">Submit</button>
        </form>
    );
};

export default PetForm;
