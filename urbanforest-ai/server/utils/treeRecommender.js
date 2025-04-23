const recommendTrees = ({ location, temperature, pollutionLevel, soilType }) => {
    // Sample tree data with recommendations based on conditions
    const treeDatabase = [
        {
            name: 'Neem',
            benefits: 'Natural air purifier, medicinal properties, drought-tolerant',
            imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=500',
            suitableConditions: {
                temperature: ['hot', 'warm'],
                soilTypes: ['sandy', 'loamy', 'clay'],
                pollutionTolerance: 'high'
            }
        },
        {
            name: 'Peepal',
            benefits: 'Releases oxygen 24/7, supports biodiversity, large canopy',
            imageUrl: 'https://images.unsplash.com/photo-1541093111839-be80544198ff?auto=format&fit=crop&w=500',
            suitableConditions: {
                temperature: ['hot', 'warm'],
                soilTypes: ['loamy', 'clay'],
                pollutionTolerance: 'high'
            }
        },
        {
            name: 'Banyan',
            benefits: 'Extensive shade, air purification, cultural significance',
            imageUrl: 'https://images.unsplash.com/photo-1635924941944-dc2a3979e37c?auto=format&fit=crop&w=500',
            suitableConditions: {
                temperature: ['hot', 'warm'],
                soilTypes: ['loamy', 'sandy'],
                pollutionTolerance: 'medium'
            }
        },
        {
            name: 'Indian Almond',
            benefits: 'Coastal area suitable, wind resistant, edible nuts',
            imageUrl: 'https://images.unsplash.com/photo-1518701005037-d53b1f67bb1c?auto=format&fit=crop&w=500',
            suitableConditions: {
                temperature: ['warm', 'moderate'],
                soilTypes: ['sandy', 'loamy'],
                pollutionTolerance: 'medium'
            }
        },
        {
            name: 'Gulmohar',
            benefits: 'Beautiful flowers, quick growth, shade provider',
            imageUrl: 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?auto=format&fit=crop&w=500',
            suitableConditions: {
                temperature: ['hot', 'warm'],
                soilTypes: ['well-draining', 'loamy'],
                pollutionTolerance: 'medium'
            }
        }
    ];

    // Simple rule-based filtering
    let recommendedTrees = treeDatabase.filter(tree => {
        const tempMatch = tree.suitableConditions.temperature.includes(temperature.toLowerCase());
        const soilMatch = tree.suitableConditions.soilTypes.includes(soilType.toLowerCase());
        const pollutionMatch = 
            (pollutionLevel === 'high' && tree.suitableConditions.pollutionTolerance === 'high') ||
            (pollutionLevel === 'medium' && ['high', 'medium'].includes(tree.suitableConditions.pollutionTolerance)) ||
            (pollutionLevel === 'low');

        return tempMatch && soilMatch && pollutionMatch;
    });

    // If no exact matches, return all trees sorted by pollution tolerance
    if (recommendedTrees.length === 0) {
        recommendedTrees = treeDatabase.sort((a, b) => {
            const pollutionScore = { high: 3, medium: 2, low: 1 };
            return pollutionScore[b.suitableConditions.pollutionTolerance] - 
                   pollutionScore[a.suitableConditions.pollutionTolerance];
        });
    }

    // Format the response
    return recommendedTrees.map(({ name, benefits, imageUrl }) => ({
        name,
        benefits,
        imageUrl
    }));
};

module.exports = { recommendTrees };