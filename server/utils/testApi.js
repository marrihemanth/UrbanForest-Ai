const axios = require('axios');

const API_URL = 'http://localhost:5001/api';
let token = null;

const testApi = async () => {
    try {
        // 1. Register a new user
        console.log('\n1. Testing user registration...');
        const registerResponse = await axios.post(`${API_URL}/users/register`, {
            username: 'testuser',
            email: 'test@example.com',
            password: 'test123456'
        });
        console.log('Registration successful:', registerResponse.data);

        // 2. Login user
        console.log('\n2. Testing user login...');
        const loginResponse = await axios.post(`${API_URL}/users/login`, {
            email: 'test@example.com',
            password: 'test123456'
        });
        token = loginResponse.data.token;
        console.log('Login successful:', loginResponse.data);

        // Setup axios headers for protected routes
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        // 3. Fetch user profile
        console.log('\n3. Testing profile fetch...');
        const profileResponse = await axios.get(
            `${API_URL}/users/profile`,
            config
        );
        console.log('Profile fetched:', profileResponse.data);

        // 4. Create a new tree
        console.log('\n4. Testing tree creation...');
        const treeResponse = await axios.post(
            `${API_URL}/trees`,
            {
                name: 'Oak Tree',
                suitableZones: ['Temperate', 'Mediterranean'],
                pollutionReduction: 25.5,
                image: 'https://example.com/oak-tree.jpg'
            }
        );
        console.log('Tree created:', treeResponse.data);
        const treeId = treeResponse.data._id;

        // 5. Fetch all trees
        console.log('\n5. Testing trees fetch...');
        const treesResponse = await axios.get(`${API_URL}/trees`);
        console.log('Trees fetched:', treesResponse.data);

        // 6. Record a tree planting
        console.log('\n6. Testing planting record creation...');
        const plantingResponse = await axios.post(
            `${API_URL}/planting/plant`,
            {
                tree: treeId,
                location: '40.7128° N, 74.0060° W'
            },
            config
        );
        console.log('Planting recorded:', plantingResponse.data);

        // 7. Fetch planting records
        console.log('\n7. Testing planting records fetch...');
        const recordsResponse = await axios.get(
            `${API_URL}/planting/records`,
            config
        );
        console.log('Planting records fetched:', recordsResponse.data);

    } catch (error) {
        console.error('Error occurred:', {
            message: error.message,
            response: error.response?.data
        });
    }
};

// Run the tests
console.log('Starting API tests...');
testApi().then(() => console.log('\nAPI tests completed.'));