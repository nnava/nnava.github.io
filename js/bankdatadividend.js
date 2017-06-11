define(['./alasqlavanza', './alasqlnordnet', './alasqlstockdata', './alasqlstockdividenddata', './dateperiod'], function(alasqlavanza, alasqlnordnet, alasqlstockdata, alasqlstockdividenddata, dateperiod) {

    var currentYear = new Date().getFullYear();

    function getCurrentDividendSum(isin) {
        return alasqlstockdividenddata.getDividendSumForYear(isin, currentYear).toFixed(2);
    }

    function getTotalDividend(startPeriod, endPeriod, isTaxChecked) {
        var resultNordnetTotal = alasqlnordnet.getTotalDividend(startPeriod, endPeriod, isTaxChecked);
        var resultAvanzaTotal = alasqlavanza.getTotalDividend(startPeriod, endPeriod, isTaxChecked);
        return resultNordnetTotal + resultAvanzaTotal;
    }

    function getVärdepapperTotalDividend(startPeriod, endPeriod, sort, addTaxToSum) {
        var resultNordnetDividend = alasqlnordnet.getVardepapperTotalDividend(startPeriod, endPeriod, addTaxToSum);
        var resultAvanzaDividend = alasqlavanza.getVardepapperTotalDividend(startPeriod, endPeriod, addTaxToSum);
        var result = resultAvanzaDividend.concat(resultNordnetDividend);

        var sortExpression = " ORDER BY name";
        if(sort == "size")
            sortExpression = " ORDER BY SUM([value]) DESC";

        return alasql('SELECT FIRST(name) AS name, SUM([value]) AS [value] FROM ? GROUP BY name' + sortExpression, [result]);
    }

    function getVärdepapperForPeriod(startPeriod, endPeriod) {
        var avanzaData = alasqlavanza.getVärdepapperForPeriod(startPeriod, endPeriod);
        var nordnetData = alasqlnordnet.getVärdepapperForPeriod(startPeriod, endPeriod);
        var result = avanzaData.concat(nordnetData);
        return alasql('SELECT FIRST(Vardepapper) AS Vardepapper, FIRST(ISIN) AS ISIN FROM ? GROUP BY ISIN ORDER BY Vardepapper', [result]);
    }
    
    function getVärdepapperDividendData(startPeriod, endPeriod, resultVärdepapper, isTaxChecked) {
    
        alasql('CREATE TABLE IF NOT EXISTS DivStackedCumulativeVardepapperValues ([Värdepapper] NVARCHAR(100), Month INT, Belopp DECIMAL);');
        alasql('TRUNCATE TABLE DivStackedCumulativeVardepapperValues');
        
        var datesInPeriod = dateperiod.getDateRange(startPeriod, endPeriod);
        datesInPeriod.forEach(function(dateObject) {
            var year = dateObject.year;
            var month = dateObject.month;
            var resultAvanza = alasqlavanza.getVärdepapperDividend(year, month, isTaxChecked);
            var resultNordnet = alasqlnordnet.getVärdepapperDividend(year, month, isTaxChecked);

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
        });

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

        var avanzaResult = receivedDividendDataForeach(avanzaReceivedDividendData, "AZA");
        var nordnetResult = receivedDividendDataForeach(nordnetReceivedDividendData, "NN");
        
        var result = avanzaResult.concat(nordnetResult);
        return alasql('SELECT FIRST(ISIN) AS ISIN, FIRST([Månad]) AS [Månad], \
                              FIRST([Värdepapper]) AS [Värdepapper], FIRST(Typ) AS Typ, \
                              FIRST(Utdelningaktiedecimal) AS Utdelningaktiedecimal, FIRST(Utdelningsdag) AS Utdelningsdag, \
                              FIRST(Valuta) AS Valuta, \
                              SUM(Belopp::NUMBER) AS Belopp, SUM(Antal::NUMBER) AS Antal, FIRST(Land) AS Land \
                              FROM ? \
                              GROUP BY ISIN, [Månad], Typ', [result]);
    }

    function getDividendAll(isTaxChecked, groupByType) {
        var nordnetData = alasqlnordnet.getDividendAll(isTaxChecked);
        var avanzaData = alasqlavanza.getDividendAll(isTaxChecked);
        var result = avanzaData.concat(nordnetData);
        var resultForReturn = alasql('SELECT Year, SUM(Belopp) AS Belopp FROM ? GROUP BY Year, Month ORDER BY Year', [result]);
        return resultForReturn;
    }

    function receivedDividendDataForeach(receivedDividendData, banktype) {
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
            var land = alasqlstockdata.getLandFromISIN(isin);
            if(banktype == "AZA")
                valuta = "SEK";

            var typ = alasqlstockdividenddata.getDividendTyp(receivedDividendDataObject.Datum, isin);
            if(typ == null) typ = "Utdelning";

            var newObject = createStockDividendObject(värdepapper, 
                                                        receivedDividendDataObject.Antal,
                                                        isin, 
                                                        typ,
                                                        receivedDividendDataObject.Kurs,
                                                        receivedDividendDataObject.Månad,
                                                        receivedDividendDataObject.Datum,
                                                        valuta,
                                                        receivedDividendDataObject.Belopp,
                                                        land);
            resultForReturn.push(newObject);
        });

        return resultForReturn;
    }

    function createStockDividendObject(värdepapper, antal, isin, typ, utdelningaktiedecimal, månad, utdelningsdag, valuta, belopp, land) {
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
        newObject.Land = land;
        return newObject;
    }

    function getDividendMonthSumBelopp(year, month, isTaxChecked) {
        var resultNordnet = alasqlnordnet.getDividendMonthSumBelopp(year, month);
        var resultAvanza = alasqlavanza.getDividendMonthSumBelopp(year, month);

        if (isTaxChecked) {
            var taxNordnet = alasqlnordnet.getTaxMonthSumBelopp(year, month);
            var taxAvanza = alasqlavanza.getTaxMonthSumBelopp(year, month);
            resultNordnet = resultNordnet + taxNordnet;
            resultAvanza = resultAvanza + taxAvanza;
        }

        return Math.round(resultNordnet + resultAvanza);
    }

    return { 
        getVärdepapperTotalDividend: getVärdepapperTotalDividend,
        getVärdepapperForPeriod: getVärdepapperForPeriod,
        getVärdepapperDividendData: getVärdepapperDividendData,
        getTotalDividend: getTotalDividend,
        getReceivedDividendCurrentYearToDate: getReceivedDividendCurrentYearToDate,
        getDividendAll: getDividendAll,
        getDividendMonthSumBelopp: getDividendMonthSumBelopp,
        getCurrentDividendSum: getCurrentDividendSum
    };
});