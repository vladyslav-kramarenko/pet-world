// src/components/PetList.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './PetList.css';
import {fetchPetsWithFilters} from "../../services/apiService";
import {Pet} from "../../types/Pet";
import PetCard from "../../components/PetCard/PetCard"; // Import the CSS file

const PetList: React.FC = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [filters, setFilters] = useState({
        type: '',
        age: '',
        sort: 'name',
        country: '',
        province: '',
        town: '',
    });

    // Fetch pets based on filters
    const fetchPets = async () => {
        try {
            const petsData = await fetchPetsWithFilters(filters); // Use the API service function
            setPets(petsData);
        } catch (error) {
            console.error('Error fetching pets:', error);
        }
    };

    // Fetch pets whenever the filters change
    useEffect(() => {
        fetchPets();
    }, [filters]);

    // Handle input changes for each filter field
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    return (
        <div className="pet-list-container">
            <div className="filters">
                <h3>Filters:</h3>
                <label>
                    Type:
                    <input
                        type="text"
                        name="type"
                        value={filters.type}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Age:
                    <input
                        type="text"
                        name="age"
                        value={filters.age}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Country:
                    <input
                        type="text"
                        name="country"
                        value={filters.country}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Province:
                    <input
                        type="text"
                        name="province"
                        value={filters.province}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Town:
                    <input
                        type="text"
                        name="town"
                        value={filters.town}
                        onChange={handleInputChange}
                    />
                </label>
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
                {pets.map((pet) => (
                    <PetCard key={pet.pet_id} pet={pet} />
                ))}
            </div>
        </div>
    );
};

export default PetList;
