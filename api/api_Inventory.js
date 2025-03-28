import { BASE_URL } from '../config/config.js';

export const apiInventory = {
    all_objects: {
        endpoint: `${BASE_URL}products/1`,
        method: "GET"
    },
    all_objects_by_id: {
        endpoint: `${BASE_URL}objects?id=3&id=5&id=10`,
        method: "GET",
    },
    add_object: {
        endpoint: `${BASE_URL}objects`,
        method: "POST",
    },
    single_object_by_id: {
        endpoint: `${BASE_URL}objects/7`,
        method: "GET",
    },
};
