define([], function() {

    function deleteAvanzaRowsToSkip() {
        // HCP Specialare efter avknoppning QCP
        alasql('DELETE FROM AvanzaData \
                WHERE Datum = "2017-01-23" AND [Typ av transaktion] = "Utdelning" AND ISIN = "US40414L1098"');
        alasql('DELETE FROM AvanzaData \
                WHERE Datum = "2017-01-23" AND [Typ av transaktion] = "Utländsk källskatt 15%" AND ISIN = "US40414L1098"');
    }

    function addAvanzaRowsForDividend() {

        // NetEnt
        alasql('INSERT INTO AvanzaData \
                SELECT -Antal AS Antal, Belopp, Datum, YEAR(Datum) AS Year, MONTH(Datum) AS Month, "SE0008212971" AS ISIN, Konto, Kurs, "Utdelning" AS [Typ av transaktion], Valuta, "NET B" AS [Värdepapperbeskrivning] FROM AvanzaData \
                WHERE [Värdepapperbeskrivning] = "NET IL B" AND [Typ av transaktion] = "Sälj"');

        // Creades
        alasql('INSERT INTO AvanzaData \
                SELECT -Antal AS Antal, Belopp, Datum, YEAR(Datum) AS Year, MONTH(Datum) AS Month, "SE0004390516" AS ISIN, Konto, Kurs, "Utdelning" AS [Typ av transaktion], Valuta, "CRED A" AS [Värdepapperbeskrivning] FROM AvanzaData \
                WHERE [Värdepapperbeskrivning] = "CRED IL A" AND [Typ av transaktion] = "Sälj"');

        // Sectra
        alasql('INSERT INTO AvanzaData \
                SELECT -Antal AS Antal, Belopp, Datum, YEAR(Datum) AS Year, MONTH(Datum) AS Month, "SE0008613970" AS ISIN, Konto, Kurs, "Utdelning" AS [Typ av transaktion], Valuta, "SECT B" AS [Värdepapperbeskrivning] FROM AvanzaData \
                WHERE [Värdepapperbeskrivning] = "SECT IL B" AND [Typ av transaktion] = "Sälj"');

        // Betsson
        alasql('INSERT INTO AvanzaData \
                SELECT -Antal AS Antal, Belopp, Datum, YEAR(Datum) AS Year, MONTH(Datum) AS Month, "SE0008242358" AS ISIN, Konto, Kurs, "Utdelning" AS [Typ av transaktion], Valuta, "BETS B" AS [Värdepapperbeskrivning] FROM AvanzaData \
                WHERE [Värdepapperbeskrivning] = "BETS IL B" AND [Typ av transaktion] = "Sälj"');    

        // Kinnevik
        alasql('INSERT INTO AvanzaData \
                SELECT -Antal AS Antal, Belopp, Datum, YEAR(Datum) AS Year, MONTH(Datum) AS Month, "SE0000164626" AS ISIN, Konto, Kurs, "Utdelning" AS [Typ av transaktion], Valuta, "KINV B" AS [Värdepapperbeskrivning] FROM AvanzaData \
                WHERE [Värdepapperbeskrivning] = "KINV IL B" AND [Typ av transaktion] = "Sälj"');    

        // Delete handled rows
        alasql('DELETE FROM AvanzaData \
                WHERE [Värdepapperbeskrivning] = "NET IL B" AND [Typ av transaktion] = "Sälj"');

        alasql('DELETE FROM AvanzaData \
                WHERE [Värdepapperbeskrivning] = "CRED IL A" AND [Typ av transaktion] = "Sälj"');

        alasql('DELETE FROM AvanzaData \
                WHERE [Värdepapperbeskrivning] = "SECT IL B" AND [Typ av transaktion] = "Sälj"');

        alasql('DELETE FROM AvanzaData \
                WHERE [Värdepapperbeskrivning] = "BETS IL B" AND [Typ av transaktion] = "Sälj"');

        alasql('DELETE FROM AvanzaData \
                WHERE [Värdepapperbeskrivning] = "KINV IL B" AND [Typ av transaktion] = "Sälj"');
    }

    function addNordnetRowsForDividend() {

        // NetEnt SE0008212971
        alasql('INSERT INTO NordnetData \
                SELECT [Affärsdag], Antal, Avgifter, Belopp, [Bokföringsdag], "SE0008212971" AS ISIN, Instrumenttyp, Kurs, Likviddag, Makuleringsdatum, "UTDELNING" AS Transaktionstyp, Valuta, "NET B" AS [Värdepapper], Transaktionstext FROM NordnetData \
                WHERE [Värdepapper] = "NET IL B" AND Transaktionstyp = "INLÖSEN LIKVID"');

        // Creades SE0004390516
        alasql('INSERT INTO NordnetData \
                SELECT [Affärsdag], Antal, Avgifter, Belopp, [Bokföringsdag], "SE0004390516" AS ISIN, Instrumenttyp, Kurs, Likviddag, Makuleringsdatum, "UTDELNING" AS Transaktionstyp, Valuta, "CRED A" AS [Värdepapper], Transaktionstext FROM NordnetData \
                WHERE [Värdepapper] = "CRED IL A" AND Transaktionstyp = "INLÖSEN LIKVID"');

        // Sectra SE0008613970
        alasql('INSERT INTO NordnetData \
                SELECT [Affärsdag], Antal, Avgifter, Belopp, [Bokföringsdag], "SE0008613970" AS ISIN, Instrumenttyp, Kurs, Likviddag, Makuleringsdatum, "UTDELNING" AS Transaktionstyp, Valuta, "SECT B" AS [Värdepapper], Transaktionstext FROM NordnetData \
                WHERE [Värdepapper] = "SECT IL B" AND Transaktionstyp = "INLÖSEN LIKVID"');

        // Betsson SE0008242358
        alasql('INSERT INTO NordnetData \
                SELECT [Affärsdag], Antal, Avgifter, Belopp, [Bokföringsdag], "SE0008242358" AS ISIN, Instrumenttyp, Kurs, Likviddag, Makuleringsdatum, "UTDELNING" AS Transaktionstyp, Valuta, "BETS B" AS [Värdepapper], Transaktionstext FROM NordnetData \
                WHERE [Värdepapper] = "BETS IL B" AND Transaktionstyp = "INLÖSEN LIKVID"');

        // Kinnevik SE0000164626
        alasql('INSERT INTO NordnetData \
                SELECT [Affärsdag], Antal, Avgifter, Belopp, [Bokföringsdag], "SE0000164626" AS ISIN, Instrumenttyp, Kurs, Likviddag, Makuleringsdatum, "UTDELNING" AS Transaktionstyp, Valuta, "KINV B" AS [Värdepapper], Transaktionstext FROM NordnetData \
                WHERE [Värdepapper] = "KINV IL B" AND Transaktionstyp = "INLÖSEN LIKVID"');


        alasql('DELETE FROM AvanzaData \
                WHERE [Värdepapper] = "NET IL B" AND Transaktionstyp = "INLÖSEN LIKVID"');

        alasql('DELETE FROM AvanzaData \
                WHERE [Värdepapper] = "CRED IL A" AND Transaktionstyp = "INLÖSEN LIKVID"');

        alasql('DELETE FROM AvanzaData \
                WHERE [Värdepapper] = "SECT IL B" AND Transaktionstyp = "INLÖSEN LIKVID"');

        alasql('DELETE FROM AvanzaData \
                WHERE [Värdepapper] = "BETS IL B" AND Transaktionstyp = "INLÖSEN LIKVID"');

        alasql('DELETE FROM AvanzaData \
                WHERE [Värdepapper] = "KINV IL B" AND Transaktionstyp = "INLÖSEN LIKVID"');
    }

    return {
        deleteAvanzaRowsToSkip: deleteAvanzaRowsToSkip,
        addAvanzaRowsForDividend: addAvanzaRowsForDividend,
        addNordnetRowsForDividend: addNordnetRowsForDividend
    };
});