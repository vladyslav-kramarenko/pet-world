import React from 'react';
import './ImageGallery.css'; // Separate CSS for Image Gallery component

type ImageGalleryProps = {
    images: string[];
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
    return (
        <div className="image-gallery">
            {images.map((image, index) => (
                <img key={index} src={image} alt={`Gallery ${index}`} className="gallery-image" />
            ))}
        </div>
    );
};

export default ImageGallery;
