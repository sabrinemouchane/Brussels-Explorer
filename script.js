// ============================================
// BRUSSELS EXPLORER - PARKEN DATASET
// ============================================

const API_URL = 'https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/parcs_et_jardins_publics/records?limit=100';
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
            populateFilters(filteredData);
            renderFavorites();
            
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
        
        const name = item.name || item.name_fr || 'Onbekend park';
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
            ${item.google_maps ? `<p><a href="${item.google_maps}" target="_blank" class="map-link">Bekijk op kaart</a></p>` : ''}
        `;
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
    const typeFilter = document.getElementById('typeFilter').value;
    
    filteredData = allData.filter(function(item) {
        const name = (item.name || item.name_fr || '').toLowerCase();
        const type = item.type_txt || item.type || '';
        
        const matchesSearch = !searchTerm || name.includes(searchTerm);
        const matchesType = typeFilter === 'all' || type === typeFilter;
        
        return matchesSearch && matchesType;
    });
    
    applySorting();
}

function populateFilters(data) {
    const typeSelect = document.getElementById('typeFilter');
    
    const types = new Set();
    data.forEach(function(item) {
        const type = item.type_txt || item.type;
        if (type) types.add(type);
    });
    
    typeSelect.innerHTML = '<option value="all">Alle types</option>';
    
    types.forEach(function(type) {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeSelect.appendChild(option);
    });
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
            feedback.innerHTML = '<p style="color: green; padding: 10px; background: #e8f5e9; border-radius: 8px;">✅ Bedankt! Je bent ingeschreven voor de nieuwsbrief.</p>';
            form.reset();
        }
    });
}

// ============================================
// START
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    loadFavorites();
    fetchData();
    setupFormValidation();
    
    document.getElementById('searchInput').addEventListener('input', function() {
        setTimeout(applyFilters, 300);
    });
    
    document.getElementById('typeFilter').addEventListener('change', applyFilters);
    document.getElementById('sortOptions').addEventListener('change', applyFilters);
});

console.log('Brussels Explorer geladen!');