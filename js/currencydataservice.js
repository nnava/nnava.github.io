define(['./alasqllocalization', './money.min'], function(alasqllocalization, money) {

    var currencyArray = ['USD', 'CAD', 'EUR', 'NOK', 'SEK', 'DKK'];
    var userCurrency = "SEK";

    function fillCurrencyData() {
        userCurrency = alasqllocalization.getUserCurrency();

        currencyArray.forEach(function(currency) {
            if(userCurrency == currency) return;
            $.getJSON("https://api.fixer.io/latest?base=" + currency, getCurrencyData)
        });
    }

    var getCurrencyData = function(data) {
        alasql('INSERT INTO CurrencyData VALUES ("' + data.base + '", ' + data.rates[userCurrency] + ');');
    }

    return { 
        fillCurrencyData: fillCurrencyData
    };
});