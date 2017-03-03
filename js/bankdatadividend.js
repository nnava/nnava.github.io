define(['./alasqlavanza', './alasqlnordnet', './alasqlstockdata', './alasqlstockdividenddata'], function(alasqlavanza, alasqlnordnet, alasqlstockdata, alasqlstockdividenddata) {


    function getTotalDividend(year, isTaxChecked) {
        var resultNordnetTotal = alasqlnordnet.getTotalDividend(year, isTaxChecked);
        var resultAvanzaTotal = alasqlavanza.getTotalDividend(year, isTaxChecked);
        return resultNordnetTotal + resultAvanzaTotal;
    }

    function getVärdepapperTotalDividend(year, sort, addTaxToSum) {

        var resultNordnetDividend = alasqlnordnet.getVardepapperTotalDividend(year, addTaxToSum);
        var resultAvanzaDividend = alasqlavanza.getVardepapperTotalDividend(year, addTaxToSum);

        alasql('CREATE TABLE IF NOT EXISTS VardepapperTotalDividend \
                (name STRING, [value] NUMBER);');

        alasql('INSERT INTO VardepapperTotalDividend SELECT name, [value] \
                FROM ?', [resultNordnetDividend]);

        alasql('INSERT INTO VardepapperTotalDividend SELECT name, [value] \
                FROM ?', [resultAvanzaDividend]);

        var sortExpression = " ORDER BY name";
        if(sort == "size")
            sortExpression = " ORDER BY SUM([value]) DESC";

        var result = alasql('SELECT FIRST(name) AS name, SUM([value]) AS [value] FROM VardepapperTotalDividend GROUP BY name' + sortExpression);
        alasql('TRUNCATE TABLE VardepapperTotalDividend');

        return result;
    }

    function getVärdepapperForYear(year) {

        alasqlavanza.getBuyTransactionSumBelopp(year);
        alasqlavanza.getSellTransactionSumBelopp(year);
        
        var avanzaData = alasqlavanza.getVärdepapperForYear(year);
        var nordnetData = alasqlnordnet.getVärdepapperForYear(year);

        alasql('CREATE TABLE IF NOT EXISTS DivStackedCumulativeVardepapper \
                (Vardepapper NVARCHAR(100), ISIN NVARCHAR(100));');

        alasql('INSERT INTO DivStackedCumulativeVardepapper SELECT Vardepapper, ISIN \
                FROM ?', [avanzaData]);
                
        alasql('INSERT INTO DivStackedCumulativeVardepapper SELECT Vardepapper, ISIN \
                FROM ?', [nordnetData]);

        var resultVärdepapper = alasql('SELECT FIRST(Vardepapper) AS Vardepapper, FIRST(ISIN) AS ISIN FROM DivStackedCumulativeVardepapper GROUP BY ISIN ORDER BY Vardepapper');
        alasql('TRUNCATE TABLE DivStackedCumulativeVardepapper');

        return resultVärdepapper;
    }
    
    function getVärdepapperDividendData(year, resultVärdepapper, isTaxChecked) {
        
        var monthNumber = 11;
        alasql('CREATE TABLE IF NOT EXISTS DivStackedCumulativeVardepapperValues \
        ([Värdepapper] NVARCHAR(100), Month INT, Belopp DECIMAL);');
        alasql('TRUNCATE TABLE DivStackedCumulativeVardepapperValues');
        
        for(var i=0; i <= monthNumber; i++)
        {
            var month = i + 1;

            var resultAvanza = alasqlavanza.getVärdepapperDividend(year, month, isTaxChecked);
            var resultNordnet = alasqlnordnet.getVärdepapperDividend(year,month, isTaxChecked);

            resultVärdepapper.forEach(function(entry) {
                if (entry.Vardepapper == null) { return; }
                var värdepapper = entry.Vardepapper;
                var isin = entry.ISIN;

                var avanzaVärdepapperValueForMonth = alasql('SELECT VALUE Belopp FROM ? WHERE [Värdepapper] = "' + värdepapper + '"', [resultAvanza]);
                var nordnetVärdepapperValueForMonth = alasql('SELECT VALUE Belopp FROM ? WHERE [ISIN] = "' + isin + '"', [resultNordnet]);
                if(isNaN(avanzaVärdepapperValueForMonth))
                    avanzaVärdepapperValueForMonth = 0;

                if(isNaN(nordnetVärdepapperValueForMonth))
                    nordnetVärdepapperValueForMonth = 0;

                var total = avanzaVärdepapperValueForMonth + nordnetVärdepapperValueForMonth;

                alasql('INSERT INTO DivStackedCumulativeVardepapperValues VALUES ("' + värdepapper + '", ' + month + ', ' + total + ')');
            });
        }

        var värdepapperDividendDataValues = [];
        resultVärdepapper.forEach(function(entry) {
            if (entry.Vardepapper == null) { return; }
            var värdepapper = entry.Vardepapper;
            var isin = entry.ISIN;

            var värdepapperNamnStockData = alasqlstockdata.getVärdepapperNamn(isin);
            if(värdepapperNamnStockData.length != 0)
                värdepapper = värdepapperNamnStockData[0].namn;

            var monthDividendDataValues = alasql('SELECT COLUMN Belopp FROM DivStackedCumulativeVardepapperValues WHERE [Värdepapper] = "' + entry.Vardepapper + '"');
            värdepapperDividendDataValues.push({
                name: värdepapper,
                data: monthDividendDataValues
            });
        });

        return värdepapperDividendDataValues;
    }

    function getReceivedDividendCurrentYearToDate(currentYear, today) {
        var avanzaReceivedDividendData = alasqlavanza.getReceivedDividendCurrentYearToDate(currentYear, today);
        var nordnetReceivedDividendData = alasqlnordnet.getReceivedDividendCurrentYearToDate(currentYear, today);

        var avanzaResult = receivedDividendDataForeach(avanzaReceivedDividendData);
        var nordnetResult = receivedDividendDataForeach(nordnetReceivedDividendData);

        var result = avanzaResult.concat(nordnetResult);
        return alasql('SELECT FIRST(ISIN) AS ISIN, FIRST([Månad]) AS [Månad], \
                              FIRST([Värdepapper]) AS [Värdepapper], FIRST(Typ) AS Typ, \
                              FIRST(Utdelningaktiedecimal) AS Utdelningaktiedecimal, FIRST(Utdelningsdag) AS Utdelningsdag, \
                              FIRST(Valuta) AS Valuta, \
                              SUM(Belopp::NUMBER) AS Belopp, SUM(Antal::NUMBER) AS Antal \
                              FROM ? \
                              GROUP BY ISIN, [Månad]', [result]);
    }

    function receivedDividendDataForeach(receivedDividendData) {
        var resultForReturn = [];
        
        receivedDividendData.forEach(function(receivedDividendDataObject) {
            if(receivedDividendDataObject == null) return;
            if(receivedDividendDataObject.Antal == null) return;

            var isin = receivedDividendDataObject.ISIN;
            var värdepapper = receivedDividendDataObject.Värdepapper;
            var värdepapperNamnStockData = alasqlstockdata.getVärdepapperNamn(receivedDividendDataObject.isin);
            if(värdepapperNamnStockData.length != 0)
                värdepapper = värdepapperNamnStockData[0].namn;

            var valuta = alasqlstockdata.getVärdepapperHandlas(isin);

            var typ = alasqlstockdividenddata.getDividendTyp(receivedDividendDataObject.Datum, isin);
            if(typ == null)
                typ = "Utdelning";

            var newObject = createStockDividendObject(värdepapper, 
                                                        receivedDividendDataObject.Antal,
                                                        isin, 
                                                        typ,
                                                        receivedDividendDataObject.Kurs,
                                                        receivedDividendDataObject.Månad,
                                                        receivedDividendDataObject.Datum,
                                                        valuta,
                                                        receivedDividendDataObject.Belopp);
            resultForReturn.push(newObject);
        });

        return resultForReturn;
    }

    function createStockDividendObject(värdepapper, antal, isin, typ, utdelningaktiedecimal, månad, utdelningsdag, valuta, belopp) {
        var newObject = new Object();
        newObject.Värdepapper = värdepapper;
        newObject.Antal = parseInt(antal);
        newObject.ISIN = isin;
        newObject.Typ = typ;
        newObject.Utdelningaktiedecimal = utdelningaktiedecimal;
        newObject.Månad = månad;
        newObject.Utdelningsdag = utdelningsdag;
        newObject.Valuta = valuta;
        newObject.Belopp = belopp;
        return newObject;
    }

    return { 
        getVärdepapperTotalDividend: getVärdepapperTotalDividend,
        getVärdepapperForYear: getVärdepapperForYear,
        getVärdepapperDividendData: getVärdepapperDividendData,
        getTotalDividend: getTotalDividend,
        getReceivedDividendCurrentYearToDate: getReceivedDividendCurrentYearToDate
    };
});