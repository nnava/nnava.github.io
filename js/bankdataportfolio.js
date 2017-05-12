define(['./alasqlavanza', './alasqlnordnet', './alasqllocalization', './alasqlcurrencydata', './alasqlstockdata', './alasqlportfoliodata'], 
    function(alasqlavanza, alasqlnordnet, alasqllocalization, alasqlcurrencydata, alasqlstockdata, alasqlportfoliodata) {

    var yqlUrl = 'https://query.yahooapis.com/v1/public/yql';
    var historicalUrl = 'http://finance.yahoo.com/d/quotes.csv';
    var stockLastTradePriceArray = [];

    function getStocksInPortfolio() {
        var nordnetData = alasqlnordnet.getStocksInPortfolio();
        var avanzaData = alasqlavanza.getStocksInPortfolio();
        var result = avanzaData.concat(nordnetData);

        return alasql('SELECT [Värdepapper], ISIN, Valuta, Bransch, YahooSymbol, SUM(Antal::NUMBER) AS Antal FROM ? GROUP BY [Värdepapper], ISIN, Valuta, Bransch, YahooSymbol ORDER BY UPPER([Värdepapper])', [result]);    
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

            saveLastTradePriceOnly(item.YahooSymbol, currencyValue, 1);
        }
    }

    function saveLastTradePriceOnly(symbol, currencyValue, retryNumber) {
        var queryTemplate = _.template("select * from csv where url='" + historicalUrl + "?s=<%= symbol %>&f=l1' and columns='LastTradePriceOnly'");

        $.ajax({
            url: yqlUrl,
            data: {q: queryTemplate({symbol:symbol}), format: 'json'},
            timeout: 10000
        }).done(function(output) {
            var response = _.isString(output) ? JSON.parse(output) : output;
            var results = response.query.results;
            if(results == null) {
                if(retryNumber < 4) {
                    retryNumber++;
                    setTimeout(function(){ saveLastTradePriceOnly(symbol, currencyValue, retryNumber); }, 50);
                    return;
                }

                alasqlportfoliodata.insertPortfolioLastPriceRow(symbol, 0);
                return;
            }

            var lastTradePriceOnly = results.row.LastTradePriceOnly;
            if(lastTradePriceOnly === "N/A") {
                var link = "https://www.avanza.se" + alasqlstockdata.getAzaLinkFromYahooSymbol(symbol);
                var queryYqlAvanzaTemplate = _.template("select * from html where url='<%= link %>' and xpath='//span[@class=\"lastPrice SText bold\"]//span[@class=\"pushBox roundCorners3\"]/text()'");
                
                $.ajax({
                    url: yqlUrl,
                    async: true,
                    data: {q: queryYqlAvanzaTemplate({link:link}), format: 'json'},
                    timeout: 10000
                }).done(function(output) {
                    if(output == null) { alasqlportfoliodata.insertPortfolioLastPriceRow(symbol, 0); return; };
                    var yqlAvanzaResponse = _.isString(output) ? JSON.parse(output) : output;
                    if(yqlAvanzaResponse.query.count === 0) { alasqlportfoliodata.insertPortfolioLastPriceRow(symbol, 0); return; };
                    var resultValue = parseFloat(yqlAvanzaResponse.query.results.replace(",", ".")).toFixed(2);

                    lastTradePriceOnly = (resultValue*currencyValue);
                    alasqlportfoliodata.insertPortfolioLastPriceRow(symbol, lastTradePriceOnly);
                    return;

                }).fail(function(err) {
                    console.log(err.responseText);
                    alasqlportfoliodata.insertPortfolioLastPriceRow(symbol, 0);
                    return;
                }); 
            } else {
                lastTradePriceOnly = (lastTradePriceOnly*currencyValue);
                alasqlportfoliodata.insertPortfolioLastPriceRow(symbol, lastTradePriceOnly);
            }

        }).fail(function(err) {
            console.log(err.responseText);
            alasqlportfoliodata.insertPortfolioLastPriceRow(symbol, 0);
        }); 
    }

    return {
        getStocksInPortfolio: getStocksInPortfolio,
        getPortfolioDistributionData: getPortfolioDistributionData,
        setPortfolioLastPriceData: setPortfolioLastPriceData
    };
});