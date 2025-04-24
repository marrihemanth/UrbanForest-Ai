import { useState, useEffect } from 'react';
import TreeCard from '../components/TreeCard';
import { trees } from '../services/api';

const Trees = () => {
    const [treeList, setTreeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTrees = async () => {
            try {
                const response = await trees.getAll();
                setTreeList(response.data);
            } catch (err) {
                setError('Failed to load trees');
            } finally {
                setLoading(false);
            }
        };

        fetchTrees();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Explore Trees 🌳</h1>
                <p className="text-gray-600 mt-2">
                    Discover our collection of trees and their unique characteristics
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {treeList.map(tree => (
                    <TreeCard key={tree._id} tree={tree} />
                ))}
            </div>

            {treeList.length === 0 && (
                <div className="text-center text-gray-600 py-8">
                    No trees available at the moment.
                </div>
            )}
        </div>
    );
};

export default Trees;