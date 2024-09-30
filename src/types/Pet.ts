export type Pet = {
    pet_id: string;           // Unique identifier for each pet
    pet_name: string;         // Name of the pet
    pet_type: string;         // Type of pet (e.g., dog, cat)
    age: string;              // Age category (e.g., young, adult, senior)
    country: string;          // Country where the pet is located
    province: string;         // Province or state where the pet is located
    town: string;             // City or town where the pet is located
    latitude?: number;        // Latitude for geolocation (optional)
    longitude?: number;       // Longitude for geolocation (optional)
    description?: string;     // Additional description for the pet
};
