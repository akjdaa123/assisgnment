document.addEventListener("DOMContentLoaded", function() {
    generateKeys();
    document.getElementById('fetch-price').addEventListener('click', function() {
        fetchCryptoPrice();
    });
});

async function generateKeys() {

    let array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    let privateKey = Array.from(array, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
    let publicKey = await sha256(privateKey);
    let address = '0x' + (await sha256(publicKey)).slice(-40);

    document.getElementById('public-key').textContent = publicKey;
    document.getElementById('wallet-address').textContent = address;

    // Generate and display QR code
    let qr = new QRious({
        element: document.getElementById('address-qr-code'),
        value: address,
        size: 200
    });
}

function sha256(message) {
    // Perform SHA-256 hashing
    const msgBuffer = new TextEncoder().encode(message);
    return crypto.subtle.digest('SHA-256', msgBuffer).then((hashBuffer) => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    });
}

function fetchCryptoPrice() {
    // Using the CoinGecko API
    const apiURL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            const bcoinPrice = data.bitcoin.usd;
            document.getElementById('crypto-price').textContent = `$${bcoinPrice}`;
        })
        .catch(error => {
            console.error('Error fetching price:', error);
            document.getElementById('crypto-price').textContent = 'Error fetching price';
        });
}