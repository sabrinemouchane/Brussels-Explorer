// ============================================
// BRUSSELS EXPLORER - PARKEN DATASET
// ============================================

const API_URL = 'https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/parcs_et_jardins_publics/records?limit=20';
const STORAGE_KEY = 'brussels_favorites';

let allData = [];
let filteredData = [];
let favorites = [];

// ============================================
// DATA OPHALEN
// ============================================

async function fetchData() {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = '<p>Data wordt geladen...</p>';
    
    try {
        console.log('Data ophalen...');
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('HTTP error! Status: ' + response.status);
        }
        
        const data = await response.json();
        console.log('Data ontvangen:', data);
        
        if (data.results && data.results.length > 0) {
            allData = data.results;
            filteredData = [...allData];
            
            renderData(filteredData);
            renderFavorites();
            initMap(filteredData);
            
            console.log(allData.length + ' parken geladen!');
        } else {
            container.innerHTML = '<p>Geen parken gevonden.</p>';
        }
    } catch (error) {
        console.error('Fout:', error);
        container.innerHTML = `
            <p style="color: red; padding: 20px; background: #ffeeee; border-radius: 8px;">
                Fout bij laden: ${error.message}
            </p>
        `;
    }
}

function initMap(data) {
    // Maak kaart aan (centrum van Brussel)
    const map = L.map('map').setView([50.85, 4.35], 13);
    
    // Voeg achtergrondkaart toe (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
    
    // Voeg markers toe voor elk park
    data.forEach(item => {
        if (item.geo_coord_wgs84) {
            const lat = item.geo_coord_wgs84.lat;
            const lon = item.geo_coord_wgs84.lon;
            if (lat && lon) {
                L.marker([lat, lon])
                    .addTo(map)
                    .bindPopup(`<b>${item.name || item.name_fr || 'Park'}</b><br>${item.type_txt || ''}`);
            }
        }
    });
}

// ============================================
// DATA RENDEREN
// ============================================

function renderData(data) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = '';
    
    if (!data || data.length === 0) {
        container.innerHTML = '<p>Geen parken gevonden.</p>';
        return;
    }
    
    data.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'location-card';
        
        const name = item.name_nl || 'Onbekend park';
        const type = item.type_txt || item.type || 'Onbekend';
        const category = item.category_nl || 'Groene ruimte';
        const postal = item.postalcode || 'Onbekend';
        const municipality = item.municipality_nl || 'Brussel';
        
        const isFav = favorites.some(fav => (fav.name || fav.name_fr) === (item.name || item.name_fr));
        
        card.innerHTML = `
            <h3>${name}</h3>
            <p><strong>Type:</strong> ${type}</p>
            <p><strong>Categorie:</strong> ${category}</p>
            <p><strong>Postcode:</strong> ${postal}</p>
        `;

         // Klik om detail te openen
        card.addEventListener('click', function() {
            openDetail(index);
        });
        container.appendChild(card);
    });
    
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', handleFavoriteToggle);
    });
}

// ============================================
// FILTERS & ZOEKEN
// ============================================

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();    
    
    filteredData = allData.filter(function(item) {
        const name = (item.name || item.name_fr || '').toLowerCase();
        const type = item.type_txt || item.type || '';
        const matchesSearch = !searchTerm || name.includes(searchTerm);        
        return matchesSearch;
    });
    
    applySorting();
    initMap(filiteredData);
}

// ============================================
// SORTEREN
// ============================================

function applySorting() {
    const sortBy = document.getElementById('sortOptions').value;
    
    filteredData.sort(function(a, b) {
        let valueA, valueB;
        
        if (sortBy === 'name') {
            valueA = (a.name || a.name_fr || '').toLowerCase();
            valueB = (b.name || b.name_fr || '').toLowerCase();
        } else if (sortBy === 'type') {
            valueA = a.type_txt || a.type || '';
            valueB = b.type_txt || b.type || '';
        } else if (sortBy === 'postal') {
            valueA = a.postalcode || '';
            valueB = b.postalcode || '';
        } else {
            valueA = '';
            valueB = '';
        }
        
        if (valueA < valueB) return -1;
        if (valueA > valueB) return 1;
        return 0;
    });
    
    renderData(filteredData);
}

