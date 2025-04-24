import { useState, useEffect } from 'react';
import { plantingRecords } from '../services/api';

const DashboardStats = () => {
    const [stats, setStats] = useState({
        totalTrees: 0,
        recentPlantings: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await plantingRecords.getUserRecords();
                setStats({
                    totalTrees: response.data.length,
                    recentPlantings: response.data.slice(0, 5)
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-600">Total Trees Planted</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.totalTrees}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Recent Plantings</h3>
                    <div className="space-y-2">
                        {stats.recentPlantings.map((record) => (
                            <div key={record._id} className="flex items-center">
                                <div className="flex-1">
                                    <p className="font-medium">{record.tree.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(record.date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;