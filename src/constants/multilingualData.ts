import { SERVICES } from './services';
import { LOCATIONS } from './locations';
import { SUPPORTED_LANGUAGES } from '../app/config';

export type MultilingualService = typeof SERVICES[number];
export type MultilingualLocation = typeof LOCATIONS[number];

export type MultilingualData = {
    [key in typeof SUPPORTED_LANGUAGES[number]]: string;
};

export const MULTILINGUAL_LOCATIONS: { [key in MultilingualLocation]: MultilingualData } =
    Object.fromEntries(LOCATIONS.map(location => [
        location,
        Object.fromEntries(SUPPORTED_LANGUAGES.map(lang => [lang, location])) as MultilingualData
    ])) as { [key in MultilingualLocation]: MultilingualData };

// Verify that all locations are covered
const locationKeys = Object.keys(MULTILINGUAL_LOCATIONS) as MultilingualLocation[];
const missingLocations = LOCATIONS.filter(location => !locationKeys.includes(location));
if (missingLocations.length > 0) {
    console.warn(`Missing locations in MULTILINGUAL_LOCATIONS: ${missingLocations.join(', ')}`);
}
