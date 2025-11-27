const apiUrl = 'https://raw.githubusercontent.com/CertMusashi/Chande-api/refs/heads/main/arz.json?' + new Date().getTime();
let userCurrencies = JSON.parse(localStorage.getItem('userCurrencies')) || ["usd", "eur", "18ayar","btc"];
let reversePriceColors = localStorage.getItem('reversePriceColors') === 'true';

function createCard(currency) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.id = currency.code;

    const currencyInfo = document.createElement('div');
    currencyInfo.classList.add('currency-info');

    const flag = document.createElement('img');
    flag.classList.add('flag');
    flag.src = currency.icon;

    const nameAndCode = document.createElement('div');
    nameAndCode.classList.add('name-and-code');

    const name = document.createElement('p');
    name.classList.add('name');
    name.textContent = currency.en;

    const code = document.createElement('p');
    code.classList.add('code');
    code.textContent = currency.code.toUpperCase();

    nameAndCode.appendChild(name);
    nameAndCode.appendChild(code);
    currencyInfo.appendChild(flag);
    currencyInfo.appendChild(nameAndCode);

    const priceInfo = document.createElement('div');
    priceInfo.classList.add('price-info');

    const change = document.createElement('p');
    change.classList.add('change');

    const price = document.createElement('p');
    price.classList.add('price');

    priceInfo.appendChild(change);
    priceInfo.appendChild(price);
    card.appendChild(currencyInfo);
    card.appendChild(priceInfo);

    return card;
}

function openCurrencySelector() {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content', 'manage-cards-modal');

    const header = document.createElement('div');
    header.classList.add('modal-header');

    const title = document.createElement('h2');
    title.textContent = 'Manage Cards';

    const closeButton = document.createElement('span');
    closeButton.classList.add('close');
    closeButton.textContent = '×';
    closeButton.addEventListener('click', () => modal.remove());

    header.appendChild(title);
    header.appendChild(closeButton);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Search bar
    const searchContainer = document.createElement('div');
    searchContainer.classList.add('search-container');

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.classList.add('search-input');
    searchInput.placeholder = 'Search currencies...';

    searchContainer.appendChild(searchInput);

    // Currency list container
    const currencyList = document.createElement('div');
    currencyList.classList.add('currency-list');

    modalContent.appendChild(header);
    modalContent.appendChild(searchContainer);
    modalContent.appendChild(currencyList);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const renderCurrencies = (filter = '') => {
                currencyList.innerHTML = '';
                const filteredCurrencies = data.currencies.filter(currency => 
                    currency.name.toLowerCase().includes(filter.toLowerCase()) ||
                    currency.code.toLowerCase().includes(filter.toLowerCase()) ||
                    (currency.en && currency.en.toLowerCase().includes(filter.toLowerCase()))
                );

                filteredCurrencies.forEach(currency => {
                    const currencyItem = document.createElement('div');
                    currencyItem.classList.add('currency-item');

                    const currencyInfo = document.createElement('div');
                    currencyInfo.classList.add('currency-item-info');

                    const label = document.createElement('label');
                    label.htmlFor = `currency-${currency.code}`;
                    label.textContent = `${currency.name} (${currency.code.toUpperCase()})`;

                    currencyInfo.appendChild(label);

                    const toggleWrapper = document.createElement('label');
                    toggleWrapper.classList.add('toggle-switch');

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `currency-${currency.code}`;
                    checkbox.checked = userCurrencies.includes(currency.code);
                    checkbox.addEventListener('change', () => {
                        if (checkbox.checked) {
                            userCurrencies.push(currency.code);
                        } else {
                            userCurrencies = userCurrencies.filter(code => code !== currency.code);
                        }
                        localStorage.setItem('userCurrencies', JSON.stringify(userCurrencies));
                        updateCurrencyData();
                    });

                    const slider = document.createElement('span');
                    slider.classList.add('slider');

                    toggleWrapper.appendChild(checkbox);
                    toggleWrapper.appendChild(slider);

                    currencyItem.appendChild(currencyInfo);
                    currencyItem.appendChild(toggleWrapper);
                    currencyList.appendChild(currencyItem);
                });

                if (filteredCurrencies.length === 0) {
                    const noResults = document.createElement('p');
                    noResults.classList.add('no-results');
                    noResults.textContent = 'No currencies found';
                    currencyList.appendChild(noResults);
                }
            };

            renderCurrencies();

            searchInput.addEventListener('input', (e) => {
                renderCurrencies(e.target.value);
            });
        });

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

