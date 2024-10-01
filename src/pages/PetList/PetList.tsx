// src/pages/PetList.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPetsWithFilters } from '../../services/apiService'; // Import the service function
import { Pet } from '../../types/Pet';

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

    // Fetch pets whenever the filters change
    useEffect(() => {
        fetchPets();
    }, [filters]);

    // Fetch pets based on filters
    const fetchPets = async () => {
        try {
            const petsData = await fetchPetsWithFilters(filters); // Use the API service function
            setPets(petsData);
        } catch (error) {
            console.error('Error fetching pets:', error);
        }
    };

    // Handle input changes for each filter field
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    return (
        <div>
            <h1>Available Pets</h1>
            <Link to="/create">Add New Pet</Link>
            {/* Filter Section */}
            <div style={{ marginBottom: '20px' }}>
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
            <ul>
                {pets.map((pet) => (
                    <li key={pet.pet_id}>
                        <h2>{pet.pet_name}</h2>
                        <p>Type: {pet.pet_type}</p>
                        <p>Age: {pet.age}</p>
                        <p>Location: {pet.town}, {pet.province}, {pet.country}</p> {/* Updated to show location */}
                        <Link to={`/pet/${pet.pet_id}`}>View Profile</Link> | <Link to={`/edit/${pet.pet_id}`}>Edit</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PetList;
