import { useState } from 'react';

const TreeCard = ({ tree }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {tree.imageUrl && (
                <img 
                    src={tree.imageUrl} 
                    alt={tree.name}
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900">{tree.name}</h3>
                {tree.scientificName && (
                    <p className="text-sm italic text-gray-600 mb-2">{tree.scientificName}</p>
                )}
                
                {/* Always visible content */}
                <div className="mb-3">
                    {tree.description && (
                        <p className="text-gray-700 mb-2">{tree.description}</p>
                    )}
                    {tree.benefits && tree.benefits.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tree.benefits.map((benefit, index) => (
                                <span 
                                    key={index}
                                    className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                                >
                                    {benefit}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Expandable content */}
                {expanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        {tree.growthTime && (
                            <p className="text-gray-700 mb-2">
                                <span className="font-semibold">Growth Time:</span> {tree.growthTime}
                            </p>
                        )}
                        {tree.suitableClimate && (
                            <p className="text-gray-700 mb-2">
                                <span className="font-semibold">Climate:</span> {tree.suitableClimate}
                            </p>
                        )}
                        {tree.co2Absorption && (
                            <p className="text-gray-700">
                                <span className="font-semibold">CO₂ Absorption:</span> {tree.co2Absorption}
                            </p>
                        )}
                    </div>
                )}

                {/* View More/Less button */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-4 text-green-600 hover:text-green-800 text-sm font-medium focus:outline-none"
                >
                    {expanded ? 'View Less' : 'View More'}
                </button>
            </div>
        </div>
    );
};

export default TreeCard;