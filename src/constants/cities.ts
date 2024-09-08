export const CITIES = [
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
    'giverny', 'carnac', 'amboise', 'chablis', 'megeve'
] as const;

export type City = typeof CITIES[number];

export function capitalizeCity(city: City): string {
    return city.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
}