// ============================================
// FAVORIETEN
// ============================================

function loadFavorites() {
    const stored = localStorage.getItem(STORAGE_KEY);
    favorites = stored ? JSON.parse(stored) : [];
}

function saveFavorites() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

function handleFavoriteToggle(event) {
    const index = parseInt(event.target.dataset.id);
    const item = filteredData[index];
    if (!item) return;
    
    const itemName = item.name || item.name_fr;
    const isFav = favorites.some(function(fav) {
        return (fav.name || fav.name_fr) === itemName;
    });
    
    if (isFav) {
        favorites = favorites.filter(function(fav) {
            return (fav.name || fav.name_fr) !== itemName;
        });
    } else {
        favorites.push(item);
    }
    
    saveFavorites();
    renderData(filteredData);
    renderFavorites();
}

function renderFavorites() {
    const container = document.getElementById('favoritesList');
    container.innerHTML = '';
    
    if (!favorites || favorites.length === 0) {
        container.innerHTML = '<p>Geen favoriete parken toegevoegd.</p>';
        return;
    }
    
    favorites.forEach(function(item) {
        const div = document.createElement('div');
        div.className = 'favorite-item';
        const name = item.name || item.name_fr || 'Onbekend park';
        div.innerHTML = `
            <span>${name}</span>
            <button class="remove-fav" data-name="${name}">✕</button>
        `;
        container.appendChild(div);
    });
    
    document.querySelectorAll('.remove-fav').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            const name = e.target.dataset.name;
            favorites = favorites.filter(function(fav) {
                return (fav.name || fav.name_fr) !== name;
            });
            saveFavorites();
            renderFavorites();
            renderData(filteredData);
        });
    });
}

// ============================================
// FORMULIER VALIDATIE
// ============================================

function setupFormValidation() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        let isValid = true;
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        const emailError = document.getElementById('emailError');
        const messageError = document.getElementById('messageError');
        const feedback = document.getElementById('formFeedback');
        
        emailError.textContent = '';
        messageError.textContent = '';
        feedback.textContent = '';
        email.style.borderColor = '';
        message.style.borderColor = '';
        
        if (!email.value || !email.value.includes('@')) {
            emailError.textContent = 'Vul een geldig e-mailadres in (met @).';
            email.style.borderColor = 'red';
            isValid = false;
        }
        
        if (!message.value || message.value.length < 10) {
            messageError.textContent = 'Bericht moet minstens 10 tekens bevatten.';
            message.style.borderColor = 'red';
            isValid = false;
        }
        
        if (isValid) {
            feedback.innerHTML = '<p style="color: green; padding: 10px; background: #e8f5e9; border-radius: 8px;">Bedankt! Je bent ingeschreven voor de nieuwsbrief.</p>';
            form.reset();
        }
    });
}

// ============================================
// START
// ============================================

