import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PetCard from '../../components/PetCard/PetCard';
import { fetchPetsWithFilters } from '../../services/apiService';
import { Pet } from '../../types/Pet';
import { PET_TYPES } from '../../constants/petAttributes'; // Import the pet categories
import { PROVINCES } from '../../constants/locations'; // Import the province list
import './PetList.css';

const AGE_CATEGORIES = ['Baby', 'Adult', 'Senior']; // Define age categories

const PetList: React.FC = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [filters, setFilters] = useState({
        type: '',
        age: '',
        sort: 'name',
        country: 'Canada',
        province: '',
        town: '',
    });

    // Hook to parse query parameters from the URL
    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    };

    const query = useQuery();
    const categoryFromURL = query.get('category') || '';
    const provinceFromURL = query.get('province') || '';

    // Fetch pets based on filters
    const fetchPets = async () => {
        try {
            const petsData = await fetchPetsWithFilters(filters);
            setPets(petsData);
        } catch (error) {
            console.error('Error fetching pets:', error);
        }
    };

    // Set filters based on URL parameters when the component mounts
    useEffect(() => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            type: categoryFromURL,
            province: provinceFromURL,
        }));
    }, [categoryFromURL, provinceFromURL]);

    // Fetch pets whenever the filters change
    useEffect(() => {
        fetchPets();
    }, [filters]);

    // Handle input changes for each filter field
    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };


    return (
        <div className="pet-list-container">
            <div className="filters">
                <h3>Filters:</h3>
                {/* Pet Type Filter */}
                <label>
                    Type:
                    <select
                        name="type"
                        value={filters.type}
                        onChange={handleInputChange}
                    >
                        <option value="">All Types</option>
                        {PET_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </label>

                {/* Age Category Filter */}
                <label>
                    Age:
                    <select
                        name="age"
                        value={filters.age}
                        onChange={handleInputChange}
                    >
                        <option value="">All Ages</option>
                        {AGE_CATEGORIES.map((age) => (
                            <option key={age} value={age}>
                                {age}
                            </option>
                        ))}
                    </select>
                </label>

                {/* Province Filter */}
                <label>
                    Province:
                    <select
                        name="province"
                        value={filters.province}
                        onChange={handleInputChange}
                    >
                        <option value="">All Provinces</option>
                        {PROVINCES.Canada.map((province) => (
                            <option key={province} value={province}>
                                {province}
                            </option>
                        ))}
                    </select>
                </label>

                {/* Town Filter */}
                <label>
                    Town:
                    <input
                        type="text"
                        name="town"
                        value={filters.town}
                        placeholder="Enter town"
                        onChange={handleInputChange}
                    />
                </label>

                {/* Sort by Filter */}
                <label>
                    Sort by:
                    <select name="sort" value={filters.sort} onChange={handleInputChange}>
                        <option value="name">Name</option>
                        <option value="age">Age</option>
                        <option value="type">Type</option>
                    </select>
                </label>
            </div>

            {/* List of Pets */}
            <div className="pet-list">
                {pets.length > 0 ? (
                    pets.map((pet) => (
                        <PetCard key={pet.pet_id} pet={pet} />
                    ))
                ) : (
                    <p>No pets found matching the selected criteria.</p>
                )}
            </div>
        </div>
    );
};

export default PetList;
