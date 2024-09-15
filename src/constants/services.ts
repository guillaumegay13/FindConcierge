export const SERVICES = [
    'online_listing_creation',
    'professional_photography',
    'price_optimization',
    'calendar_management',
    'guest_tracking',
    'linen_supply',
    'professional_cleaning',
    'maintenance_service',
    'check_in_out',
    'welcome_gifts',
    'assistance_24_7',
    'review_monitoring',
    'property_insurance',
    'consumables_tracking'
] as const;

export type Service = typeof SERVICES[number];