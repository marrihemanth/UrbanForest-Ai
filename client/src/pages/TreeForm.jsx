import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trees } from '../services/api';

const TreeForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        suitableZones: '',
        pollutionReduction: '',
        image: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const processedData = {
                ...formData,
                suitableZones: formData.suitableZones.split(',').map(zone => zone.trim()),
                pollutionReduction: Number(formData.pollutionReduction)
            };
            
            await trees.create(processedData);
            setSuccess('Tree added successfully!');
            setTimeout(() => navigate('/planting-records'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add tree');
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Tree 🌳</h1>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Tree Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., Oak Tree"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Suitable Zones (comma-separated)
                        </label>
                        <input
                            type="text"
                            name="suitableZones"
                            value={formData.suitableZones}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., Temperate, Mediterranean"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Pollution Reduction (kg CO2 per year)
                        </label>
                        <input
                            type="number"
                            name="pollutionReduction"
                            value={formData.pollutionReduction}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.1"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., 25.5"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Image URL
                        </label>
                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="https://example.com/tree-image.jpg"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Add Tree
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TreeForm;