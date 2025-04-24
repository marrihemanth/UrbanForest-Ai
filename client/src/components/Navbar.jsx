import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-green-700 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">
                    🌿 UrbanForest.AI
                </Link>
                <div className="flex gap-4">
                    <Link to="/trees" className="hover:text-green-200">Explore Trees</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="hover:text-green-200">Dashboard</Link>
                            <Link to="/tree-form" className="hover:text-green-200">Add Tree</Link>
                            <Link to="/planting-records" className="hover:text-green-200">My Plants</Link>
                            <Link to="/recommend-trees" className="hover:text-green-200">Tree Recommender</Link>
                            <button
                                onClick={logout}
                                className="hover:text-green-200"
                            >
                                Logout ({user.username})
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-green-200">Login</Link>
                            <Link to="/register" className="hover:text-green-200">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;