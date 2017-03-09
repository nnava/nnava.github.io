define(['./alasqlstockdividenddata', './alasqlportfoliodata', './bankdatadividend', './alasqlcurrencydata', './alasqllocalization'], 
    function(alasqlstockdividenddata, alasqlportfoliodata, bankdatadividend, alasqlcurrencydata, alasqllocalization) {

    var currentYear = new Date().getFullYear();
    var today = new Date().toISOString().slice(0, 10);

    function getPortfolioDividends(year) {
        var result = alasqlportfoliodata.getPortfolioData();
        var userCurrency = alasqllocalization.getUserCurrency();

        var resultForReturn = [];
        result.forEach(function(portfolioObject) {
            if(portfolioObject == null) return;
            if(portfolioObject.Antal == null) return;

            var stockUpcomingDividendData = alasqlstockdividenddata.getUpcomingDividendsForYear(currentYear, today, portfolioObject.ISIN);
            stockUpcomingDividendData.forEach(function(stockDividendDataObject) {
                if(stockDividendDataObject == null) return;
                if(stockDividendDataObject.utdelningsdag == null) return;

                var valutaKurs = 1;
                var currency = portfolioObject.Valuta;
                var utdelningaktieMedValuta = (stockDividendDataObject.utdelningaktiedecimal + " " + currency).replace(".", ",");

                if(portfolioObject.Valuta !== userCurrency) {
                    valutaKurs = alasqlcurrencydata.getCurrencyExchangeRateValue(currency);
                }

                stockDividendDataObject.utdelningaktiedecimal = (stockDividendDataObject.utdelningaktiedecimal * valutaKurs).toFixed(4);

                var belopp = (portfolioObject.Antal * stockDividendDataObject.utdelningaktiedecimal);
                
                var newObject = createStockDividendObject(portfolioObject.Värdepapper, 
                                                          portfolioObject.Antal, 
                                                          portfolioObject.ISIN,
                                                          stockDividendDataObject.typ, 
                                                          stockDividendDataObject.utdelningaktiedecimal, 
                                                          utdelningaktieMedValuta,
                                                          stockDividendDataObject.Månad, 
                                                          stockDividendDataObject.utdelningsdag,
                                                          portfolioObject.Valuta,
                                                          belopp);
                resultForReturn.push(newObject);
            });
            
        });

        var receivedDividendData = bankdatadividend.getReceivedDividendCurrentYearToDate(currentYear, today);
        receivedDividendData.forEach(function(receivedDividendDataObject) {
            if(receivedDividendDataObject == null) return;
            if(receivedDividendDataObject.ISIN == null) return;

            var utdelningaktieMedValuta = (receivedDividendDataObject.Utdelningaktiedecimal + " " + receivedDividendDataObject.Valuta).replace(".", ",");
            var newObject = createStockDividendObject(receivedDividendDataObject.Värdepapper, 
                                                        receivedDividendDataObject.Antal, 
                                                        receivedDividendDataObject.ISIN,
                                                        receivedDividendDataObject.Typ,
                                                        receivedDividendDataObject.Utdelningaktiedecimal,
                                                        utdelningaktieMedValuta,
                                                        receivedDividendDataObject.Månad,
                                                        receivedDividendDataObject.Utdelningsdag,
                                                        receivedDividendDataObject.Valuta,
                                                        receivedDividendDataObject.Belopp);
            resultForReturn.push(newObject);
        });
        
        return alasql('SELECT FIRST([Värdepapper]) AS [Värdepapper], SUM(Antal::NUMBER) AS Antal, \
                       FIRST(ISIN) AS ISIN, FIRST(Typ) AS Typ, FIRST(Utdelningaktiedecimal) AS Utdelningaktiedecimal, \
                       FIRST(UtdelningaktieValuta) AS UtdelningaktieValuta, FIRST([Månad]) AS [Månad], \
                       FIRST(Utdelningsdag) AS Utdelningsdag, FIRST(Valuta) AS Valuta, SUM(Belopp::NUMBER) AS Belopp FROM ? \
                       GROUP BY [Värdepapper], ISIN, Typ, Utdelningaktiedecimal, UtdelningaktieValuta, Utdelningsdag, Valuta', [resultForReturn]);
    }

    function createStockDividendObject(värdepapper, antal, isin, typ, utdelningaktiedecimal, utdelningaktievaluta, månad, utdelningsdag, valuta, belopp) {
        var newObject = new Object();
        newObject.Värdepapper = värdepapper;
        newObject.Antal = parseInt(antal);
        newObject.ISIN = isin;
        newObject.Typ = typ;
        newObject.Utdelningaktiedecimal = utdelningaktiedecimal;
        newObject.UtdelningaktieValuta = utdelningaktievaluta;
        newObject.Månad = månad;
        newObject.Utdelningsdag = utdelningsdag;
        newObject.Valuta = valuta;
        newObject.Belopp = belopp;
        return newObject;
    }

    return { 
        getPortfolioDividends: getPortfolioDividends
    };
});