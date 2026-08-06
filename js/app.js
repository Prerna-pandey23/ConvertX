const themeBtn = document.getElementById("themeBtn");
const copyBtn = document.getElementById("copyBtn");
const swapBtn = document.getElementById("swapBtn");
const amount = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");

const resultText = document.getElementById("resultText");
const updateTime = document.getElementById("updateTime");

const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");

const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

// =======================
// Populate Dropdowns
// =======================

for (let currCode in countryList) {

    let option1 = document.createElement("option");
    option1.value = currCode;
    option1.innerText = currCode;

    if (currCode === "USD") {
        option1.selected = true;
    }

    fromCurrency.append(option1);

    let option2 = document.createElement("option");
    option2.value = currCode;
    option2.innerText = currCode;

    if (currCode === "INR") {
        option2.selected = true;
    }

    toCurrency.append(option2);
}

// =======================
// Update Flags
// =======================

function updateFlag() {

    const fromCode = countryList[fromCurrency.value];
    const toCode = countryList[toCurrency.value];

    fromFlag.src = `https://flagsapi.com/${fromCode}/flat/64.png`;
    toFlag.src = `https://flagsapi.com/${toCode}/flat/64.png`;
}

// =======================
// Currency Conversion
// =======================

async function convertCurrency() {

    let amt = amount.value.trim();

    if (amt === "") {
        resultText.innerText = "Enter an amount";
        updateTime.innerText = "Waiting for input...";
        return;
    }

    amt = Number(amt);

    if (amt <= 0) {
        resultText.innerText = "Amount must be greater than 0";
        updateTime.innerText = "Invalid amount";
        return;
    }

    const from = fromCurrency.value.toLowerCase();
    const to = toCurrency.value.toLowerCase();

    const url = `${BASE_URL}/${from}.json`;

    try {

        resultText.innerText = "Converting...";
        updateTime.innerText = "Fetching live exchange rate...";

        const response = await fetch(url);
        const data = await response.json();

        const rate = data[from][to];

        const finalAmount = (amt * rate).toFixed(2);

        resultText.innerText =
            `${amt} ${fromCurrency.value} = ${finalAmount} ${toCurrency.value}`;

        updateTime.innerText =
            `Updated : ${new Date().toLocaleTimeString()}`;

    } catch (error) {

        resultText.innerText = "Conversion Failed";
        updateTime.innerText = "Check Internet Connection";

        console.error(error);
    }
}

// =======================
// Events
// =======================

copyBtn.addEventListener("click", async () => {

    try {

        if (navigator.clipboard && window.isSecureContext) {

            await navigator.clipboard.writeText(resultText.innerText);

        } else {

            const textArea = document.createElement("textarea");

            textArea.value = resultText.innerText;

            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";

            document.body.appendChild(textArea);

            textArea.focus();
            textArea.select();

            document.execCommand("copy");

            textArea.remove();
        }

        copyBtn.innerText = "✅ Copied";

        setTimeout(() => {
            copyBtn.innerText = "📋 Copy Result";
        }, 2000);

    } catch (err) {

        console.error(err);
        alert("Copy failed!");

    }

});
// Convert Button
convertBtn.addEventListener("click", convertCurrency);

// Swap Button
swapBtn.addEventListener("click", () => {

    let temp = fromCurrency.value;

    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;

    updateFlag();
    convertCurrency();

});

// Amount Change
amount.addEventListener("input", convertCurrency);

// Currency Change
fromCurrency.addEventListener("change", () => {

    updateFlag();
    convertCurrency();

});

toCurrency.addEventListener("change", () => {

    updateFlag();
    convertCurrency();

});

// =======================
// On Page Load
// =======================

window.addEventListener("load", () => {

    // Restore Theme

const savedTheme = localStorage.getItem("theme");

if(savedTheme === "dark"){

    document.body.classList.add("dark");
    themeBtn.innerText = "☀️";

}else{

    themeBtn.innerText = "🌙";

}

    updateFlag();

    if (amount.value.trim() !== "") {
        convertCurrency();
    } else {
        resultText.innerText = "Enter an amount";
        updateTime.innerText = "Waiting for input...";
    }

});

// =======================
// Dark Mode
// =======================

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        themeBtn.innerText = "☀️";
        localStorage.setItem("theme", "dark");

    }else{

        themeBtn.innerText = "🌙";
        localStorage.setItem("theme", "light");

    }

});