function openSettings() {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content', 'settings-modal');

    const header = document.createElement('div');
    header.classList.add('modal-header');

    const title = document.createElement('h2');
    title.textContent = 'Settings';

    const closeButton = document.createElement('span');
    closeButton.classList.add('close');
    closeButton.textContent = '×';
    closeButton.addEventListener('click', () => modal.remove());

    header.appendChild(title);
    header.appendChild(closeButton);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Settings list
    const settingsList = document.createElement('div');
    settingsList.classList.add('settings-list');

    // Dark Mode setting
    const darkModeItem = document.createElement('div');
    darkModeItem.classList.add('settings-item');

    const darkModeLabel = document.createElement('span');
    darkModeLabel.classList.add('settings-label');
    darkModeLabel.textContent = 'Dark Mode';

    const darkModeToggle = document.createElement('label');
    darkModeToggle.classList.add('toggle-switch');

    const darkModeCheckbox = document.createElement('input');
    darkModeCheckbox.type = 'checkbox';
    darkModeCheckbox.checked = document.body.classList.contains('dark-mode');
    darkModeCheckbox.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode', darkModeCheckbox.checked);
        localStorage.setItem('darkMode', darkModeCheckbox.checked);
    });

    const darkModeSlider = document.createElement('span');
    darkModeSlider.classList.add('slider');

    darkModeToggle.appendChild(darkModeCheckbox);
    darkModeToggle.appendChild(darkModeSlider);

    darkModeItem.appendChild(darkModeLabel);
    darkModeItem.appendChild(darkModeToggle);

    // Price Color Reverse setting
    const priceColorItem = document.createElement('div');
    priceColorItem.classList.add('settings-item');

    const priceColorLabel = document.createElement('span');
    priceColorLabel.classList.add('settings-label');
    priceColorLabel.textContent = 'Reverse Price Colors';

    const priceColorToggle = document.createElement('label');
    priceColorToggle.classList.add('toggle-switch');

    const priceColorCheckbox = document.createElement('input');
    priceColorCheckbox.type = 'checkbox';
    priceColorCheckbox.checked = reversePriceColors;
    priceColorCheckbox.addEventListener('change', () => {
        reversePriceColors = priceColorCheckbox.checked;
        localStorage.setItem('reversePriceColors', reversePriceColors);
        updateCurrencyData();
    });

    const priceColorSlider = document.createElement('span');
    priceColorSlider.classList.add('slider');

    priceColorToggle.appendChild(priceColorCheckbox);
    priceColorToggle.appendChild(priceColorSlider);

    priceColorItem.appendChild(priceColorLabel);
    priceColorItem.appendChild(priceColorToggle);

    // Cards Size setting
    const gridSizeItem = document.createElement('div');
    gridSizeItem.classList.add('settings-item');

    const gridSizeLabel = document.createElement('span');
    gridSizeLabel.classList.add('settings-label');
    gridSizeLabel.textContent = 'Cards Size';

    const gridInput = document.createElement('input');
    gridInput.type = 'number';
    gridInput.classList.add('size-input');
    gridInput.value = localStorage.getItem('gridSize') || 155;
    gridInput.min = 100;
    gridInput.max = 300;
    gridInput.addEventListener('input', () => {
        const size = gridInput.value || 155;
        document.documentElement.style.setProperty('--grid-size', size + 'px');
        localStorage.setItem('gridSize', size);
    });

    gridSizeItem.appendChild(gridSizeLabel);
    gridSizeItem.appendChild(gridInput);

    // Manage Cards button
    const manageCardsItem = document.createElement('div');
    manageCardsItem.classList.add('settings-item', 'manage-cards-btn-container');

    const manageCardsBtn = document.createElement('button');
    manageCardsBtn.textContent = 'Manage Cards';
    manageCardsBtn.classList.add('manage-cards-btn');
    manageCardsBtn.addEventListener('click', () => {
        modal.remove();
        openCurrencySelector();
    });

    manageCardsItem.appendChild(manageCardsBtn);

    settingsList.appendChild(darkModeItem);
    settingsList.appendChild(priceColorItem);
    settingsList.appendChild(gridSizeItem);
    settingsList.appendChild(manageCardsItem);

    modalContent.appendChild(header);
    modalContent.appendChild(settingsList);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

