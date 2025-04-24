import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';
import { plantingRecords, trees } from '../services/api';

// Custom tree icon configuration
const treeIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const tempIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const LocationMarker = ({ onLocationSelect }) => {
    const [position, setPosition] = useState(null);

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
                    <p className="font-semibold text-red-600">Selected location</p>
                    <p className="text-sm text-gray-600">
                        {position[0].toFixed(6)}, {position[1].toFixed(6)}
                    </p>
                </div>
            </Popup>
        </Marker>
    );
};

const TreeMap = () => {
    const [trees, setTrees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedTree, setSelectedTree] = useState('');
    const [availableTrees, setAvailableTrees] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recordsRes, treesRes] = await Promise.all([
                    plantingRecords.getUserRecords(),
                    trees.getAll()
                ]);
                setTrees(recordsRes.data);
                setAvailableTrees(treesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedLocation || !selectedTree) {
            setError('Please select both a location and a tree');
            return;
        }

        try {
            const response = await plantingRecords.create({
                tree: selectedTree,
                location: [selectedLocation.lat, selectedLocation.lng]
            });
            
            setTrees(prev => [...prev, response.data]);
            setSelectedLocation(null);
            setSelectedTree('');
            setShowForm(false);
        } catch (err) {
            setError('Failed to record planting');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading map...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;
    }

    const defaultCenter = [17.385044, 78.486671];
    const center = trees.length > 0 
        ? [trees[0].location.lat, trees[0].location.lng]
        : defaultCenter;

    return (
        <div className="space-y-4">
            <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
                <MapContainer
                    center={center}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker onLocationSelect={handleLocationSelect} />
                    {trees.map(record => (
                        <Marker
                            key={record._id}
                            position={[record.location.lat, record.location.lng]}
                            icon={treeIcon}
                        >
                            <Popup>
                                <div className="text-center p-2">
                                    <h3 className="font-bold text-lg mb-2">{record.tree.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2">
                                        Planted: {new Date(record.date).toLocaleDateString()}
                                    </p>
                                    {record.tree.pollutionReduction && (
                                        <p className="text-sm text-green-600">
                                            CO₂ Reduction: {record.tree.pollutionReduction} kg/year
                                        </p>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {showForm && (
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold mb-4">Record New Planting</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Tree Species
                            </label>
                            <select
                                value={selectedTree}
                                onChange={(e) => setSelectedTree(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Choose a tree</option>
                                {availableTrees.map(tree => (
                                    <option key={tree._id} value={tree._id}>
                                        {tree.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Confirm Planting
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedLocation(null);
                                    setShowForm(false);
                                }}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TreeMap;