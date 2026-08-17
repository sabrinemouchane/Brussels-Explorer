# Brussels Explorer - Ontdek de parken van Brussel

Dit project is ontwikkeld in het kader van het herexamen voor het vak Dynamic Web aan de Erasmushogeschool Brussel (EHB). Het betreft een interactieve webapplicatie die gebruik maakt van de OpenData Brussels API om parken en groene ruimtes in Brussel te ontdekken.

**Auteur:** Sabrine Mouchane

---

## 1. Voorbereiding & Voorstel (Start with Why)

Binnen het Brussels Hoofdstedelijk Gewest zijn er talrijke parken en groene ruimtes die vaak onontdekt blijven door zowel inwoners als toeristen. Het doel van dit project is om een gebruiksvriendelijke applicatie te creëren waarmee gebruikers deze groene parels kunnen ontdekken, filteren, sorteren en opslaan in persoonlijke favorietenlijsten.

Na het verkennen van de OpenData Brussels API en het checken van de haalbaarheid, is dit projectplan uitgewerkt. Het doel is de gebruikerservaring te verbeteren via intuïtieve UI/UX-design principes (Design Thinking), het vergemakkelijken van het vinden van parken, en het bieden van een persoonlijke collectie via favorieten. De planning en de uitwerking van de analyse werden nauwkeurig voorbereid.

---

## 2. Realisatie Softwareproject (Functionaliteiten)

De applicatie maakt gebruik van moderne JavaScript-concepten en volgt de vereisten van de opgave. De code is iteratief opgebouwd via een GIT repository met duidelijke commit-berichten.

**Gebruiker:** De gebruiker kan parken ontdekken, zoeken, filteren op favorieten, sorteren, favorieten opslaan en details bekijken.

**Functionele vereisten:**

- Data ophalen: Parken worden opgehaald via de OpenData Brussels API met Fetch en Async/Await.
- Lijstweergave: Parken worden getoond in een grid met 6 velden: naam, type, categorie, postcode, adres en foto.
- Interactieve kaart: Leaflet kaart met markers voor elk park. Klik op een marker voor de naam en het type.
- Zoekfunctie: Zoeken op parknaam via de zoekbalk. De lijst en kaart worden automatisch geüpdatet.
- Sorteren: Parken kunnen gesorteerd worden op naam via een dropdown menu.
- Favorieten: Parken kunnen worden toegevoegd aan favorieten. Favorieten worden bovenaan de pagina getoond en blijven bewaard via LocalStorage.
- Favorieten filter: Klik op de Favorieten knop in de header om alleen favoriete parken te tonen.
- Detailweergave: Klik op een park voor meer details: naam, type, categorie, postcode, adres en een foto.
- Formulier validatie: Een nieuwsbriefformulier met validatie voor e-mail en bericht.
- Responsive design: De applicatie werkt op desktop, tablet en mobiel.

---

## 3. Quality Assurance & Architectuur

Het project is gestructureerd volgens de standaard webontwikkelingspraktijken en volgt een duidelijke scheiding tussen HTML, CSS en JavaScript. De deliverables zijn gerespecteerd.

- Frontend: HTML, CSS, JavaScript - De applicatie draait volledig in de browser.
- Styling: CSS met Flexbox en Grid - Voor een moderne, responsieve layout.
- Kaart: Leaflet.js - Interactieve kaart met markers voor parken.
- Data: OpenData Brussels API - Echte data van parken en groene ruimtes in Brussel.
- Opslag: LocalStorage - Favorieten worden lokaal opgeslagen.
- Validatie: JavaScript - Formulier validatie in de browser.

**JavaScript-concepten toegepast:**

- DOM manipulatie: renderData(), renderTopFavorites() - Elementen selecteren, aanmaken en aanpassen.
- Constanten: const API_URL, const STORAGE_KEY - Variabelen die niet veranderen.
- Template literals: `<h3>${name}</h3>` - HTML strings met variabelen.
- Array methodes: forEach(), filter(), some(), sort() - Data verwerken en filteren.
- Arrow functions: item => item.name - Moderne functiesyntaxis.
- Ternary operator: isFav ? 'verwijder' : 'toevoegen' - Korte if-else voor favorieten status.
- Callback functions: addEventListener('click', function() {...}) - Functies als parameter.
- Async & Await: async function fetchData() { await fetch(...) } - Asynchrone data ophalen.
- Fetch API: await fetch(API_URL) - Data ophalen van de API.
- JSON manipulatie: data.results, JSON.parse(), JSON.stringify() - Data structuur verwerken en opslaan.
- LocalStorage: localStorage.setItem(), localStorage.getItem() - Favorieten opslaan.
- Observer API: new MutationObserver() - Detecteren van veranderingen in de favorieten sectie.

---

## 4. Documentatie & Installatie

Onderstaande kwaliteitsvolle documentatie beschrijft de vereiste stappen voor het opzetten van de ontwikkelomgeving. Functies en methodes zijn in de code gedocumenteerd volgens de gangbare standaarden.

**Installatiehandleiding**

Vereisten:
- Een moderne webbrowser (Chrome, Firefox, Edge)
- Internetverbinding (voor de API en Leaflet kaart)

Stappen:

```bash
# 1. Clone de repository
git clone https://github.com/sabrinemouchane/Brussels-Explorer.git

# 2. Ga naar de projectmap
cd Brussels-Explorer

# 3. Open het project in VS Code (optioneel)
code .

# 4. Open index.html in je browser
# Optie 1: Dubbelklik op index.html
# Optie 2: Gebruik Live Server in VS Code
