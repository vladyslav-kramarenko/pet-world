import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PetForm from '../../components/PetForm/PetForm';
import { Pet } from '../../types/Pet';
import { fetchPetById, updatePet, getUploadUrls, uploadImageToS3 } from '../../services/apiService';
import AuthService from '../../services/AuthService';  // Import the AuthService
import './EditPetPage.css';

const EditPetPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [pet, setPet] = useState<Pet | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState<string | null>(null);  // State to store userId
    const navigate = useNavigate();

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

    // Handle pet submission with file upload support
    const handleSubmit = async (petData: Pet, mainImageFile: File | undefined, additionalImageFiles: File[]) => {
        try {
            if (!id) {
                throw new Error('Pet ID is missing');
            }

            // Step 1: Get upload URLs
            const filenames = additionalImageFiles.map((file: File) => file.name);
            const signedUrls = await getUploadUrls(
                id,
                mainImageFile?.name || '',  // Ensure we pass an empty string if no main image
                filenames
            );

            // Step 2: Upload images to S3
            const mainImageUpload = mainImageFile ? await uploadImageToS3(mainImageFile, signedUrls.main_image.upload_url) : true;
            const additionalImageUploads = await Promise.all(
                additionalImageFiles.map((file) => uploadImageToS3(file, signedUrls[file.name].upload_url))
            );

            if (mainImageUpload && additionalImageUploads.every(Boolean)) {
                // Step 3: Update pet data with the S3 URLs
                const updatedPetData: Pet = {
                    ...petData,
                    main_image_url: mainImageFile ? signedUrls.main_image.file_url : pet?.main_image_url,  // Use the uploaded URL or keep the existing one
                    images: additionalImageFiles.length > 0
                        ? additionalImageFiles.map((file) => signedUrls[file.name].file_url)
                        : pet?.images || [],  // Keep existing images if none are uploaded
                };

                // Call the update API
                await updatePet(id, updatedPetData);
                navigate('/profile');
            } else {
                throw new Error('Image upload failed.');
            }
        } catch (err) {
            console.error('Error submitting pet:', err);
            setError('Error submitting pet. Please try again.');
        }
    };

    if (loading || !userId) return <p>Loading...</p>;  // Wait for userId to load
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="pet-form-container">
            <h1>Edit Pet</h1>
            <PetForm
                initialPet={pet || undefined}  // Pass existing pet data if editing
                onSubmit={handleSubmit}
                userId={userId}  // Pass the userId to PetForm
            />
        </div>
    );
};

export default EditPetPage;
