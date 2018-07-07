define(['./alasqllocalization'], function(alasqllocalization) {

    var currencySEKLinksArray = ['https://www.avanza.se/index/om-indexet.html/19000/usd-sek',
                                 'https://www.avanza.se/index/om-indexet.html/108701/cad-sek', 
                                 'https://www.avanza.se/index/om-indexet.html/18998/eur-sek', 
                                 'https://www.avanza.se/index/om-indexet.html/53293/nok-sek', 
                                 'https://www.avanza.se/index/om-indexet.html/53292/dkk-sek'];

    var currencyNOKLinksArray = ['https://www.avanza.se/index/om-indexet.html/155727/usd-nok',
                                 'https://www.avanza.se/index/om-indexet.html/155730/eur-nok'];

    var userCurrency = "SEK";

    function fillCurrencyData() {
        userCurrency = alasqllocalization.getUserCurrency();

        if (userCurrency == "SEK") {
            currencySEKLinksArray.forEach(function(currencyLink) {
                fetchInsertCurrencyDataForLink(currencyLink);
            });
        }
        else if (userCurrency == "NOK") {
            currencyNOKLinksArray.forEach(function(currencyLink) {
                fetchInsertCurrencyDataForLink(currencyLink);
            });
        }
    }

    function fetchInsertCurrencyDataForLink(currencyLink) {
               
        $.get('https://thingproxy.freeboard.io/fetch/' + currencyLink, function(data, status) {

            var parser = new DOMParser();
            var doc = parser.parseFromString(data, "text/html");
            var spanLastPrice = doc.getElementsByClassName('lastPrice SText bold');
            var currencyName = doc.getElementsByClassName('MText noMargin fLeft')["0"].innerText.substring(0, 3);
            var resultValue = parseFloat(spanLastPrice["0"].childNodes["0"].innerText.replace(/\s/g,'').replace(',', '.')).toFixed(2);

            alasql('INSERT INTO CurrencyData VALUES ("' + currencyName + '", ' + resultValue + ');');
        }, "text" );

    }

    return { 
        fillCurrencyData: fillCurrencyData
    };
});