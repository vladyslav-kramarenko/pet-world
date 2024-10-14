import React from 'react';
import './ImageGallery.css';

type ImageGalleryProps = {
    images: string[];
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
    return (
        <div className="image-gallery">
            {images.length > 0 ? (
                images.map((image, index) => (
                    <img key={index} src={image} alt={`Gallery ${index}`} className="gallery-image" />
                ))
            ) : (
                <p>No additional images available</p>
            )}
        </div>
    );
};

export default ImageGallery;
