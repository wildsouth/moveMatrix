

const range = document.getElementById("distanceRange");

function updateSliderBackground() {
    const value = (range.value - range.min) / (range.max - range.min) * 100;
    range.style.background = `linear-gradient(to right, #FF3508 ${value}%, #cccccc ${value}%)`;
}

range.addEventListener("input", updateSliderBackground);

// Set initial state
updateSliderBackground();


//  ****** ********  //
//**  calculation **// 


document.addEventListener("DOMContentLoaded", function () {
    const freightSelect = document.getElementById("customSelect");
    const distanceRange = document.getElementById("distanceRange");
    const refrigeratedToggle = document.getElementById("refrigeratedToggle");
    const rangeValueDisplay = document.getElementById("rangeValue");
    const totalDisplay = document.getElementById("totalAmount");
    const currencySelect = document.getElementById("currencySelector");
    const unitSelect = document.getElementById("unitSelect");

    let exchangeRates = {
        USD: 1,
        EUR: 0.85,
        NGN: 1500
    }; // fallback default

    const locales = {
        USD: 'en-US',
        EUR: 'de-DE',
        NGN: 'en-NG'
    };

    let currentCurrency = currencySelect.value;
    let currentUnit = unitSelect.value;

    async function fetchExchangeRates() {
        try {
            const res = await fetch("https://api.exchangerate.host/latest?base=USD");
            const data = await res.json();
            if (data && data.rates) {
                exchangeRates = data.rates;
                console.log("Exchange rates updated");
            } else {
                console.warn("Invalid data. Using fallback rates.");
            }
        } catch (error) {
            console.warn("Failed to fetch exchange rates. Using fallback.", error);
        }
    }

    function formatCurrency(amount, currencyCode) {
        return new Intl.NumberFormat(locales[currencyCode], {
            style: "currency",
            currency: currencyCode,
            maximumFractionDigits: 2
        }).format(amount);
    }

    function calculateTotal() {
        const freightValue = freightSelect.value;
        const isRefrigerated = refrigeratedToggle.checked;
        currentCurrency = currencySelect.value;
        currentUnit = unitSelect.value;

        distanceRange.max = currentUnit === "km" ? 160 : 100;
        const distance = parseInt(distanceRange.value) || 0;
        rangeValueDisplay.textContent = `${distance} ${currentUnit}`;

        if (!freightValue || isNaN(parseInt(freightValue))) {
            totalDisplay.textContent = formatCurrency(0, currentCurrency);
            return;
        }

        const ratio = parseInt(freightValue.split("-")[0]);
        const miles = currentUnit === "km" ? distance * 0.621371 : distance;

        let base = (miles * ratio) / 100;
        if (isRefrigerated) base *= 1.1;

        const rate = exchangeRates[currentCurrency] || 1;
        const converted = base * rate;

        totalDisplay.textContent = formatCurrency(converted, currentCurrency);
    }

    // Attach event listeners
    [freightSelect, refrigeratedToggle, currencySelect, unitSelect].forEach(el => {
        el.addEventListener("change", calculateTotal);
    });
    distanceRange.addEventListener("input", calculateTotal);

    // Initial setup
    fetchExchangeRates().then(calculateTotal);
});


//  ****** ********  //
//**  faq **// 


document.addEventListener("DOMContentLoaded", () => {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");

        question.addEventListener("click", () => {
            // Accordion behavior — close others
            faqItems.forEach(i => {
                if (i !== item) i.classList.remove("active");
            });

            // Toggle current
            item.classList.toggle("active");
        });
    });
});


//  ****** ********  //
//**  email **// 


document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const emailInput = form.querySelector('input[type="email"]');
    const checkbox = form.querySelector("#agreeTerms");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent actual submission

        const email = emailInput.value.trim();
        const agreed = checkbox.checked;

        // Simple email check
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === "") {
            alert("Please enter your email address.");
            emailInput.focus();
            return;
        }

        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            emailInput.focus();
            return;
        }

        if (!agreed) {
            alert("You must agree to the terms and policies.");
            checkbox.focus();
            return;
        }

        // All valid – show thank you and reset
        alert("Thanks for subscribing!");

        form.reset(); // Clears the input and checkbox
    });
});