function openDetail(index) {
    console.log('Klik ontvangen op index:', index);
    
    const item = filteredData[index];
    console.log('Item gevonden:', item);
    
    if (!item) {
        console.log('Geen item gevonden!');
        return;
    }
    
    const modal = document.getElementById('detailModal');
    const content = document.getElementById('detailContent');
    
    if (!modal || !content) {
        console.log('Modal of content niet gevonden!');
        return;
    }
    
    const name = item.name_nl || 'Onbekend park';
    const type = item.type_txt || item.type || 'Onbekend';
    const category = item.category_nl || 'Groene ruimte';
    const postal = item.postalcode || 'Onbekend';

     let address = item.address_nl || item.address_fr || 'Geen adres beschikbaar';
    if (name.includes('Sint-Lambertusplein') || name.includes('Sint-Lambertusplein')) {
        address = 'Sint-Lambertusplein, 1020 Brussel';
    } else if (name.includes('UVC Brugmann') || name.includes('Brugmann')) {
    address = 'Arthur Van Gehuchtenplein 4, 1020 Brussel';
    } else if (name.includes('Godhuis tuin 1') || name.includes('Godhuis tuin 1')) {
    address = 'Grootgodshuisstraat 7, 1000 Brussel';
} else if (name.includes('Bruyn Noordpark') || name.includes('Parc Bruyn Nord')) {
    address = 'Rue Bruyn 153, 1120 Neder-Over-Heembeek';

    }

    console.log('Data voor modal:', { name, type, category, postal, address });
    
    // AFBEELDING - MET ABSOLUUT PAD
       let imageHtml = '';
    const nameLower = name.toLowerCase();
    
    if (nameLower.includes('sint-lambertusplein') || nameLower.includes('place saint-lambert')) {
        imageHtml = `<img src="./park.jpg" alt="${name}" class="detail-image" style="width:100%; max-height:300px; object-fit:cover; border-radius:8px; margin-bottom:15px;" onerror="this.outerHTML='<div class=\\'detail-placeholder\\'>Foto niet gevonden</div>';">`;
    } else if (nameLower.includes('uvc brugmann') || nameLower.includes('brugmann')) {
        imageHtml = `<img src="./brugmann.jpg" alt="${name}" class="detail-image" style="width:100%; max-height:300px; object-fit:cover; border-radius:8px; margin-bottom:15px;" onerror="this.outerHTML='<div class=\\'detail-placeholder\\'>Foto niet gevonden</div>';">`;
    } else if (nameLower.includes('godhuis') || nameLower.includes('hospice')) {
        imageHtml = `<img src="./godhuis.jpg" alt="${name}" class="detail-image" style="width:100%; max-height:300px; object-fit:cover; border-radius:8px; margin-bottom:15px;" onerror="this.outerHTML='<div class=\\'detail-placeholder\\'>Foto niet gevonden</div>';">`;
    } else if (nameLower.includes('bruyn noordpark') || nameLower.includes('parc bruyn nord')) {
    imageHtml = `<img src="./bruyn.jpg" alt="${name}" class="detail-image" style="width:100%; max-height:300px; object-fit:cover; border-radius:8px; margin-bottom:15px;" onerror="this.outerHTML='<div class=\\'detail-placeholder\\'>Foto niet gevonden</div>';">`;
    } else {
        imageHtml = `<div class="detail-placeholder"> Geen afbeelding beschikbaar</div>`;
    }
    content.innerHTML = `
        <h2>${name}</h2>
        ${imageHtml}
        <div class="detail-info"><strong>Type:</strong> ${type}</div>
        <div class="detail-info"><strong>Categorie:</strong> ${category}</div>
        <div class="detail-info"><strong>Postcode:</strong> ${postal}</div>
        <div class="detail-info"><strong>Adres:</strong> ${address}</div>    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    console.log('Modal zou nu zichtbaar moeten zijn!');
}

function closeDetail() {
    const modal = document.getElementById('detailModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Sluit modal bij klik buiten de content
window.addEventListener('click', function(event) {
    const modal = document.getElementById('detailModal');
    if (event.target === modal) {
        closeDetail();
    }
});

// Sluit modal met ESC toets
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeDetail();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    loadFavorites();
    fetchData();
    setupFormValidation();
    
    document.getElementById('searchInput').addEventListener('input', function() {
        setTimeout(applyFilters, 300);
    });

    document.getElementById('sortOptions').addEventListener('change', applyFilters);

        // Sluitknop voor modal
    document.querySelector('.close-modal').addEventListener('click', closeDetail);
});

console.log('Brussels Explorer geladen!');