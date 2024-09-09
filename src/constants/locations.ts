export const LOCATIONS = [
    // Existing cities
    'paris', 'marseille', 'lyon', 'toulouse', 'nice', 'nantes', 'strasbourg', 'montpellier',
    'bordeaux', 'lille', 'rennes', 'reims', 'le-havre', 'saint-etienne', 'toulon', 'grenoble',
    'dijon', 'angers', 'villeurbanne', 'le-mans', 'aix-en-provence', 'brest', 'nimes',
    'limoges', 'clermont-ferrand', 'tours', 'amiens', 'metz', 'perpignan', 'besancon',
    'orleans', 'rouen', 'caen', 'nancy', 'avignon', 'cannes', 'saint-nazaire', 'la-rochelle',
    'antibes', 'calais', 'pau', 'ajaccio', 'lorient', 'bayonne', 'compiegne', 'frejus',
    'vannes', 'chambery', 'annecy', 'la-roche-sur-yon', 'beauvais', 'arles', 'troyes',
    'niort', 'blois', 'cherbourg-en-cotentin', 'carcassonne', 'saint-malo', 'hyeres',
    'valence', 'bourges', 'quimper', 'saint-brieuc', 'colmar', 'biarritz', 'tarbes',
    'bastia', 'vichy', 'agen', 'perigueux', 'nevers', 'laval', 'albi', 'auxerre',
    'saint-raphael', 'dax', 'menton', 'chamonix-mont-blanc', 'deauville', 'arcachon',
    'fontainebleau', 'cognac', 'dinard', 'lourdes', 'honfleur', 'rocamadour', 'sarlat-la-caneda',
    'cassis', 'etretat', 'saint-tropez', 'gordes', 'annecy-le-vieux', 'evian-les-bains',
    'saint-jean-de-luz', 'porto-vecchio', 'bonifacio', 'collioure', 'saint-remy-de-provence',
    'giverny', 'carnac', 'amboise', 'chablis', 'megeve',

    // Additional important cities for short-term rentals
    'courchevel', 'val-thorens', 'meribel', 'saint-jean-cap-ferrat',
    'cap-dagde', 'saint-paul-de-vence', 'eze', 'moustiers-sainte-marie', 'grasse',

    // Regions
    'provence-alpes-cote-dazur', 'nouvelle-aquitaine', 'occitanie', 'auvergne-rhone-alpes',
    'bourgogne-franche-comte', 'bretagne', 'centre-val-de-loire', 'corse', 'grand-est',
    'hauts-de-france', 'ile-de-france', 'normandie', 'pays-de-la-loire',

    // Departments
    'alpes-maritimes', 'var', 'bouches-du-rhone', 'vaucluse', 'haute-savoie', 'savoie',
    'herault', 'gard', 'pyrenees-atlantiques', 'gironde', 'charente-maritime',

    // Specific terms
    'cote-dazur', 'french-riviera', 'provence', 'languedoc', 'cote-basque', 'cote-atlantique',
    'alpes-francaises', 'pyrenees', 'loire-valley', 'dordogne', 'luberon', 'camargue'
] as const;

export type Location = typeof LOCATIONS[number];

export function capitalizeLocation(location: Location): string {
    return location.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
}