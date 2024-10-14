import axios from 'axios';
import { Pet } from '../types/Pet';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/pets`;

/**
 * Fetch all pets with optional filters and sorting.
 */
export const fetchPets = async (filters?: {
    type?: string;
    age?: string;
    sort?: string;
    country?: string;
    province?: string;
    town?: string;
    price?: number;
    gender?: string;
}): Promise<Pet[]> => {
    try {
        const validFilters = filters
            ? Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== undefined && value !== ''))
            : {};

        const response = await axios.get(API_URL, { params: validFilters });
        return response.data.pets;
    } catch (error) {
        console.error('Error fetching pets:', error);
        throw error;
    }
};

/**
 * Fetch a specific pet by its ID.
 */
export const fetchPetById = async (petId: string): Promise<Pet> => {
    try {
        const response = await axios.get(`${API_URL}/${petId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pet by ID:', error);
        throw error;
    }
};

/**
 * Create a new pet.
 */
export const createPet = async (petData: Pet): Promise<void> => {
    try {
        // Convert fields like `price` to their correct types before sending
        const formattedPetData = {
            ...petData,
            price: Number(petData.price), // Ensure price is a number
        };
        await axios.post(API_URL, formattedPetData);
    } catch (error) {
        console.error('Error creating pet:', error);
        throw error;
    }
};

/**
 * Update an existing pet by its ID.
 */
export const updatePet = async (petId: string, petData: any) => {
    try {
        console.log(JSON.stringify(petData));

        const response = await axios.put(`${API_URL}/${petId}`, petData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating pet: ', error);
        throw error;
    }
};

/**
 * Delete a pet by its ID.
 */
export const deletePet = async (petId: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${petId}`);
    } catch (error) {
        console.error('Error deleting pet:', error);
        throw error;
    }
};

/**
 * fetch pets by owner.
 */
export const fetchPetsByOwner = async (ownerId: string | undefined) => {
    try {
        const response = await axios.get(`${API_URL}/owner/${ownerId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pets by owner:', error);
        throw error;
    }
};
