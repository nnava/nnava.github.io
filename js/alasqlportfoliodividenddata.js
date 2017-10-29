define(['./alasqlstockdividenddata', './alasqlstockdata', './alasqlportfoliodata', './bankdatadividend', './alasqlcurrencydata', './alasqllocalization'], 
    function(alasqlstockdividenddata, alasqlstockdata, alasqlportfoliodata, bankdatadividend, alasqlcurrencydata, alasqllocalization) {

    var today = new Date().toISOString().slice(0, 10);

    function getPortfolioDividends(year) {
        var result = alasqlportfoliodata.getPortfolioData();
        var userCurrency = alasqllocalization.getUserCurrency();

        var resultForReturn = [];
        result.forEach(function(portfolioObject) {
            if(portfolioObject == null) return;
            if(portfolioObject.Antal == null) return;

            var stockUpcomingDividendData = alasqlstockdividenddata.getUpcomingDividendsForYear(year, today, portfolioObject.ISIN);
            stockUpcomingDividendData.forEach(function(stockDividendDataObject) {
                if(stockDividendDataObject == null) return;
                if(stockDividendDataObject.utd_handlasutanutdelning == null) return;
                if(stockDividendDataObject.utdelningaktiedecimal == 0) return;

                var valutaKurs = 1;
                var currency = portfolioObject.Valuta;
                var utdelningaktieMedValuta = (stockDividendDataObject.utdelningaktiedecimal + " " + currency).replace(".", ",");
                var land = alasqlstockdata.getLandFromISIN(portfolioObject.ISIN);

                if(portfolioObject.Valuta !== userCurrency) {
                    valutaKurs = alasqlcurrencydata.getCurrencyExchangeRateValue(currency);
                }

                stockDividendDataObject.utdelningaktiedecimal = (stockDividendDataObject.utdelningaktiedecimal * valutaKurs).toFixed(4);

                var belopp = (portfolioObject.Antal * stockDividendDataObject.utdelningaktiedecimal);
                var isDividendReceived = stockDividendDataObject.utd_handlasutanutdelning == today;
                
                var newObject = createStockDividendObject(portfolioObject.Värdepapper, 
                                                          portfolioObject.Antal, 
                                                          portfolioObject.ISIN,
                                                          stockDividendDataObject.typ, 
                                                          stockDividendDataObject.utdelningaktiedecimal, 
                                                          utdelningaktieMedValuta,
                                                          stockDividendDataObject.Månad, 
                                                          stockDividendDataObject.utd_handlasutanutdelning,
                                                          portfolioObject.Valuta,
                                                          valutaKurs,
                                                          belopp,
                                                          isDividendReceived,
                                                          land,
                                                          stockDividendDataObject.utd_deklarerad,
                                                          stockDividendDataObject.utv);
                resultForReturn.push(newObject);
            });
            
        });

        var receivedDividendData = bankdatadividend.getReceivedDividendCurrentYearToDate(year, today);
        receivedDividendData.forEach(function(receivedDividendDataObject) {
            if(receivedDividendDataObject == null) return;
            if(receivedDividendDataObject.ISIN == null) return;

            var utdelningaktieMedValuta = (receivedDividendDataObject.Utdelningaktiedecimal + " " + receivedDividendDataObject.Valuta).replace(".", ",");
            var utv = alasqlstockdividenddata.getUtv(receivedDividendDataObject.Månad, year, receivedDividendDataObject.ISIN);
            var newObject = createStockDividendObject(receivedDividendDataObject.Värdepapper, 
                                                        receivedDividendDataObject.Antal, 
                                                        receivedDividendDataObject.ISIN,
                                                        receivedDividendDataObject.Typ,
                                                        receivedDividendDataObject.Utdelningaktiedecimal,
                                                        utdelningaktieMedValuta,
                                                        receivedDividendDataObject.Månad,
                                                        receivedDividendDataObject.Utdelningsdag,
                                                        receivedDividendDataObject.Valuta,
                                                        0,
                                                        receivedDividendDataObject.Belopp,
                                                        true,
                                                        receivedDividendDataObject.Land,
                                                        "J",
                                                        utv);
            resultForReturn.push(newObject);
        });
        
        return alasql('SELECT FIRST([Värdepapper]) AS [Värdepapper], SUM(Antal::NUMBER) AS Antal, \
                       FIRST(ISIN) AS ISIN, FIRST(Typ) AS Typ, FIRST(Utdelningaktiedecimal) AS Utdelningaktiedecimal, \
                       FIRST(UtdelningaktieValuta) AS UtdelningaktieValuta, FIRST([Månad]) AS [Månad], \
                       FIRST(Utdelningsdag) AS Utdelningsdag, FIRST(Valuta) AS Valuta, FIRST(ValutaKurs) AS ValutaKurs, FIRST(Utdelningmottagen) AS Utdelningmottagen, \
                       FIRST(Land) AS Land, SUM(Belopp::NUMBER) AS Belopp, FIRST(UtdelningDeklarerad) AS UtdelningDeklarerad, FIRST(Utv) AS Utv \
                       FROM ? \
                       GROUP BY [Värdepapper], ISIN, Typ, Utdelningaktiedecimal, UtdelningaktieValuta, Utdelningsdag, Valuta, ValutaKurs, Utdelningmottagen, Land, UtdelningDeklarerad, Utv', [resultForReturn]);
    }

    function getPortfolioDividendsYearMonthValues(year) {                
        alasql('CREATE TABLE IF NOT EXISTS DivStackedCumulativePortfolioVardepapperValues \
        ([Värdepapper] NVARCHAR(100), Month INT, Belopp DECIMAL, Utdelningmottagen BOOL);');
        alasql('TRUNCATE TABLE DivStackedCumulativePortfolioVardepapperValues');

        var portfolioDividends = getPortfolioDividends(year);
        var värdepapperResult = alasql('SELECT DISTINCT [Värdepapper] FROM ?', [portfolioDividends]);

        var monthNumber = 11;
        värdepapperResult.forEach(function(värdepapperObject) {
            if(värdepapperObject == null) return;
            if(värdepapperObject.Värdepapper == null) return;
            var värdepapper = värdepapperObject.Värdepapper;

            for(var i=0; i <= monthNumber; i++) {
                var month = i + 1;

                var belopp = 0;
                var beloppValue = alasql('SELECT VALUE Belopp FROM ? WHERE [Värdepapper] = "' + värdepapper + '" AND [Månad] = ' + month, [portfolioDividends]);
                if(beloppValue != null)
                    belopp = beloppValue;

                var utdelningmottagen = false;
                var utdelningmottagenValue = alasql('SELECT VALUE Utdelningmottagen FROM ? WHERE [Värdepapper] = "' + värdepapper + '" AND [Månad] = ' + month, [portfolioDividends]);
                if(utdelningmottagenValue != null)
                    utdelningmottagen = utdelningmottagenValue;

                alasql('INSERT INTO DivStackedCumulativePortfolioVardepapperValues VALUES ("' + värdepapper + '", ' + month + ', ' + belopp + ', ' + utdelningmottagen + ');');
            }
        });

        var värdepapperDividendDataValues = [];
        värdepapperResult.forEach(function(värdepapperObject) {
            if (värdepapperObject.Värdepapper == null) { return; }
            var värdepapper = värdepapperObject.Värdepapper;

            var monthDividendDataValues = alasql('SELECT COLUMN Belopp FROM DivStackedCumulativePortfolioVardepapperValues WHERE [Värdepapper] = "' + värdepapper + '"');
            var monthDividendReceivedDataValues = alasql('SELECT COLUMN Utdelningmottagen FROM DivStackedCumulativePortfolioVardepapperValues WHERE [Värdepapper] = "' + värdepapper + '"');

            var dataCombinedValues = [];
            for(var i=0;i<monthDividendDataValues.length;i++){
                dataCombinedValues.push({value:monthDividendDataValues[i],IsDividendReceived:monthDividendReceivedDataValues[i]});
            }

            värdepapperDividendDataValues.push({
                name: värdepapper,
                data: dataCombinedValues
            });
        });
        
        return värdepapperDividendDataValues;
    }

    function createStockDividendObject(värdepapper, antal, isin, typ, utdelningaktiedecimal, utdelningaktievaluta, månad, utdelningsdag, valuta, valutakurs, belopp, utdelningmottagen, land, utd_deklarerad, utv) {
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
        newObject.ValutaKurs = valutakurs;
        newObject.Belopp = belopp;
        newObject.Utdelningmottagen = utdelningmottagen;
        newObject.Land = land;
        newObject.UtdelningDeklarerad = utd_deklarerad;
        newObject.Utv = utv;
        return newObject;
    }

    return { 
        getPortfolioDividends: getPortfolioDividends,
        getPortfolioDividendsYearMonthValues: getPortfolioDividendsYearMonthValues
    };
});