import { useAuth } from '../context/AuthContext';
import DashboardStats from '../components/DashboardStats';
import EnvironmentalStats from '../components/EnvironmentalStats';
import TreeMap from '../components/TreeMap';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.username}! 👋</h1>
                <p className="text-gray-600 mt-2">Here's your environmental impact overview</p>
            </div>
            
            <div className="space-y-8">
                <EnvironmentalStats />
                
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    <DashboardStats />
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Your Tree Plantings</h2>
                    <TreeMap />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;