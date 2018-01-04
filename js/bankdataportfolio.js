define(['./alasqlavanza', './alasqlnordnet', './alasqllocalization', './alasqlcurrencydata', './alasqlstockdata', './alasqlportfoliodata'], 
    function(alasqlavanza, alasqlnordnet, alasqllocalization, alasqlcurrencydata, alasqlstockdata, alasqlportfoliodata) {

    var stockLastTradePriceArray = [];

    function getStocksInPortfolio() {
        var nordnetData = alasqlnordnet.getStocksInPortfolio();
        var avanzaData = alasqlavanza.getStocksInPortfolio();
        var result = avanzaData.concat(nordnetData);

        return alasql('SELECT [Värdepapper], ISIN, Valuta, Bransch, YahooSymbol, SUM(Antal::NUMBER) AS Antal FROM ? GROUP BY [Värdepapper], ISIN, Valuta, Bransch, YahooSymbol ORDER BY UPPER([Värdepapper])', [result]);    
    }

    function getStoredArray(fieldId) {
        var data = JSON.parse(localStorage.getItem(fieldId));
        if(data == null) return [];
        return data;
    }

    function getPortfolioDistributionData() {
        var stocksInPortfolio = getStocksInPortfolio();
        var result = [];
        stocksInPortfolio.forEach(function(object) {
            var senastepris = parseFloat(alasqlportfoliodata.getPortfolioLastPriceValueBySymbol(object.YahooSymbol)).toFixed(2);

            var newObject = new Object();
            newObject.Värdepapper = object.Värdepapper;
            newObject.ISIN = object.ISIN;
            newObject.Symbol = object.YahooSymbol;
            newObject.Antal = parseInt(object.Antal);
            newObject.YahooSymbol = object.YahooSymbol;
            newObject.Bransch = object.Bransch;
            newObject.Valuta = object.Valuta;
            newObject.SenastePris = senastepris;
            newObject.Marknadsvärde = (newObject.SenastePris * newObject.Antal);
            result.push(newObject);
        });

        var portfolioSumValue = alasql('SELECT VALUE SUM([Marknadsvärde]::NUMBER) FROM ?', [result]);
        alasqlportfoliodata.saveDistributionDataToTable(result, portfolioSumValue);
        return alasqlportfoliodata.getPortfolioDistributionData();
    }

    function setPortfolioLastPriceData() {
        alasqlportfoliodata.createPortfolioLastPriceDataTable();
        alasqlportfoliodata.truncatePortfolioLastPriceDataTable();

        stockLastTradePriceArray = [];
        var userCurrency = alasqllocalization.getUserCurrency();
        var stocksInPortfolio = getStocksInPortfolio();

        for (var i = 0; i < stocksInPortfolio.length; i++) {
            var item = stocksInPortfolio[i];

            var currencyValue = 1;
            if(item.Valuta !== userCurrency) { 
                currencyValue = alasqlcurrencydata.getCurrencyExchangeRateValue(item.Valuta);
            };

            saveLastTradePriceOnly(item.YahooSymbol, currencyValue);
        }
    }

    function saveLastTradePriceOnly(symbol, currencyValue) {
        $.get('https://proxy-sauce.glitch.me/https://finance.google.com/finance?q=' + symbol + '&output=json', function(data, status) {
            var responseData = _.isString(data) ? JSON.parse(data.replace("//", "")) : data;

            if(responseData["0"] == null || responseData["0"].l == null || responseData.searchresults != null) {
                var avanzaLink = alasqlstockdata.getAzaLinkFromYahooSymbol(symbol);

                if(avanzaLink == "-") {
                    alasqlportfoliodata.insertPortfolioLastPriceRow(symbol, 0);
                    return;
                }

                $.get('https://proxy-sauce.glitch.me/' + 'https://www.avanza.se' + avanzaLink, function(data, status) {

                    var parser = new DOMParser();
                    var doc = parser.parseFromString(data, "text/html");
                    var spanLastPrice = doc.getElementsByClassName('lastPrice SText bold');

                    if(spanLastPrice["0"] == null || spanLastPrice["0"].childNodes["0"] == null) {
                        alasqlportfoliodata.insertPortfolioLastPriceRow(symbol, 0);
                        return;
                    }

                    var resultValue = parseFloat(spanLastPrice["0"].childNodes["0"].innerText.replace(',', '.')).toFixed(2);
                    var calulatedValue = resultValue * currencyValue;
                    alasqlportfoliodata.insertPortfolioLastPriceRow(symbol, calulatedValue);
                    return;
                }, "text" );
            }

            var resultValue = parseFloat(responseData["0"].l.replace(',', '')).toFixed(2);
            var calulatedValue = resultValue * currencyValue;
            alasqlportfoliodata.insertPortfolioLastPriceRow(symbol, calulatedValue);
        }, "text" );
    }

    function getPurchaseValue(isin) {
        var belopp = (alasqlavanza.getPurchaseBeloppValue(isin) + alasqlnordnet.getPurchaseBeloppValue(isin));
        var antal = (alasqlavanza.getPurchaseAntalValue(isin) + alasqlnordnet.getPurchaseAntalValue(isin));
        return (belopp/antal);
    }

    return {
        getStocksInPortfolio: getStocksInPortfolio,
        getPortfolioDistributionData: getPortfolioDistributionData,
        setPortfolioLastPriceData: setPortfolioLastPriceData,
        getPurchaseValue: getPurchaseValue
    };
});