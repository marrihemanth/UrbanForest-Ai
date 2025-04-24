import { useState, useEffect } from 'react';
import { plantingRecords } from '../services/api';

const EnvironmentalStats = () => {
    const [stats, setStats] = useState({
        totalCO2Reduced: 0,
        treesPlanted: 0,
        highestImpactTree: null,
        totalImpactThisMonth: 0,
        monthlyGrowth: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await plantingRecords.getUserRecords();
                const records = response.data;
                
                // Calculate total CO2 reduction
                const totalCO2 = records.reduce((sum, record) => 
                    sum + (record.tree.pollutionReduction || 0), 0);

                // Find highest impact tree
                const highestImpact = records.reduce((max, record) => 
                    (!max || (record.tree.pollutionReduction > max.tree.pollutionReduction)) 
                        ? record 
                        : max
                , null);

                // Calculate this month's impact
                const now = new Date();
                const thisMonth = records.filter(record => {
                    const recordDate = new Date(record.date);
                    return recordDate.getMonth() === now.getMonth() &&
                           recordDate.getFullYear() === now.getFullYear();
                });
                const thisMonthCO2 = thisMonth.reduce((sum, record) => 
                    sum + (record.tree.pollutionReduction || 0), 0);

                // Calculate monthly growth
                const lastMonth = records.filter(record => {
                    const recordDate = new Date(record.date);
                    const lastMonthDate = new Date();
                    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
                    return recordDate.getMonth() === lastMonthDate.getMonth() &&
                           recordDate.getFullYear() === lastMonthDate.getFullYear();
                });
                const lastMonthCO2 = lastMonth.reduce((sum, record) => 
                    sum + (record.tree.pollutionReduction || 0), 0);
                
                const monthlyGrowth = lastMonthCO2 ? 
                    ((thisMonthCO2 - lastMonthCO2) / lastMonthCO2) * 100 : 0;

                setStats({
                    totalCO2Reduced: totalCO2,
                    treesPlanted: records.length,
                    highestImpactTree: highestImpact,
                    totalImpactThisMonth: thisMonthCO2,
                    monthlyGrowth
                });
            } catch (error) {
                console.error('Error fetching environmental stats:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Total CO₂ Reduction</h3>
                <p className="text-3xl font-bold text-green-600">{stats.totalCO2Reduced.toFixed(1)} kg/year</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Trees Planted</h3>
                <p className="text-3xl font-bold text-green-600">{stats.treesPlanted}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">This Month's Impact</h3>
                <p className="text-3xl font-bold text-green-600">{stats.totalImpactThisMonth.toFixed(1)} kg</p>
                {stats.monthlyGrowth !== 0 && (
                    <p className={`text-sm ${stats.monthlyGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.monthlyGrowth > 0 ? '↑' : '↓'} {Math.abs(stats.monthlyGrowth).toFixed(1)}% from last month
                    </p>
                )}
            </div>
            
            {stats.highestImpactTree && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Highest Impact Tree</h3>
                    <p className="text-xl font-bold text-gray-800">{stats.highestImpactTree.tree.name}</p>
                    <p className="text-green-600">
                        {stats.highestImpactTree.tree.pollutionReduction} kg CO₂/year
                    </p>
                </div>
            )}
        </div>
    );
};

export default EnvironmentalStats;