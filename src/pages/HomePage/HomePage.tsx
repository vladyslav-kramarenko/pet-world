import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPets } from '../../services/apiService';
import PetCard from '../../components/PetCard/PetCard';
import { PET_TYPES } from '../../constants/petAttributes';
import { PROVINCES } from "../../constants/locations";
import './HomePage.css';
import heroImage from '../../assets/hero.png';

const HomePage: React.FC = () => {
    const [petStats, setPetStats] = useState<{ [key: string]: number }>({});
    const [newestPets, setNewestPets] = useState<any[]>([]);
    const [category, setCategory] = useState('');
    const [province, setProvince] = useState('');

    const navigate = useNavigate();

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
        // Navigate to the PetList page with selected filters as URL parameters
        navigate(`/pets?category=${category}&province=${province}`);
    };

    return (
        <div className="homepage">
            <div className="hero-section">
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
                        <button className="search-button" onClick={handleSearch}>
                            Search
                        </button>
                    </div>

                </div>
                <div className="hero-image">
                    <img src={heroImage} alt="Hero Section"/>
                </div>
            </div>

            <section className="stats-section">

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
