import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import PetForm from '../../components/PetForm/PetForm';
import {Pet} from '../../types/Pet';
import {createPet, getUploadUrls, uploadImageToS3} from '../../services/apiService';
import AuthService from '../../services/AuthService';
import './CreatePetPage.css';
import {v4 as uuidv4} from 'uuid';  // Generate unique pet IDs

const CreatePetPage: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const user = await AuthService.getCurrentUser();
                if (user) {
                    setUserId(user.username); // Assuming username is userId
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserId();
    }, [navigate]);

    const handleSubmit = async (petData: Pet, mainImage: File, additionalImages: File[]) => {
        try {
            // Step 1: Generate pet ID and get signed URLs for image uploads
            const petId = uuidv4();  // Generate unique pet ID
            const imageFilenames = additionalImages.map((img) => img.name);
            const signedUrls = await getUploadUrls(petId, mainImage.name, imageFilenames);
            // console.log("signedUrls:");
            console.log(signedUrls)
            // Step 2: Upload images to S3
            const mainImageUpload = await uploadImageToS3(mainImage, signedUrls.main_image.upload_url);
            const additionalImageUploads = await Promise.all(
                additionalImages.map((img) => uploadImageToS3(img, signedUrls[img.name].upload_url))
            );

            if (mainImageUpload && additionalImageUploads.every(Boolean)) {
                // Step 3: Create pet with the S3 URLs
                const newPetData: Pet = {
                    ...petData,
                    pet_id: petId,  // Ensure the pet_id is included
                    main_image_url: signedUrls.main_image.file_url,
                    images: additionalImages.map((img) => signedUrls[img.name].file_url),  // Gallery image URLs
                };
                console.log("Submitting pet data:", newPetData);
                await createPet(newPetData);
                navigate('/profile');
            } else {
                throw new Error('Image upload failed.');
            }
        } catch (err) {
            console.error('Error submitting pet:', err);
            setError('Error submitting pet. Please try again.');
        }
    };

    if (loading || !userId) return <p>Loading...</p>;
    if (error) return <p style={{color: 'red'}}>{error}</p>;

    return (
        <div className="pet-form-container">
            <h1>Create New Pet</h1>
            <PetForm
                initialPet={undefined}
                onSubmit={handleSubmit}
                userId={userId}
            />
        </div>
    );
};

export default CreatePetPage;