// Initialize settings on page load
document.addEventListener('DOMContentLoaded', () => {
    // Settings button
    document.getElementById('settings-btn').addEventListener('click', openSettings);

    // Restore saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Restore saved grid size
    const gridSize = localStorage.getItem('gridSize') || 155;
    document.documentElement.style.setProperty('--grid-size', gridSize + 'px');
});


async function fetchCurrencyData() {
    try {
        const response = await fetch(apiUrl);
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

function calculatePriceChange(currentPrice, previousPrice) {
    return previousPrice ? (currentPrice - previousPrice).toFixed(2) : 0;
}

function saveLastSeenPrice(currencyCode, price) {
    localStorage.setItem(`lastSeenPrice_${currencyCode}`, price);
}

function getLastSeenPrice(currencyCode) {
    return parseFloat(localStorage.getItem(`lastSeenPrice_${currencyCode}`)) || 0;
}

function formatPrice(price) {
    if (price >= 1000000) {
        return `${(price / 1000000).toLocaleString('en-US', { maximumFractionDigits: 3 })}M`;
    } else if (price >= 1) {
        return price.toLocaleString('en-US');
    } else if (price > 0) {
        return price.toExponential(3); 
    } else {
        return "0";
    }
}

async function updateCurrencyData() {
    const grid = document.getElementById('currency-grid');
    const fragment = document.createDocumentFragment();

    const data = await fetchCurrencyData();
    if (!data) return;

    const dateElement = document.getElementById('datetime');
    dateElement.textContent = `${data.date}`;

    if (!data.currencies) {
        const message = document.createElement('p');
        message.textContent = "Updating, we'll be back soon :)";
        message.style.textAlign = 'center';
        message.style.fontSize = '1.2rem';
        message.style.marginTop = '20px';

        grid.replaceChildren(message);
        return;
    }

    const requests = userCurrencies.map(code => data.currencies.find(c => c.code === code));
    
    requests.forEach(currency => {
        if (currency) {
            const card = createCard(currency);

            const priceElement = card.querySelector('.price');
            const changeElement = card.querySelector('.change');

            let currentPrice = currency.price;

            // Get previous price from localStorage
            const lastSeenPrice = getLastSeenPrice(currency.code);

            // Calculate price change
            const priceChange = Math.floor(calculatePriceChange(currentPrice, lastSeenPrice));

            // Display price change
            const increaseColor = reversePriceColors ? '#e74c3c' : '#2ecc71';
            const decreaseColor = reversePriceColors ? '#2ecc71' : '#e74c3c';

            if (priceChange > 0) {
                changeElement.textContent = `↑ ${priceChange.toLocaleString('en-US')}`;
                changeElement.style.color = increaseColor;
            } else if (priceChange < 0) {
                changeElement.textContent = `↓ ${Math.abs(priceChange).toLocaleString('en-US')}`;
                changeElement.style.color = decreaseColor;
            } else {
                changeElement.textContent = '';
            }

            // Save new price to localStorage
            saveLastSeenPrice(currency.code, currentPrice);

            // Display formatted price
            priceElement.textContent = formatPrice(currentPrice);

            fragment.appendChild(card);
        }
    });

    grid.replaceChildren(fragment);
}

// Fetch data on page load
updateCurrencyData();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('src/service-worker.js')
            .then(registration => console.log('Service Worker registered:', registration.scope))
            .catch(error => console.error('Service Worker registration failed:', error));
    });
}