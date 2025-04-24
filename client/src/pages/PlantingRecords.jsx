import { useState, useEffect, useMemo } from 'react';
import { plantingRecords, trees } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Create two different icons - one for saved locations and one for temporary selection
const defaultIcon = new Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Red version for temporary selection
const tempIcon = new Icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    className: 'temp-marker' // This will be styled red in the CSS
});

const LocationMarker = ({ onLocationSelect, resetTrigger }) => {
    const [position, setPosition] = useState(null);

    useEffect(() => {
        setPosition(null);
    }, [resetTrigger]);

    const map = useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            onLocationSelect({ lat, lng });
        }
    });

    return position === null ? null : (
        <Marker position={position} icon={tempIcon}>
            <Popup>
                <div className="text-center">
                    <p className="font-semibold text-red-600">Selected planting location</p>
                    <p className="text-sm text-gray-600">
                        {position[0].toFixed(6)}, {position[1].toFixed(6)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Submit the form to save this location
                    </p>
                </div>
            </Popup>
        </Marker>
    );
};

const PlantingRecords = () => {
    const [records, setRecords] = useState([]);
    const [treeList, setTreeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        tree: '',
        location: null
    });

    const [filters, setFilters] = useState({
        treeSpecies: '',
        searchQuery: '',
    });
    const [sortBy, setSortBy] = useState('date-desc'); // Options: date-desc, date-asc, co2-desc, co2-asc
    const [resetLocationTrigger, setResetLocationTrigger] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recordsRes, treesRes] = await Promise.all([
                    plantingRecords.getUserRecords(),
                    trees.getAll()
                ]);
                setRecords(recordsRes.data);
                setTreeList(treesRes.data);
            } catch (err) {
                setError('Failed to fetch records');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredAndSortedRecords = useMemo(() => {
        let filtered = [...records];

        // Apply tree species filter
        if (filters.treeSpecies) {
            filtered = filtered.filter(record => record.tree._id === filters.treeSpecies);
        }

        // Apply search query filter
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(record => 
                record.tree.name.toLowerCase().includes(query)
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'co2-desc':
                    return b.tree.pollutionReduction - a.tree.pollutionReduction;
                case 'co2-asc':
                    return a.tree.pollutionReduction - b.tree.pollutionReduction;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [records, filters, sortBy]);

    const handleLocationSelect = (location) => {
        setFormData(prev => ({ ...prev, location }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.location) {
            setError('Please select a location on the map');
            return;
        }
        try {
            // Transform location object to array format
            const recordData = {
                tree: formData.tree,
                location: [formData.location.lat, formData.location.lng]
            };
            const response = await plantingRecords.create(recordData);
            setRecords(prev => [response.data, ...prev]);
            setFormData({ tree: '', location: null });
            setResetLocationTrigger(prev => prev + 1); // Trigger location marker reset
        } catch (err) {
            setError('Failed to record planting');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                Loading...
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Planting Records 🌱</h1>

                {/* Plant New Tree Form */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Record New Planting</h2>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Select Tree
                            </label>
                            <select
                                name="tree"
                                value={formData.tree}
                                onChange={(e) => setFormData(prev => ({ ...prev, tree: e.target.value }))}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Select a tree</option>
                                {treeList.map(tree => (
                                    <option key={tree._id} value={tree._id}>
                                        {tree.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Location (Click on map to select)
                            </label>
                            <div className="h-[400px] w-full rounded-lg overflow-hidden mb-4 border border-gray-300">
                                <MapContainer
                                    center={[17.385044, 78.486671]}
                                    zoom={12}
                                    style={{ height: '100%', width: '100%' }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <LocationMarker 
                                        onLocationSelect={handleLocationSelect} 
                                        resetTrigger={resetLocationTrigger}
                                    />
                                </MapContainer>
                            </div>
                            <div className="text-sm text-gray-600">
                                {formData.location 
                                    ? `Selected location: ${formData.location.lat.toFixed(6)}, ${formData.location.lng.toFixed(6)}`
                                    : 'Click on the map to select a planting location'}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Record Planting
                        </button>
                    </form>
                </div>

                {/* Filtering and Sorting Controls */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Filter by Tree Species
                            </label>
                            <select
                                value={filters.treeSpecies}
                                onChange={(e) => setFilters(prev => ({ ...prev, treeSpecies: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">All Species</option>
                                {treeList.map(tree => (
                                    <option key={tree._id} value={tree._id}>
                                        {tree.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Search
                            </label>
                            <input
                                type="text"
                                value={filters.searchQuery}
                                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                                placeholder="Search by tree name..."
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Sort By
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="date-desc">Newest First</option>
                                <option value="date-asc">Oldest First</option>
                                <option value="co2-desc">Highest CO₂ Impact</option>
                                <option value="co2-asc">Lowest CO₂ Impact</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Map View */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Tree Locations</h2>
                    <div className="h-[400px] w-full rounded-lg overflow-hidden mb-4 border border-gray-300">
                        <MapContainer
                            center={[17.385044, 78.486671]}
                            zoom={12}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {filteredAndSortedRecords.map(record => {
                                if (!record?.location) return null;
                                return (
                                    <Marker
                                        key={record._id}
                                        position={[record.location.lat, record.location.lng]}
                                        icon={defaultIcon}
                                    >
                                        <Popup>
                                            <div className="text-center">
                                                <h3 className="font-bold">{record.tree.name}</h3>
                                                {record.tree.pollutionReduction && (
                                                    <p className="text-sm text-gray-600">
                                                        CO₂ Reduction: {record.tree.pollutionReduction} kg/year
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Planted: {new Date(record.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </MapContainer>
                    </div>
                </div>

                {/* Records List */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Planting History</h2>
                    {filteredAndSortedRecords.length === 0 ? (
                        <p className="text-gray-600">No planting records match your filters.</p>
                    ) : (
                        <div className="space-y-4">
                            {filteredAndSortedRecords.map(record => {
                                if (!record?.location) return null;
                                return (
                                    <div
                                        key={record._id}
                                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {record.tree.name}
                                                </h3>
                                                <p className="text-gray-600">
                                                    Location: {record.location.lat.toFixed(6)}, {record.location.lng.toFixed(6)}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Planted on: {new Date(record.date).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-green-600">
                                                    CO₂ Reduction: {record.tree.pollutionReduction} kg/year
                                                </p>
                                            </div>
                                            {record.tree.image && (
                                                <img
                                                    src={record.tree.image}
                                                    alt={record.tree.name}
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlantingRecords;