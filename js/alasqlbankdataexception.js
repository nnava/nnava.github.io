define([], function() {

    function deleteAvanzaRowsToSkip() {
        // HCP Specialare efter avknoppning QCP
        alasql('DELETE FROM AvanzaData \
                WHERE Datum = "2017-01-23" AND [Typ av transaktion] = "Utdelning" AND ISIN = "US40414L1098"');
        alasql('DELETE FROM AvanzaData \
                WHERE Datum = "2017-01-23" AND [Typ av transaktion] = "Utländsk källskatt 15%" AND ISIN = "US40414L1098"');
    }

    function addAvanzaRowsStocksSpecial() {
        alasql('INSERT INTO AvanzaData \
                SELECT Antal, Belopp, Datum, YEAR(Datum) AS Year, MONTH(Datum) AS Month, "US02079K1079" AS ISIN, Konto, Kurs, "Köp" AS [Typ av transaktion], Valuta, "Alphabet Inc Class C" AS [Värdepapperbeskrivning] FROM AvanzaData \
                WHERE [Värdepapperbeskrivning] = "GOOG.O" AND ISIN = "US38259P7069" AND [Typ av transaktion] = "Köp"');

        alasql('DELETE FROM AvanzaData \
                WHERE [Värdepapperbeskrivning] = "GOOG.O" AND ISIN = "US38259P7069" AND [Typ av transaktion] = "Köp"');
    }

    function addAvanzaRowsForDividend() {
        insertAvanzaDataILStockInfo("NetEnt B", "SE0008212971", "NET IL B");
        insertAvanzaDataILStockInfo("Creades A", "SE0004390516", "CRED IL A");
        insertAvanzaDataILStockInfo("SECTRA B", "SE0008613970", "SECT IL B");
        insertAvanzaDataILStockInfo("Betsson B", "SE0008242358", "BETS IL B");
        insertAvanzaDataILStockInfo("Kinnevik B", "SE0000164626", "KINV IL B");
        insertAvanzaDataILStockInfo("Björn Borg", "SE0008242002", "BORG IL");
        insertAvanzaDataILStockInfo("Cherry B", "SE0005191426", "CHER IL B");
        insertAvanzaDataILStockInfo("Enea", "SE0008212518", "ENEA IL");
        insertAvanzaDataILStockInfo("HiQ International", "SE0008135610", "HIQ IL");
        insertAvanzaDataILStockInfo("Strax", "SE0008008254", "STRAX IL");
        insertAvanzaDataILStockInfo("Tele2 B", "SE0005190238", "TEL2 IL B");
        insertAvanzaDataILStockInfo("Vostok New Ventures", "SE0007278965", "VNV SDB IL");
        insertAvanzaDataILStockInfo("East Capital Explorer", "SE0002158568", "ECEX IL");
        insertAvanzaDataILStockInfo("Mertiva", "SE0005191806", "MERT MTF IL");
    }

    function insertAvanzaDataILStockInfo(companyName, isin, ILsymbol) {
        alasql('INSERT INTO AvanzaData \
                SELECT -Antal AS Antal, Belopp, Datum, YEAR(Datum) AS Year, MONTH(Datum) AS Month, "' + isin + '" AS ISIN, Konto, Kurs, "Utdelning" AS [Typ av transaktion], Valuta, "' + companyName + '" AS [Värdepapperbeskrivning] FROM AvanzaData \
                WHERE [Värdepapperbeskrivning] = "' + ILsymbol + '" AND [Typ av transaktion] = "Sälj"');  

        alasql('DELETE FROM AvanzaData \
                WHERE [Värdepapperbeskrivning] = "' + ILsymbol + '" AND [Typ av transaktion] = "Sälj"');
    }

    function addNordnetRowsForDividend() {
        insertNordnetDataILStockInfo("NET B", "SE0008212971", "NET IL B");
        insertNordnetDataILStockInfo("CRED A", "SE0004390516", "CRED IL A");
        insertNordnetDataILStockInfo("SECT B", "SE0008613970", "SECT IL B");
        insertNordnetDataILStockInfo("BETS B", "SE0008242358", "BETS IL B");
        insertNordnetDataILStockInfo("KINV B", "SE0000164626", "KINV IL B");
        insertNordnetDataILStockInfo("BORG", "SE0008242002", "BORG IL");
        insertNordnetDataILStockInfo("CHER B", "SE0005191426", "CHER IL B");
        insertNordnetDataILStockInfo("ENEA", "SE0008212518", "ENEA IL");
        insertNordnetDataILStockInfo("HIQ", "SE0008135610", "HIQ IL");
        insertNordnetDataILStockInfo("STRAX", "SE0008008254", "STRAX IL");
        insertNordnetDataILStockInfo("TEL2 B", "SE0005190238", "TEL2 IL B");
        insertNordnetDataILStockInfo("VNV SDB", "SE0007278965", "VNV SDB IL");
        insertNordnetDataILStockInfo("ECEX", "SE0002158568", "ECEX IL");
        insertNordnetDataILStockInfo("MERT MTF", "SE0005191806", "MERT MTF IL");
    }

    function insertNordnetDataILStockInfo(symbol, isin, ILsymbol) {
        alasql('INSERT INTO NordnetData \
                SELECT Konto, [Affärsdag], Antal, Avgifter, Belopp, [Bokföringsdag], "' + isin +'" AS ISIN, Instrumenttyp, Kurs, Likviddag, Makuleringsdatum, "UTDELNING" AS Transaktionstyp, Valuta, "' + symbol +'" AS [Värdepapper], Transaktionstext FROM NordnetData \
                WHERE [Värdepapper] = "' + ILsymbol + '" AND Transaktionstyp = "INLÖSEN LIKVID"');

        alasql('DELETE FROM AvanzaData \
                WHERE [Värdepapper] = "' + ILsymbol + '" AND Transaktionstyp = "INLÖSEN LIKVID"');
    }

    return {
        deleteAvanzaRowsToSkip: deleteAvanzaRowsToSkip,
        addAvanzaRowsForDividend: addAvanzaRowsForDividend,
        addNordnetRowsForDividend: addNordnetRowsForDividend,
        addAvanzaRowsStocksSpecial: addAvanzaRowsStocksSpecial
    };
});