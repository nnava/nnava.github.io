define(['./alasqlstockdividenddata', './alasqlportfoliodata', './bankdatadividend', './alasqlcurrencydata'], 
    function(alasqlstockdividenddata, alasqlportfoliodata, bankdatadividend, alasqlcurrencydata) {

    var currentYear = new Date().getFullYear();
    var today = new Date().toISOString().slice(0, 10);

    function getPortfolioDividends(year) {
        var result = alasqlportfoliodata.getPortfolioData();

        var resultForReturn = [];
        result.forEach(function(portfolioObject) {
            if(portfolioObject == null) return;
            if(portfolioObject.Antal == null) return;

            var stockDividendData = alasqlstockdividenddata.getUpcomingDividendsForYear(currentYear, today, portfolioObject.ISIN);
            stockDividendData.forEach(function(stockDividendDataObject) {
                if(stockDividendDataObject == null) return;
                if(stockDividendDataObject.utdelningsdag == null) return;

                var valutaKurs = 1;
                var currency = portfolioObject.Valuta;
                var utdelningaktieMedValuta = (stockDividendDataObject.utdelningaktiedecimal + " " + currency).replace(".", ",");

                if(portfolioObject.Valuta !== "SEK") {
                    valutaKurs = alasqlcurrencydata.getCurrencyExchangeRateValue(currency);
                }

                stockDividendDataObject.utdelningaktiedecimal = (stockDividendDataObject.utdelningaktiedecimal * valutaKurs).toFixed(4);

                var belopp = (portfolioObject.Antal * stockDividendDataObject.utdelningaktiedecimal);
                
                var newObject = createStockDividendObject(portfolioObject, 
                                                          portfolioObject.Antal, 
                                                          stockDividendDataObject.typ, 
                                                          stockDividendDataObject.utdelningaktiedecimal, 
                                                          utdelningaktieMedValuta,
                                                          stockDividendDataObject.Månad, 
                                                          stockDividendDataObject.utdelningsdag,
                                                          belopp);
                resultForReturn.push(newObject);
            });

            var receivedDividendData = bankdatadividend.getReceivedDividendCurrentYearToDate(portfolioObject, currentYear, today, portfolioObject.ISIN);
            receivedDividendData.forEach(function(receivedDividendDataObject) {
                if(receivedDividendDataObject == null) return;
                if(receivedDividendDataObject.ISIN == null) return;

                var utdelningaktieMedValuta = (receivedDividendDataObject.Utdelningaktiedecimal + " " + portfolioObject.Valuta).replace(".", ",");

                var newObject = createStockDividendObject(portfolioObject, 
                                                          receivedDividendDataObject.Antal, 
                                                          receivedDividendDataObject.Typ,
                                                          receivedDividendDataObject.Utdelningaktiedecimal,
                                                          utdelningaktieMedValuta,
                                                          receivedDividendDataObject.Månad,
                                                          receivedDividendDataObject.Utdelningsdag,
                                                          receivedDividendDataObject.Belopp);
                resultForReturn.push(newObject);
            });
            
        });
        
        return resultForReturn;
    }

    function createStockDividendObject(portfolioObject, antal, typ, utdelningaktiedecimal, utdelningaktievaluta, månad, utdelningsdag, belopp) {
        var newObject = new Object();
        newObject.Värdepapper = portfolioObject.Värdepapper;
        newObject.Antal = parseInt(antal);
        newObject.ISIN = portfolioObject.ISIN;
        newObject.Typ = typ;
        newObject.Utdelningaktiedecimal = utdelningaktiedecimal;
        newObject.UtdelningaktieValuta = utdelningaktievaluta;
        newObject.Månad = månad;
        newObject.Utdelningsdag = utdelningsdag;
        newObject.Valuta = portfolioObject.Valuta;
        newObject.Belopp = belopp;
        return newObject;
    }

    return { 
        getPortfolioDividends: getPortfolioDividends
    };
});