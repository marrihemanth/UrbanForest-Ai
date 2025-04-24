import { useState } from 'react';
import { trees } from '../services/api';

const TreeRecommendation = () => {
    const [formData, setFormData] = useState({
        location: '',
        temperature: 'hot',
        pollutionLevel: 'medium',
        soilType: 'loamy'
    });
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await trees.getRecommendations(formData);
            setRecommendations(response.data);
        } catch (err) {
            setError(err.message || 'Failed to get recommendations');
        } finally {
            setLoading(false);
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
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Tree Recommender 🌳</h1>

                {/* Recommendation Form */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Location Description
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g., Urban area, Park, Residential"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Temperature
                            </label>
                            <select
                                name="temperature"
                                value={formData.temperature}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="hot">Hot</option>
                                <option value="warm">Warm</option>
                                <option value="moderate">Moderate</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Pollution Level
                            </label>
                            <select
                                name="pollutionLevel"
                                value={formData.pollutionLevel}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Soil Type
                            </label>
                            <select
                                name="soilType"
                                value={formData.soilType}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="sandy">Sandy</option>
                                <option value="loamy">Loamy</option>
                                <option value="clay">Clay</option>
                                <option value="well-draining">Well-draining</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? 'Getting Recommendations...' : 'Get Recommendations'}
                        </button>
                    </form>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
                        {error}
                    </div>
                )}

                {/* Recommendations */}
                {recommendations.length > 0 && (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-semibold text-gray-900">Recommended Trees</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {recommendations.map((tree, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                                >
                                    {tree.imageUrl && (
                                        <div className="h-48 overflow-hidden">
                                            <img
                                                src={tree.imageUrl}
                                                alt={tree.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {tree.name}
                                        </h3>
                                        <p className="text-gray-600">
                                            {tree.benefits}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TreeRecommendation;