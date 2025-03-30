import { BASE_URL } from '../config/config.js';

export const apiInventory = {
    all_objects: {
        endpoint: `${BASE_URL}objects`,
        method: "GET",
        headers: { 'Content-Type': 'application/json' } 
    },
    all_objects_by_id: {
        endpoint: `${BASE_URL}objects?id=3&id=5&id=10`,
        method: "GET",
        headers: { 'Content-Type': 'application/json' } 
    },
    add_object: {
        endpoint: `${BASE_URL}objects`,
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        payload: {
            name: "Apple MacBook Pro 16",
            data: {
                year: 2019,
                price: 1849.99,
                "CPU model": "Intel Core i9",
                "Hard disk size": "1 TB"
            }
        }
    },
    single_object_by_id: {
        endpoint: `${BASE_URL}objects/7`,
        method: "GET",
        headers: { 'Content-Type': 'application/json' } 
    },
};
