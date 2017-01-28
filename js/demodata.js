define(['./alasqlavanza', './alasqlnordnet'], function(alasqlavanza, alasqlnordnet) {

    function createDemoData() {
        createTables();
        truncateTables();
        createAvanzaDemoData();
        createAvanzaPortfolioData();
        createNordnetDemoData();
    };

    function createAvanzaPortfolioData() {
        alasql('INSERT INTO AvanzaPortfolio VALUES ("ISK");');
        alasql('INSERT INTO AvanzaPortfolio VALUES ("KF");');
    }

    function createNordnetDemoData() {
        alasql('INSERT INTO NordnetData VALUES ("2016-11-18", 78, "0", "-85.31", "2016-12-07", "US4781601046", "Aktie", 0, "2016-12-06", "", "UTL KUPSKATT", "SEK", "JNJ");');
        alasql('INSERT INTO NordnetData VALUES ("2016-11-18", 78, "0", "568.7", "2016-12-07", "US4781601046", "Aktie", 0.8, "2016-12-06", "", "UTDELNING", "SEK", "JNJ");');
        alasql('INSERT INTO NordnetData VALUES ("2016-11-22", 40, "0", "-47,52", "2016-11-04", "US95040Q1040", "Aktie", 0, "2016-11-21", "", "UTL KUPSKATT", "SEK", "HCN");');
        alasql('INSERT INTO NordnetData VALUES ("2016-11-22", 40, "0", "316.8", "2016-11-04", "US95040Q1040", "Aktie", 0.86, "2016-11-21", "", "UTDELNING", "SEK", "HCN");');
        alasql('INSERT INTO NordnetData VALUES ("2016-11-08", 5, "12.61", "-5 055.47", "2016-12-13", "US4781601046", "Aktie", 110.12, "2016-12-12", "", "KÖPT", "SEK", "JNJ");');
        alasql('INSERT INTO NordnetData VALUES ("2016-02-08", 5, "12.61", "-5 055.47", "2016-12-13", "US4781601046", "Aktie", 110.12, "2016-12-12", "", "KÖPT", "SEK", "JNJ");');
        alasql('INSERT INTO NordnetData VALUES ("2016-02-08", 5, "12.61", "-5 055.47", "2016-12-13", "US4781601046", "Aktie", 110.12, "2016-12-12", "", "KÖPT", "SEK", "JNJ");');
        alasql('INSERT INTO NordnetData VALUES ("2016-01-08", 5, "12.61", "-5 055.47", "2016-12-13", "US4781601046", "Aktie", 110.12, "2016-12-12", "", "KÖPT", "SEK", "JNJ");');
        alasql('INSERT INTO NordnetData VALUES ("2016-11-09", 0, "0", "15 000.00", "2016-11-09", "", "Aktie", 0, "2016-11-09", "", "PREMIEINBETALNING", "SEK", "");');
        alasql('INSERT INTO NordnetData VALUES ("2016-10-09", 0, "0", "14 000.00", "2016-10-09", "", "Aktie", 0, "2016-10-09", "", "PREMIEINBETALNING", "SEK", "");');
        alasql('INSERT INTO NordnetData VALUES ("2016-09-09", 0, "0", "12 000.00", "2016-09-09", "", "Aktie", 0, "2016-09-09", "", "PREMIEINBETALNING", "SEK", "");');
        alasql('INSERT INTO NordnetData VALUES ("2016-08-09", 0, "0", "11 000.00", "2016-08-09", "", "Aktie", 0, "2016-08-09", "", "PREMIEINBETALNING", "SEK", "");');
        alasql('INSERT INTO NordnetData VALUES ("2016-09-13", 19, "0", "-26.9", "2016-08-17", "US88579Y1010", "Aktie", 0, "2016-09-12", "", "UTL KUPSKATT", "SEK", "MMM");');
        alasql('INSERT INTO NordnetData VALUES ("2016-09-13", 19, "0", "179.36", "2016-08-17", "US88579Y1010", "Aktie", 1.11, "2016-09-12", "", "UTDELNING", "SEK", "MMM");');
        alasql('INSERT INTO NordnetData VALUES ("2016-05-03", 45, "0", "-25.66", "2016-04-06", "US00206R1023", "Aktie", 0, "2016-05-02", "", "UTL KUPSKATT", "SEK", "T");');
        alasql('INSERT INTO NordnetData VALUES ("2016-05-03", 45, "0", "171.08", "2016-04-06", "US00206R1023", "Aktie", 0.48, "2016-05-02", "", "UTDELNING", "SEK", "T");');
        alasql('INSERT INTO NordnetData VALUES ("2016-05-03", 115, "0", "-28.7", "2016-04-06", "US7561091049", "Aktie", 0, "2016-05-02", "", "UTL KUPSKATT", "SEK", "O");');
        alasql('INSERT INTO NordnetData VALUES ("2016-05-03", 115, "0", "191.08", "2016-04-06", "US7561091049", "Aktie", 0.1905, "2016-05-02", "", "UTDELNING", "SEK", "O");');
        alasql('INSERT INTO NordnetData VALUES ("2016-04-03", 115, "0", "-28.7", "2016-03-06", "US7561091049", "Aktie", 0, "2016-05-02", "", "UTL KUPSKATT", "SEK", "O");');
        alasql('INSERT INTO NordnetData VALUES ("2016-04-03", 115, "0", "191.08", "2016-03-06", "US7561091049", "Aktie", 0.1905, "2016-05-02", "", "UTDELNING", "SEK", "O");');
        alasql('INSERT INTO NordnetData VALUES ("2016-03-08", 5, "10.93", "-4 055.47", "2016-12-13", "US4781601046", "Aktie", 101.12, "2016-12-12", "", "KÖPT", "SEK", "JNJ");');
        alasql('INSERT INTO NordnetData VALUES ("2016-03-08", 5, "10.93", "-4 055.47", "2016-12-13", "US4781601046", "Aktie", 101.12, "2016-12-12", "", "KÖPT", "SEK", "JNJ");');
        alasql('INSERT INTO NordnetData VALUES ("2016-04-08", 18, "12.99", "-5 055.47", "2016-12-13", "US00206R1023", "Aktie", 33.01, "2016-12-12", "", "KÖPT", "SEK", "T");');
        alasql('INSERT INTO NordnetData VALUES ("2016-04-08", 11, "11.93", "-4 055.47", "2016-12-13", "US7561091049", "Aktie", 48.28, "2016-12-12", "", "KÖPT", "SEK", "O");');
        alasql('INSERT INTO NordnetData VALUES ("2016-05-08", 18, "12.99", "-5 055.47", "2016-12-13", "US00206R1023", "Aktie", 33.01, "2016-12-12", "", "KÖPT", "SEK", "T");');
        alasql('INSERT INTO NordnetData VALUES ("2016-05-08", 11, "11.93", "-4 055.47", "2016-12-13", "US7561091049", "Aktie", 48.28, "2016-12-12", "", "KÖPT", "SEK", "O");');

        // 2015
        alasql('INSERT INTO NordnetData VALUES ("2015-03-08", 5, "10.93", "-4 055.47", "2015-12-13", "US4781601046", "Aktie", 101.12, "2016-12-12", "", "KÖPT", "SEK", "JNJ");');
        alasql('INSERT INTO NordnetData VALUES ("2015-03-08", 5, "10.93", "-4 055.47", "2015-12-13", "US4781601046", "Aktie", 101.12, "2016-12-12", "", "KÖPT", "SEK", "JNJ");');
        alasql('INSERT INTO NordnetData VALUES ("2015-04-08", 18, "12.99", "-5 055.47", "2015-12-13", "US00206R1023", "Aktie", 33.01, "2016-12-12", "", "KÖPT", "SEK", "T");');
        alasql('INSERT INTO NordnetData VALUES ("2015-04-08", 11, "11.93", "-4 055.47", "2015-12-13", "US7561091049", "Aktie", 48.28, "2016-12-12", "", "KÖPT", "SEK", "O");');
        alasql('INSERT INTO NordnetData VALUES ("2015-05-08", 18, "12.99", "-5 055.47", "2015-12-13", "US00206R1023", "Aktie", 33.01, "2016-12-12", "", "KÖPT", "SEK", "T");');
        alasql('INSERT INTO NordnetData VALUES ("2015-05-08", 11, "11.93", "-4 055.47", "2015-12-13", "US7561091049", "Aktie", 48.28, "2016-12-12", "", "KÖPT", "SEK", "O");');
        alasql('INSERT INTO NordnetData VALUES ("2015-10-09", 0, "0", "14 000.00", "2015-10-09", "", "Aktie", 0, "2016-10-09", "", "PREMIEINBETALNING", "SEK", "");');
        alasql('INSERT INTO NordnetData VALUES ("2015-09-09", 0, "0", "12 000.00", "2015-09-09", "", "Aktie", 0, "2016-09-09", "", "PREMIEINBETALNING", "SEK", "");');
        alasql('INSERT INTO NordnetData VALUES ("2015-08-09", 0, "0", "11 000.00", "2015-08-09", "", "Aktie", 0, "2016-08-09", "", "PREMIEINBETALNING", "SEK", "");');
        alasql('INSERT INTO NordnetData VALUES ("2015-05-08", 18, "12.99", "-5 055.47", "2015-12-13", "US00206R1023", "Aktie", 33.01, "2016-12-12", "", "SÅLT", "SEK", "T");');
        alasql('INSERT INTO NordnetData VALUES ("2015-05-08", 11, "11.93", "-4 055.47", "2015-12-13", "US7561091049", "Aktie", 48.28, "2016-12-12", "", "SÅLt", "SEK", "O");');

        // 2014
        alasql('INSERT INTO NordnetData VALUES ("2014-03-08", 5, "10.93", "-4 055.47", "2014-12-13", "US4781601046", "Aktie", 101.12, "2016-12-12", "", "KÖPT", "SEK", "JNJ");');
        alasql('INSERT INTO NordnetData VALUES ("2014-03-08", 5, "10.93", "-4 055.47", "2014-12-13", "US4781601046", "Aktie", 101.12, "2016-12-12", "", "KÖPT", "SEK", "JNJ");');
        alasql('INSERT INTO NordnetData VALUES ("2014-04-08", 18, "12.99", "-5 055.47", "2014-12-13", "US00206R1023", "Aktie", 33.01, "2016-12-12", "", "KÖPT", "SEK", "T");');
        alasql('INSERT INTO NordnetData VALUES ("2014-04-08", 11, "11.93", "-4 055.47", "2014-12-13", "US7561091049", "Aktie", 48.28, "2016-12-12", "", "KÖPT", "SEK", "O");');
        alasql('INSERT INTO NordnetData VALUES ("2014-03-08", 5, "10.93", "-4 055.47", "2014-12-13", "US4781601046", "Aktie", 101.12, "2016-12-12", "", "SÅLT", "SEK", "JNJ");');
        alasql('INSERT INTO NordnetData VALUES ("2014-03-08", 5, "10.93", "-4 055.47", "2014-12-13", "US4781601046", "Aktie", 101.12, "2016-12-12", "", "SÅLT", "SEK", "JNJ");');
    }

    function createAvanzaDemoData() {
        alasql('INSERT INTO AvanzaData VALUES (6, -1825, "2016-11-30", "SE0000107401", "ISK", 313.2, "Köp", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (6, -1825, "2016-10-28", "SE0000107401", "ISK", 313.2, "Köp", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (6, -1825, "2016-10-28", "SE0000107401", "ISK", 313.2, "Köp", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (6, -1825, "2016-09-19", "SE0000107401", "ISK", 313.2, "Köp", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (6, -1825, "2016-09-19", "SE0000107401", "ISK", 313.2, "Köp", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (6, 1825, "2016-09-19", "SE0000107401", "ISK", 313.2, "Sälj", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (6, 1825, "2016-09-19", "SE0000107401", "ISK", 313.2, "Sälj", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (0, 10000, "2016-09-15", "-", "ISK", 0, "Insättning", "SEK", "Direktinsättning från SEB");');
        alasql('INSERT INTO AvanzaData VALUES (0, 40000, "2016-06-15", "-", "ISK", 0, "Insättning", "SEK", "Direktinsättning från SEB");');
        alasql('INSERT INTO AvanzaData VALUES (0, 50000, "2016-03-15", "-", "ISK", 0, "Insättning", "SEK", "Direktinsättning från SEB");');
        alasql('INSERT INTO AvanzaData VALUES (0, 60000, "2016-01-15", "-", "ISK", 0, "Insättning", "SEK", "Direktinsättning från SEB");');
        alasql('INSERT INTO AvanzaData VALUES (0, 10000, "2016-01-15", "-", "ISK", 0, "Insättning", "SEK", "Direktinsättning från SEB");');
        alasql('INSERT INTO AvanzaData VALUES (200, 1650, "2016-04-26", "SE0000936478", "ISK", 8.25, "Utdelning", "SEK", "Intrum Justitia");');
        alasql('INSERT INTO AvanzaData VALUES (250, -165.53, "2016-03-11", "US2910111044", "KF", 0, "Utländsk källskatt 15%", "SEK", "Utländsk källskatt");');
        alasql('INSERT INTO AvanzaData VALUES (250, 1436.91, "2016-03-11", "US2910111044", "KF", 3.97, "Utdelning", "SEK", "Emerson Electric Co");');
        alasql('INSERT INTO AvanzaData VALUES (300, 2925, "2016-05-10", "SE0000106270", "ISK", 9.75, "Utdelning", "SEK", "Hennes & Mauritz B");');
        alasql('INSERT INTO AvanzaData VALUES (100, 1250, "2016-05-09", "SE0005704053", "ISK", 12.5, "Utdelning", "SEK", "SAS PREF");');
        alasql('INSERT INTO AvanzaData VALUES (500, 2500, "2016-05-09", "SE0005936713", "ISK", 5, "Utdelning", "SEK", "Akelius Residential Pref");');
        alasql('INSERT INTO AvanzaData VALUES (300, 1575, "2016-03-30", "SE0000120784", "ISK", 5.25, "Utdelning", "SEK", "SEB");');
        alasql('INSERT INTO AvanzaData VALUES (170, 465.8, "2016-03-10", "US9047677045", "KF", 2.74, "Utdelning", "SEK", "Unilever PLC");');
        alasql('INSERT INTO AvanzaData VALUES (100, 500, "2016-01-05", "SE0006593927", "ISK", 5, "Utdelning", "SEK", "Klövern pref");');
        alasql('INSERT INTO AvanzaData VALUES (110, 550, "2016-04-04", "SE0006593927", "ISK", 5, "Utdelning", "SEK", "Klövern pref");');
        alasql('INSERT INTO AvanzaData VALUES (110, 550, "2016-07-04", "SE0006593927", "ISK", 5, "Utdelning", "SEK", "Klövern pref");');
        alasql('INSERT INTO AvanzaData VALUES (110, 550, "2016-10-04", "SE0006593927", "ISK", 5, "Utdelning", "SEK", "Klövern pref");');
        alasql('INSERT INTO AvanzaData VALUES (100, 950, "2016-04-11", "SE0000190134", "ISK", 9.5, "Utdelning", "SEK", "Beijer Alma B");');
        alasql('INSERT INTO AvanzaData VALUES (230, 1150, "2016-04-11", "SE0000107203", "ISK", 5, "Utdelning", "SEK", "Industrivärden C");');
        alasql('INSERT INTO AvanzaData VALUES (80, 272.8, "2016-11-28", "US40414L1098", "KF", 3.41, "Utdelning", "SEK", "HCP Inc");');
        alasql('INSERT INTO AvanzaData VALUES (100, 490, "2016-04-11", "SE0000379190", "ISK", 4.9, "Utdelning", "SEK", "Castellum");');

        // 2015
        alasql('INSERT INTO AvanzaData VALUES (6, -1825, "2015-05-30", "SE0000107401", "ISK", 313.2, "Köp", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (6, -1825, "2015-04-19", "SE0000107401", "ISK", 313.2, "Köp", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (6, -1825, "2015-03-19", "SE0000107401", "ISK", 313.2, "Köp", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (6, 1825, "2015-02-19", "SE0000107401", "ISK", 313.2, "Sälj", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (6, 1825, "2015-01-19", "SE0000107401", "ISK", 313.2, "Sälj", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (100, 1250, "2015-11-09", "SE0005704053", "ISK", 12.5, "Utdelning", "SEK", "SAS PREF");');
        alasql('INSERT INTO AvanzaData VALUES (500, 2500, "2016-11-09", "SE0005936713", "ISK", 5, "Utdelning", "SEK", "Akelius Residential Pref");');
        alasql('INSERT INTO AvanzaData VALUES (200, 1000, "2015-03-30", "SE0000120784", "ISK", 5, "Utdelning", "SEK", "SEB");');
        alasql('INSERT INTO AvanzaData VALUES (150, 384, "2015-03-10", "US9047677045", "KF", 2.56, "Utdelning", "SEK", "Unilever PLC");');
        alasql('INSERT INTO AvanzaData VALUES (0, 1000, "2015-09-15", "-", "ISK", 0, "Insättning", "SEK", "Direktinsättning från SEB");');
        alasql('INSERT INTO AvanzaData VALUES (0, 20000, "2015-05-15", "-", "ISK", 0, "Insättning", "SEK", "Direktinsättning från SEB");');
        alasql('INSERT INTO AvanzaData VALUES (0, 20000, "2015-05-15", "-", "ISK", 0, "Insättning", "SEK", "Direktinsättning från SEB");');
        alasql('INSERT INTO AvanzaData VALUES (0, 10000, "2015-01-15", "-", "ISK", 0, "Insättning", "SEK", "Direktinsättning från SEB");');
        alasql('INSERT INTO AvanzaData VALUES (100, 900, "2015-04-11", "SE0000190134", "ISK", 9, "Utdelning", "SEK", "Beijer Alma B");');
        alasql('INSERT INTO AvanzaData VALUES (100, 625, "2015-04-11", "SE0000107203", "ISK", 6.25, "Utdelning", "SEK", "Industrivärden C");');
        alasql('INSERT INTO AvanzaData VALUES (80, 248.8, "2015-11-28", "US40414L1098", "KF", 3.11, "Utdelning", "SEK", "HCP Inc");');
        alasql('INSERT INTO AvanzaData VALUES (10, 49, "2015-04-11", "SE0000379190", "ISK", 4.9, "Utdelning", "SEK", "Castellum");');

    }

    function createTables() {
        alasqlavanza.createDataTable();
        alasqlavanza.createPortfolioTable();
        alasqlnordnet.createDataTable();
    }

    function truncateTables() {
        alasql('TRUNCATE TABLE AvanzaData');
        alasql('TRUNCATE TABLE NordnetData');
    }

    return { 
        createDemoData: createDemoData
    };
});