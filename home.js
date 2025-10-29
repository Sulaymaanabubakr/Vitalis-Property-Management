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

const featuredContainer = document.getElementById('featuredProperties');
const heroSearch = document.getElementById('heroSearch');
const locationSelect = document.getElementById('location');
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

const fallbackListings = [
    {
        id: '1',
        image: 'https://res.cloudinary.com/demo/image/upload/v1731950000/luxury-flat-chelsea.jpg',
        price: '£3,950 pcm',
        location: 'Chelsea, SW3',
        title: 'Elegant Two-Bedroom Apartment with River Views',
        type: 'Apartment',
        minPrice: 3950,
        maxPrice: 3950,
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
    }
];

const testimonials = [
    {
        name: 'Charlotte W.',
        image: 'https://res.cloudinary.com/demo/image/upload/v1731950000/testimonial-1.jpg',
        review: 'Vitalis guided us through selling our Kensington flat with absolute professionalism. The marketing and negotiation were impeccable.',
        rating: 5,
    },
    {
        name: 'Raj & Priya S.',
        image: 'https://res.cloudinary.com/demo/image/upload/v1731950000/testimonial-2.jpg',
        review: 'Our portfolio is fully managed by Vitalis. They are proactive, responsive, and trustworthy. Highly recommended for landlords.',
        rating: 5,
    },
    {
        name: 'George H.',
        image: 'https://res.cloudinary.com/demo/image/upload/v1731950000/testimonial-3.jpg',
        review: 'From valuation to completion, the Vitalis team delivered first-class service. We felt supported every step of the way.',
        rating: 4,
    },
    {
        name: 'Sophie T.',
        image: 'https://res.cloudinary.com/demo/image/upload/v1731950000/testimonial-4.jpg',
        review: 'The lettings team found high-quality tenants quickly and handled the entire process seamlessly. A premium experience.',
        rating: 5,
    }
];

const createSkeletons = (count = 6) => {
    featuredContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'loading-card';
        skeleton.setAttribute('aria-hidden', 'true');
        featuredContainer.appendChild(skeleton);
    }
};

const renderProperties = listings => {
    featuredContainer.innerHTML = '';
    listings.forEach(listing => {
        const card = document.createElement('article');
        card.className = 'property-card';
        card.setAttribute('data-animate', '');

        card.innerHTML = `
            <div class="property-image" style="background-image:url('${listing.image}')"></div>
            <div class="property-body">
                <span class="property-price">${listing.price}</span>
                <h3>${listing.title}</h3>
                <p class="property-location">${listing.location}</p>
                <a href="/properties.html#${listing.id}" class="btn btn-outline">View Details</a>
            </div>
        `;
        featuredContainer.appendChild(card);
    });
    observeAnimations();
};

const fetchListings = async () => {
    createSkeletons(10);
    if (!firestore) {
        cacheListings(fallbackListings);
        renderRandomListings(fallbackListings);
        populateLocations(fallbackListings);
        return;
    }

    try {
        const listingsDoc = await getDoc(doc(firestore, 'integrations', 'zooplaListings'));
        if (listingsDoc.exists()) {
            const data = listingsDoc.data();
            const listings = normaliseListings(data?.properties ?? []);
            if (listings.length) {
                cacheListings(listings);
                renderRandomListings(listings);
                populateLocations(listings);
                return;
            }
        }
        cacheListings(fallbackListings);
        renderRandomListings(fallbackListings);
        populateLocations(fallbackListings);
    } catch (error) {
        console.error('Failed to load listings from Firebase:', error);
        cacheListings(fallbackListings);
        renderRandomListings(fallbackListings);
        populateLocations(fallbackListings);
    }
};

const cacheListings = listings => {
    try {
        localStorage.setItem('vitalis-fallback-listings', JSON.stringify(listings));
    } catch (error) {
        console.warn('Failed to cache listings locally', error);
    }
};

const normaliseListings = listings => {
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
            price: formattedPrice || 'Price on application',
            location: item.location || item.displayable_address || [item.outcode, item.incode].filter(Boolean).join(' ') || 'London',
            title: item.title || item.description?.slice(0, 60) || 'Premium London Property',
            type: item.property_type || item.type || 'Apartment',
            minPrice: priceValue || 0,
            maxPrice: priceValue || 0,
        };
    });
};

const renderRandomListings = listings => {
    const prepared = normaliseListings(listings);
    const shuffled = [...prepared].sort(() => Math.random() - 0.5);
    renderProperties(shuffled.slice(0, 10));
};

const populateLocations = listings => {
    const uniqueLocations = [...new Set(listings.map(item => item.location.split(',')[0].trim()))];
    uniqueLocations.sort().forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationSelect.appendChild(option);
    });
};

heroSearch?.addEventListener('submit', event => {
    event.preventDefault();
    const params = new URLSearchParams();
    const locationValue = heroSearch.location.value;
    if (locationValue) params.append('location', locationValue);
    const typeValue = heroSearch.propertyType.value;
    if (typeValue) params.append('type', typeValue);
    const minValue = heroSearch.minPrice.value;
    if (minValue) params.append('minPrice', minValue);
    const maxValue = heroSearch.maxPrice.value;
    if (maxValue) params.append('maxPrice', maxValue);
    window.location.href = `/properties.html?${params.toString()}`;
});

const handleScroll = () => {
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    if (window.scrollY > 400) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
};

backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
window.addEventListener('scroll', handleScroll);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (event) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
            navLinks.classList.remove('active');
        }
    });
});

hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

const observeAnimations = () => {
    const animated = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    animated.forEach(element => observer.observe(element));
};

const renderTestimonials = () => {
    const track = document.querySelector('.testimonial-track');
    if (!track) return;
    track.innerHTML = '';

    testimonials.forEach(({ name, image, review, rating }) => {
        const card = document.createElement('article');
        card.className = 'testimonial-card';
        card.innerHTML = `
            <div class="testimonial-meta">
                <img src="${image}" alt="${name}">
                <div>
                    <h3>${name}</h3>
                    <div class="star-rating">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</div>
                </div>
            </div>
            <p>${review}</p>
        `;
        track.appendChild(card);
    });

    let index = 0;
    const total = testimonials.length;
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    const updateSlide = () => {
        const cardWidth = track.querySelector('.testimonial-card').offsetWidth + 32;
        track.style.transform = `translateX(-${index * cardWidth}px)`;
    };

    const autoSlide = () => {
        index = (index + 1) % total;
        updateSlide();
    };

    let timer = setInterval(autoSlide, 5000);

    const setIndex = newIndex => {
        index = (newIndex + total) % total;
        updateSlide();
        clearInterval(timer);
        timer = setInterval(autoSlide, 5000);
    };

    prevBtn?.addEventListener('click', () => setIndex(index - 1));
    nextBtn?.addEventListener('click', () => setIndex(index + 1));

    window.addEventListener('resize', updateSlide);
    updateSlide();
};

const syncZooplaListings = async () => {
    if (!firestore) return;
    try {
        await fetch('https://your-cloud-function-url/zoopla-sync', {
            method: 'POST',
        });
    } catch (error) {
        console.warn('Zoopla sync trigger failed (fallback to scheduled sync).', error);
    }
};

window.addEventListener('DOMContentLoaded', () => {
    observeAnimations();
    renderTestimonials();
    fetchListings();
    syncZooplaListings();
});
