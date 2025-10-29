import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: '0000000000',
    appId: '1:0000000000:web:abcdef123456',
};

let firestore;
try {
    const app = initializeApp(firebaseConfig);
    firestore = getFirestore(app);
} catch (error) {
    console.error('Firebase initialisation error:', error);
}

const propertiesGrid = document.getElementById('propertiesGrid');
const pagination = document.getElementById('pagination');
const filterLocation = document.getElementById('filterLocation');
const filterType = document.getElementById('filterType');
const filterMin = document.getElementById('filterMin');
const filterMax = document.getElementById('filterMax');
const applyFiltersBtn = document.getElementById('applyFilters');

const fallbackListings = normaliseListings(JSON.parse(localStorage.getItem('vitalis-fallback-listings') || 'null') || [
    {
        id: '1',
        image: 'https://res.cloudinary.com/demo/image/upload/v1731950000/luxury-flat-chelsea.jpg',
        price: '£3,950 pcm',
        location: 'Chelsea, SW3',
        title: 'Elegant Two-Bedroom Apartment with River Views',
        type: 'Apartment',
        minPrice: 3950,
        maxPrice: 3950,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        id: '2',
        image: 'https://res.cloudinary.com/demo/image/upload/v1731950000/london-townhouse.jpg',
        price: '£2,850 pcm',
        location: 'Kensington, W8',
        title: 'Victorian Townhouse with Private Garden',
        type: 'House',
        minPrice: 2850,
        maxPrice: 2850,
        bedrooms: 3,
        bathrooms: 2,
    },
    {
        id: '3',
        image: 'https://res.cloudinary.com/demo/image/upload/v1731950000/canary-wharf.jpg',
        price: '£1,950 pcm',
        location: 'Canary Wharf, E14',
        title: 'Skyline Studio in Landmark Riverside Development',
        type: 'Studio',
        minPrice: 1950,
        maxPrice: 1950,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        id: '4',
        image: 'https://res.cloudinary.com/demo/image/upload/v1731950000/primrose-hill.jpg',
        price: '£5,200 pcm',
        location: 'Primrose Hill, NW1',
        title: 'Four-Bedroom Residence Overlooking Regent’s Park',
        type: 'House',
        minPrice: 5200,
        maxPrice: 5200,
        bedrooms: 4,
        bathrooms: 3,
    },
    {
        id: '5',
        image: 'https://res.cloudinary.com/demo/image/upload/v1731950000/mayfair-penthouse.jpg',
        price: '£12,500 pcm',
        location: 'Mayfair, W1K',
        title: 'Penthouse with Concierge and Private Terrace',
        type: 'Penthouse',
        minPrice: 12500,
        maxPrice: 12500,
        bedrooms: 3,
        bathrooms: 3,
    },
    {
        id: '6',
        image: 'https://res.cloudinary.com/demo/image/upload/v1731950000/notting-hill.jpg',
        price: '£3,200 pcm',
        location: 'Notting Hill, W11',
        title: 'Colourful Notting Hill Apartment with Balcony',
        type: 'Apartment',
        minPrice: 3200,
        maxPrice: 3200,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        id: '7',
        image: 'https://res.cloudinary.com/demo/image/upload/v1731950000/shoreditch-loft.jpg',
        price: '£4,100 pcm',
        location: 'Shoreditch, E2',
        title: 'Converted Warehouse Loft with Exposed Brick',
        type: 'Apartment',
        minPrice: 4100,
        maxPrice: 4100,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        id: '8',
        image: 'https://res.cloudinary.com/demo/image/upload/v1731950000/greenwich-townhouse.jpg',
        price: '£2,350 pcm',
        location: 'Greenwich, SE10',
        title: 'Georgian Townhouse Moments from the Park',
        type: 'House',
        minPrice: 2350,
        maxPrice: 2350,
        bedrooms: 3,
        bathrooms: 2,
    },
    {
        id: '9',
        image: 'https://res.cloudinary.com/demo/image/upload/v1731950000/soho-loft.jpg',
        price: '£4,900 pcm',
        location: 'Soho, W1F',
        title: 'Stylish Soho Loft with Design Interiors',
        type: 'Apartment',
        minPrice: 4900,
        maxPrice: 4900,
        bedrooms: 2,
        bathrooms: 2,
    },
    {
        id: '10',
        image: 'https://res.cloudinary.com/demo/image/upload/v1731950000/hampstead-villa.jpg',
        price: '£6,750 pcm',
        location: 'Hampstead, NW3',
        title: 'Detached Hampstead Villa with Landscaped Garden',
        type: 'House',
        minPrice: 6750,
        maxPrice: 6750,
        bedrooms: 5,
        bathrooms: 4,
    },
    {
        id: '11',
        image: 'https://res.cloudinary.com/demo/image/upload/v1731950000/battersea-riverside.jpg',
        price: '£2,250 pcm',
        location: 'Battersea, SW11',
        title: 'Riverside Apartment in Battersea Power Station',
        type: 'Apartment',
        minPrice: 2250,
        maxPrice: 2250,
        bedrooms: 1,
        bathrooms: 1,
    },
    {
        id: '12',
        image: 'https://res.cloudinary.com/demo/image/upload/v1731950000/richmond-cottage.jpg',
        price: '£3,450 pcm',
        location: 'Richmond, TW10',
        title: 'Riverside Cottage Adjacent to Richmond Park',
        type: 'House',
        minPrice: 3450,
        maxPrice: 3450,
        bedrooms: 3,
        bathrooms: 2,
    }
]);

