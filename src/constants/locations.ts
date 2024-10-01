// src/constants/locations.ts

// List of countries supported by the app
export const COUNTRIES: string[] = ['Canada', 'United States'];

// Map of provinces/states for each country
export type ProvinceMap = {
    [key: string]: string[];
};

export const PROVINCES: ProvinceMap = {
    Canada: [
        'Alberta',
        'British Columbia',
        'Manitoba',
        'New Brunswick',
        'Newfoundland and Labrador',
        'Nova Scotia',
        'Ontario',
        'Prince Edward Island',
        'Quebec',
        'Saskatchewan',
    ],
    'United States': [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
        'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana',
        'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
        'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
        'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
        'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
        'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin',
        'Wyoming',
    ],
};

// Example of pre-defining common locations for filters or other uses
export const COMMON_LOCATIONS = {
    majorCities: ['New York', 'Toronto', 'Vancouver', 'Los Angeles', 'Chicago', 'Houston'],
};
