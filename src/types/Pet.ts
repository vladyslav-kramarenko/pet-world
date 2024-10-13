export type Pet = {
    pet_id?: string;           // Unique identifier for each pet
    pet_name: string;         // Name of the pet
    pet_type: string;         // Type of pet (e.g., dog, cat)
    exact_age?: string;              // Age category (e.g., young, adult, senior)
    age_category: string;
    country: string;          // Country where the pet is located
    province: string;         // Province or state where the pet is located
    town: string;             // City or town where the pet is located
    latitude?: number;        // Latitude for geolocation (optional)
    longitude?: number;       // Longitude for geolocation (optional)
    price?: number;           // Price of the pet
    gender?: string;          // Gender of the pet (e.g., male, female, unknown)
    main_image_url?: string;  // URL of the pet's image
    images: string[];
    description?: string;     // Additional description for the pet
    contact_phone: string;
    contact_name: string;
    owner_id: string;
    "isSterilized": false,
    "isVaccinated": false,
    "hasChip": false,
    "hasParasiteTreatment": false,
    "hasVetPassport": false,
    "hasPedigree": false,
    "hasFCICertificate": false,
};