const ITEMS_PER_PAGE = 9;
let listings = [];
let filteredListings = [];
let currentPage = 1;

const createSkeletons = count => {
    propertiesGrid.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'loading-card';
        propertiesGrid.appendChild(skeleton);
    }
};

const populateLocations = listingsData => {
    const locations = [...new Set(listingsData.map(item => item.location.split(',')[0].trim()))].sort();
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        filterLocation.appendChild(option);
    });
};

const renderListings = () => {
    propertiesGrid.innerHTML = '';
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginated = filteredListings.slice(start, start + ITEMS_PER_PAGE);

    paginated.forEach(listing => {
        const card = document.createElement('article');
        card.className = 'property-card';
        card.innerHTML = `
            <div class="image" style="background-image:url('${listing.image}')"></div>
            <div class="content">
                <span class="price">${listing.price}</span>
                <h3>${listing.title}</h3>
                <div class="meta">
                    <span>${listing.location}</span>
                    <span>${listing.bedrooms || '-'} Beds</span>
                    <span>${listing.bathrooms || '-'} Baths</span>
                </div>
                <a href="/property.html?id=${listing.id}" class="btn btn-gold">View Details</a>
            </div>
        `;
        propertiesGrid.appendChild(card);
    });
    renderPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const renderPagination = () => {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE) || 1;
    for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement('button');
        button.textContent = page;
        if (page === currentPage) button.classList.add('active');
        button.addEventListener('click', () => {
            currentPage = page;
            renderListings();
        });
        pagination.appendChild(button);
    }
};

const applyFilters = () => {
    const selectedLocation = filterLocation.value;
    const selectedType = filterType.value;
    const min = Number(filterMin.value) || 0;
    const max = Number(filterMax.value) || Number.MAX_SAFE_INTEGER;

    filteredListings = listings.filter(item => {
        const locationMatch = !selectedLocation || item.location.includes(selectedLocation);
        const typeMatch = !selectedType || item.type === selectedType;
        const priceValue = item.minPrice || 0;
        return locationMatch && typeMatch && priceValue >= min && priceValue <= max;
    });

    currentPage = 1;
    renderListings();
};

const fetchListings = async () => {
    createSkeletons(9);
    if (!firestore) {
        listings = fallbackListings;
        filteredListings = [...listings];
        populateLocations(listings);
        applyFilters();
        return;
    }

    try {
        const listingsDoc = await getDoc(doc(firestore, 'integrations', 'zooplaListings'));
        if (listingsDoc.exists()) {
            const data = listingsDoc.data();
            const properties = normaliseListings(data?.properties ?? []);
            if (properties.length) {
                listings = properties;
                filteredListings = [...listings];
                populateLocations(listings);
                applyFilters();
                return;
            }
        }
        listings = fallbackListings;
        filteredListings = [...listings];
        populateLocations(listings);
        applyFilters();
    } catch (error) {
        console.error('Failed to load listings:', error);
        listings = fallbackListings;
        filteredListings = [...listings];
        populateLocations(listings);
        applyFilters();
    }
};

applyFiltersBtn?.addEventListener('click', applyFilters);

window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    filterLocation.value = params.get('location') || '';
    filterType.value = params.get('type') || '';
    filterMin.value = params.get('minPrice') || '';
    filterMax.value = params.get('maxPrice') || '';

    fetchListings();
});

function normaliseListings(listings) {
    if (!Array.isArray(listings)) return [];
    return listings.map(item => {
        const rawPrice = item.monthly_rent ?? item.price_amount ?? item.price_value ?? (typeof item.price === 'number' ? item.price : Number(String(item.price || '').replace(/[^0-9.]/g, '')));
        const priceValue = Number.isFinite(rawPrice) ? rawPrice : 0;
        const isLet = (item.listing_status || item.status || '').toLowerCase().includes('rent');
        const formattedPrice = item.price_formatted
            || (priceValue ? `£${priceValue.toLocaleString('en-GB')}${isLet ? ' pcm' : ''}` : '')
            || (typeof item.price === 'string' ? item.price : '')
            || item.display_price
            || 'Price on application';

        return {
            id: item.id || item.listing_id || item.reference_number || (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
            image: item.image || item.image_url || item.photo_url || item.thumbnail_url || 'https://res.cloudinary.com/demo/image/upload/v1731950000/london-placeholder.jpg',
            price: formattedPrice,
            location: item.location || item.displayable_address || [item.outcode, item.incode].filter(Boolean).join(' ') || 'London',
            title: item.title || item.description?.slice(0, 60) || 'Premium London Property',
            type: item.property_type || item.type || 'Apartment',
            minPrice: priceValue || 0,
            maxPrice: priceValue || 0,
            bedrooms: item.bedrooms ?? item.num_bedrooms ?? '-',
            bathrooms: item.bathrooms ?? item.num_bathrooms ?? '-',
        };
    });
}
