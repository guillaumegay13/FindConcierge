import { DefaultSeoProps } from 'next-seo';

const SEO: DefaultSeoProps = {
    titleTemplate: '%s | Répertoire de Conciergerie France',
    defaultTitle: 'Répertoire de Conciergerie France',
    description: 'Trouvez le concierge parfait pour votre location de courte durée en France. Services pour Airbnb, Booking et autres plateformes.',
    openGraph: {
        type: 'website',
        locale: 'fr_FR',
        url: 'https://www.votresite.com/',
        siteName: 'Répertoire de Conciergerie France',
    },
    additionalMetaTags: [
        {
            name: 'keywords',
            content: 'conciergerie, airbnb, location courte durée, booking, gestion locative, conciergerie airbnb, conciergerie paris, services de conciergerie'
        },
    ],
};

export default SEO;