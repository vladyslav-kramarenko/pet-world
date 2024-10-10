import React, { useState, useEffect } from 'react';
import { fetchPets } from '../../services/apiService';
import PetCard from '../../components/PetCard/PetCard';
import { PET_TYPES } from '../../constants/petAttributes';
import { PROVINCES } from "../../constants/locations";
import './HomePage.css';
import heroImage from '../../assets/cat.jpg'; // Import the hero image
// import heroImage from '../../assets/hero-image.png'; // Import the hero image
// import dogIcon from '../../assets/dog-icon.png'; // Import dog image
// import catIcon from '../../assets/cat-ichero-image.png'; // Import the hero image
import dogIcon from '../../assets/cat.jpg'; // Import dog image
import catIcon from '../../assets/cat.jpg'; // Import cat image

const HomePage: React.FC = () => {
    const [petStats, setPetStats] = useState<{ [key: string]: number }>({});
    const [newestPets, setNewestPets] = useState<any[]>([]);
    const [category, setCategory] = useState('');
    const [province, setProvince] = useState('');

    useEffect(() => {
        const fetchPetData = async () => {
            try {
                const pets = await fetchPets();
                const stats = pets.reduce((acc: { [key: string]: number }, pet) => {
                    const type = pet.pet_type;
                    acc[type] = acc[type] ? acc[type] + 1 : 1;
                    return acc;
                }, {});
                setPetStats(stats);
                setNewestPets(pets.slice(0, 4)); // Show the first 4 newest pets
            } catch (err) {
                console.error('Error fetching pets:', err);
            }
        };

        fetchPetData();
    }, []);

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(event.target.value);
    };

    const handleProvinceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setProvince(event.target.value);
    };

    const handleSearch = () => {
        console.log(`Searching pets for category: ${category} and province: ${province}`);
    };

    return (
        <div className="homepage">
            <header className="hero-section">
                <div className="hero-content">
                    <h1>Where the Best Friendship Begins</h1>
                    <div className="search-fields">
                        <select value={category} onChange={handleCategoryChange}>
                            <option value="">Select Pet Type</option>
                            {PET_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        <select value={province} onChange={handleProvinceChange}>
                            <option value="">Select Province</option>
                            {PROVINCES.Canada.map((prov) => (
                                <option key={prov} value={prov}>
                                    {prov}
                                </option>
                            ))}
                        </select>
                        <button className="search-button" onClick={handleSearch}>Search</button>
                    </div>
                </div>
                <div className="hero-image">
                    <img src={heroImage} alt="Hero Section" />
                </div>
            </header>

            <section className="stats-section">
                <div className="pet-icons">
                    <img src={dogIcon} alt="Dog Icon" className="dog-icon" />
                    <img src={catIcon} alt="Cat Icon" className="cat-icon" />
                </div>
                <div className="stats-container">
                    {PET_TYPES.map((type) => (
                        <div className="stat-item" key={type}>
                            <h2>{petStats[type] || 0}</h2>
                            <p>{type}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="latest-pets-section">
                <h2>Latest Listings</h2>
                <div className="newest-pets-container">
                    {newestPets.map((pet) => (
                        <PetCard key={pet.pet_id} pet={pet} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
