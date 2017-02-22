define(['./alasqlavanza', './alasqlnordnet'], function(alasqlavanza, alasqlnordnet) {

    function createDemoData() {
        createTables();
        truncateTables();
        createAvanzaDemoData();
        createAvanzaPortfolioData();
        createNordnetDemoData();
    };

    function createAvanzaPortfolioData() {
        alasql('INSERT INTO AvanzaPortfolio VALUES ("ISK")');
        alasql('INSERT INTO AvanzaPortfolio VALUES ("KF")');
    }

    function createNordnetDemoData() {
        alasql('INSERT INTO NordnetData VALUES (43, "2016-11-18", 78, "0", "-85.31", "2016-12-07", "US4781601046", "Aktie", 0, "2016-12-06", "", "UTL KUPSKATT", "SEK", "JNJ", "", "0");');
        alasql('INSERT INTO NordnetData VALUES (42, "2016-11-18", 78, "0", "568.7", "2016-12-07", "US4781601046", "Aktie", 0.8, "2016-12-06", "", "UTDELNING", "SEK", "JNJ", "", "0");');
        alasql('INSERT INTO NordnetData VALUES (41, "2016-11-22", 40, "0", "-47,52", "2016-11-04", "US95040Q1040", "Aktie", 0, "2016-11-21", "", "UTL KUPSKATT", "SEK", "HCN", "", "0");');
        alasql('INSERT INTO NordnetData VALUES (40, "2016-11-22", 40, "0", "316.8", "2016-11-04", "US95040Q1040", "Aktie", 0.86, "2016-11-21", "", "UTDELNING", "SEK", "HCN", "", "0");');
        alasql('INSERT INTO NordnetData VALUES (39, "2016-11-08", 5, "12.61", "-5 055.47", "2016-12-13", "US4781601046", "Aktie", 110.12, "2016-12-12", "", "KÖPT", "SEK", "JNJ", "", "60");');
        alasql('INSERT INTO NordnetData VALUES (38, "2016-02-08", 5, "12.61", "-5 055.47", "2016-12-13", "US4781601046", "Aktie", 110.12, "2016-12-12", "", "KÖPT", "SEK", "JNJ", "", "55");');
        alasql('INSERT INTO NordnetData VALUES (37, "2016-02-08", 5, "12.61", "-5 055.47", "2016-12-13", "US4781601046", "Aktie", 110.12, "2016-12-12", "", "KÖPT", "SEK", "JNJ", "", "50");');
        alasql('INSERT INTO NordnetData VALUES (36, "2016-01-08", 5, "12.61", "-5 055.47", "2016-12-13", "US4781601046", "Aktie", 110.12, "2016-12-12", "", "KÖPT", "SEK", "JNJ", "", "45");');
        alasql('INSERT INTO NordnetData VALUES (35, "2016-11-09", 0, "0", "15 000.00", "2016-11-09", "", "Aktie", 0, "2016-11-09", "", "PREMIEINBETALNING", "SEK", "", "", "0");');
        alasql('INSERT INTO NordnetData VALUES (34, "2016-10-09", 0, "0", "14 000.00", "2016-10-09", "", "Aktie", 0, "2016-10-09", "", "PREMIEINBETALNING", "SEK", "", "", "0");');
        alasql('INSERT INTO NordnetData VALUES (33, "2016-09-09", 0, "0", "12 000.00", "2016-09-09", "", "Aktie", 0, "2016-09-09", "", "PREMIEINBETALNING", "SEK", "", "", "0");');
        alasql('INSERT INTO NordnetData VALUES (32, "2016-08-09", 0, "0", "11 000.00", "2016-08-09", "", "Aktie", 0, "2016-08-09", "", "PREMIEINBETALNING", "SEK", "", "", "0");');
        alasql('INSERT INTO NordnetData VALUES (31, "2016-09-13", 19, "0", "-26.9", "2016-08-17", "US88579Y1010", "Aktie", 0, "2016-09-12", "", "UTL KUPSKATT", "SEK", "MMM", "", "0");');
        alasql('INSERT INTO NordnetData VALUES (30, "2016-09-13", 19, "0", "179.36", "2016-08-17", "US88579Y1010", "Aktie", 1.11, "2016-09-12", "", "UTDELNING", "SEK", "MMM", "", "0");');
        alasql('INSERT INTO NordnetData VALUES (29, "2016-05-03", 45, "0", "-25.66", "2016-04-06", "US00206R1023", "Aktie", 0, "2016-05-02", "", "UTL KUPSKATT", "SEK", "T", "", "0");');
        alasql('INSERT INTO NordnetData VALUES (28, "2016-05-03", 45, "0", "171.08", "2016-04-06", "US00206R1023", "Aktie", 0.48, "2016-05-02", "", "UTDELNING", "SEK", "T", "", "0");');
        alasql('INSERT INTO NordnetData VALUES (27, "2016-05-03", 115, "0", "-28.7", "2016-04-06", "US7561091049", "Aktie", 0, "2016-05-02", "", "UTL KUPSKATT", "SEK", "O", "", "0");');
        alasql('INSERT INTO NordnetData VALUES (26, "2016-05-03", 115, "0", "191.08", "2016-04-06", "US7561091049", "Aktie", 0.1905, "2016-05-02", "", "UTDELNING", "SEK", "O", "", "0");');
        alasql('INSERT INTO NordnetData VALUES (25, "2016-04-03", 115, "0", "-28.7", "2016-03-06", "US7561091049", "Aktie", 0, "2016-05-02", "", "UTL KUPSKATT", "SEK", "O", "", "0");');
        alasql('INSERT INTO NordnetData VALUES (24, "2016-04-03", 115, "0", "191.08", "2016-03-06", "US7561091049", "Aktie", 0.1905, "2016-05-02", "", "UTDELNING", "SEK", "O", "", "0");');
        alasql('INSERT INTO NordnetData VALUES (23, "2016-03-08", 5, "10.93", "-4 055.47", "2016-12-13", "US4781601046", "Aktie", 101.12, "2016-12-12", "", "KÖPT", "SEK", "JNJ", "", "40");');
        alasql('INSERT INTO NordnetData VALUES (22, "2016-03-08", 5, "10.93", "-4 055.47", "2016-12-13", "US4781601046", "Aktie", 101.12, "2016-12-12", "", "KÖPT", "SEK", "JNJ", "", "35");');
        alasql('INSERT INTO NordnetData VALUES (21, "2016-04-08", 18, "12.99", "-5 055.47", "2016-12-13", "US00206R1023", "Aktie", 33.01, "2016-12-12", "", "KÖPT", "SEK", "T", "", "72");');
        alasql('INSERT INTO NordnetData VALUES (20, "2016-04-08", 11, "11.93", "-4 055.47", "2016-12-13", "US7561091049", "Aktie", 48.28, "2016-12-12", "", "KÖPT", "SEK", "O", "", "44");');
        alasql('INSERT INTO NordnetData VALUES (19, "2016-05-08", 18, "12.99", "-5 055.47", "2016-12-13", "US00206R1023", "Aktie", 33.01, "2016-12-12", "", "KÖPT", "SEK", "T", "", "54");');
        alasql('INSERT INTO NordnetData VALUES (18, "2016-05-08", 11, "11.93", "-4 055.47", "2016-12-13", "US7561091049", "Aktie", 48.28, "2016-12-12", "", "KÖPT", "SEK", "O", "", "33");');

        // 2015
        alasql('INSERT INTO NordnetData VALUES (17, "2015-03-08", 5, "10.93", "-4 055.47", "2015-12-13", "US4781601046", "Aktie", 101.12, "2016-12-12", "", "KÖPT", "SEK", "JNJ", "", "30");');
        alasql('INSERT INTO NordnetData VALUES (16, "2015-03-08", 5, "10.93", "-4 055.47", "2015-12-13", "US4781601046", "Aktie", 101.12, "2016-12-12", "", "KÖPT", "SEK", "JNJ", "", "25");');
        alasql('INSERT INTO NordnetData VALUES (15, "2015-04-08", 18, "12.99", "-5 055.47", "2015-12-13", "US00206R1023", "Aktie", 33.01, "2016-12-12", "", "KÖPT", "SEK", "T", "", "36");');
        alasql('INSERT INTO NordnetData VALUES (14, "2015-04-08", 11, "11.93", "-4 055.47", "2015-12-13", "US7561091049", "Aktie", 48.28, "2016-12-12", "", "KÖPT", "SEK", "O", "", "22");');
        alasql('INSERT INTO NordnetData VALUES (13, "2015-05-08", 18, "12.99", "-5 055.47", "2015-12-13", "US00206R1023", "Aktie", 33.01, "2016-12-12", "", "KÖPT", "SEK", "T", "", "18");');
        alasql('INSERT INTO NordnetData VALUES (12, "2015-05-08", 11, "11.93", "-4 055.47", "2015-12-13", "US7561091049", "Aktie", 48.28, "2016-12-12", "", "KÖPT", "SEK", "O", "", "11");');
        alasql('INSERT INTO NordnetData VALUES (11, "2015-10-09", 0, "0", "14 000.00", "2015-10-09", "", "Aktie", 0, "2016-10-09", "", "PREMIEINBETALNING", "SEK", "", "", "0");');
        alasql('INSERT INTO NordnetData VALUES (10, "2015-09-09", 0, "0", "12 000.00", "2015-09-09", "", "Aktie", 0, "2016-09-09", "", "PREMIEINBETALNING", "SEK", "", "", "0");');
        alasql('INSERT INTO NordnetData VALUES (9, "2015-08-09", 0, "0", "11 000.00", "2015-08-09", "", "Aktie", 0, "2016-08-09", "", "PREMIEINBETALNING", "SEK", "", "", "0");');
        alasql('INSERT INTO NordnetData VALUES (8, "2015-05-08", 18, "12.99", "-5 055.47", "2015-12-13", "US00206R1023", "Aktie", 33.01, "2016-12-12", "", "SÅLT", "SEK", "T", "", "0");');
        alasql('INSERT INTO NordnetData VALUES (7, "2015-05-08", 11, "11.93", "-4 055.47", "2015-12-13", "US7561091049", "Aktie", 48.28, "2016-12-12", "", "SÅLT", "SEK", "O", "", "0");');

        // 2014
        alasql('INSERT INTO NordnetData VALUES (6, "2014-03-08", 5, "10.93", "-4 055.47", "2014-12-13", "US4781601046", "Aktie", 101.12, "2016-12-12", "", "KÖPT", "SEK", "JNJ", "", "20");');
        alasql('INSERT INTO NordnetData VALUES (5, "2014-03-08", 5, "10.93", "-4 055.47", "2014-12-13", "US4781601046", "Aktie", 101.12, "2016-12-12", "", "KÖPT", "SEK", "JNJ", "", "15");');
        alasql('INSERT INTO NordnetData VALUES (4, "2014-04-08", 18, "12.99", "-5 055.47", "2014-12-13", "US00206R1023", "Aktie", 33.01, "2016-12-12", "", "KÖPT", "SEK", "T", "", "18");');
        alasql('INSERT INTO NordnetData VALUES (3, "2014-04-08", 11, "11.93", "-4 055.47", "2014-12-13", "US7561091049", "Aktie", 48.28, "2016-12-12", "", "KÖPT", "SEK", "O", "", "11");');
        alasql('INSERT INTO NordnetData VALUES (2, "2014-03-08", 5, "10.93", "-4 055.47", "2014-12-13", "US4781601046", "Aktie", 101.12, "2016-12-12", "", "SÅLT", "SEK", "JNJ", "", "10");');
        alasql('INSERT INTO NordnetData VALUES (1, "2014-03-08", 5, "10.93", "-4 055.47", "2014-12-13", "US4781601046", "Aktie", 101.12, "2016-12-12", "", "SÅLT", "SEK", "JNJ", "", "5");');
    }

    function createAvanzaDemoData() {
        alasql('INSERT INTO AvanzaData VALUES (100, -90000, "2015-05-30", 2015, 5, "US4781601046", "KF", 100.00, "Köp", "SEK", "Johnson & Johnson");');
        alasql('INSERT INTO AvanzaData VALUES (6, -1880, "2016-11-30", 2016, 11, "SE0000107401", "ISK", 313.2, "Köp", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (6, -1890, "2016-10-28", 2016, 10, "SE0000107401", "ISK", 313.2, "Köp", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (6, -1880, "2016-10-28", 2016, 10, "SE0000107401", "ISK", 313.2, "Köp", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (6, -1880, "2016-09-19", 2016, 9, "SE0000107401", "ISK", 313.2, "Köp", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (6, -1880, "2016-09-19", 2016, 9, "SE0000107401", "ISK", 313.2, "Köp", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (6, 1825, "2016-09-19", 2016, 9, "SE0000107401", "ISK", 313.2, "Sälj", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (6, 1825, "2016-09-19", 2016, 9, "SE0000107401", "ISK", 313.2, "Sälj", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (0, 10000, "2016-09-15", 2016, 9, "-", "ISK", 0, "Insättning", "SEK", "Direktinsättning från SEB");');
        alasql('INSERT INTO AvanzaData VALUES (0, 40000, "2016-06-15", 2016, 6, "-", "ISK", 0, "Insättning", "SEK", "Direktinsättning från SEB");');
        alasql('INSERT INTO AvanzaData VALUES (0, 50000, "2016-03-15", 2016, 3, "-", "ISK", 0, "Insättning", "SEK", "Direktinsättning från SEB");');
        alasql('INSERT INTO AvanzaData VALUES (0, 60000, "2016-01-15", 2016, 1, "-", "ISK", 0, "Insättning", "SEK", "Direktinsättning från SEB");');
        alasql('INSERT INTO AvanzaData VALUES (0, 10000, "2016-01-15", 2016, 1, "-", "ISK", 0, "Insättning", "SEK", "Direktinsättning från SEB");');
        alasql('INSERT INTO AvanzaData VALUES (200, 1650, "2016-04-26", 2016, 4, "SE0000936478", "ISK", 8.25, "Utdelning", "SEK", "Intrum Justitia");');
        alasql('INSERT INTO AvanzaData VALUES (250, -165.53, "2016-03-11", 2016, 3, "US2910111044", "KF", 0, "Utländsk källskatt 15%", "SEK", "Utländsk källskatt");');
        alasql('INSERT INTO AvanzaData VALUES (250, 1436.91, "2016-03-11", 2016, 3, "US2910111044", "KF", 3.97, "Utdelning", "SEK", "Emerson Electric Co");');
        alasql('INSERT INTO AvanzaData VALUES (300, 2925, "2016-05-10", 2016, 5, "SE0000106270", "ISK", 9.75, "Utdelning", "SEK", "Hennes & Mauritz B");');
        alasql('INSERT INTO AvanzaData VALUES (100, 1250, "2016-05-09", 2016, 5, "SE0005704053", "ISK", 12.5, "Utdelning", "SEK", "SAS PREF");');
        alasql('INSERT INTO AvanzaData VALUES (500, 2500, "2016-05-09", 2016, 5, "SE0005936713", "ISK", 5, "Utdelning", "SEK", "Akelius Residential Pref");');
        alasql('INSERT INTO AvanzaData VALUES (300, 1575, "2016-03-30", 2016, 3, "SE0000120784", "ISK", 5.25, "Utdelning", "SEK", "SEB");');
        alasql('INSERT INTO AvanzaData VALUES (170, 465.8, "2016-03-10", 2016, 3, "US9047677045", "KF", 2.74, "Utdelning", "SEK", "Unilever PLC");');
        alasql('INSERT INTO AvanzaData VALUES (100, 500, "2016-01-05", 2016, 1, "SE0006593927", "ISK", 5, "Utdelning", "SEK", "Klövern pref");');
        alasql('INSERT INTO AvanzaData VALUES (110, 550, "2016-04-04", 2016, 4, "SE0006593927", "ISK", 5, "Utdelning", "SEK", "Klövern pref");');
        alasql('INSERT INTO AvanzaData VALUES (110, 550, "2016-07-04", 2016, 7, "SE0006593927", "ISK", 5, "Utdelning", "SEK", "Klövern pref");');
        alasql('INSERT INTO AvanzaData VALUES (110, 550, "2016-10-04", 2016, 10, "SE0006593927", "ISK", 5, "Utdelning", "SEK", "Klövern pref");');
        alasql('INSERT INTO AvanzaData VALUES (100, 950, "2016-04-11", 2016, 4, "SE0000190134", "ISK", 9.5, "Utdelning", "SEK", "Beijer Alma B");');
        alasql('INSERT INTO AvanzaData VALUES (230, 1150, "2016-04-11", 2016, 4, "SE0000107203", "ISK", 5, "Utdelning", "SEK", "Industrivärden C");');
        alasql('INSERT INTO AvanzaData VALUES (80, 272.8, "2016-11-28", 2016, 11, "US40414L1098", "KF", 3.41, "Utdelning", "SEK", "HCP Inc");');
        alasql('INSERT INTO AvanzaData VALUES (100, 490, "2016-04-11", 2016, 4, "SE0000379190", "ISK", 4.9, "Utdelning", "SEK", "Castellum");');

        // 2015
        alasql('INSERT INTO AvanzaData VALUES (100, -36530, "2015-05-30", 2015, 5, "US9047677045", "KF", 39.54, "Köp", "SEK", "Unilever PLC");');
        alasql('INSERT INTO AvanzaData VALUES (2050, -205000, "2015-05-30", 2015, 5, "SE0000379190", "ISK", 100, "Köp", "SEK", "Castellum");');
        alasql('INSERT INTO AvanzaData VALUES (950, -142700, "2015-05-30", 2015, 5, "SE0000107203", "ISK", 150.2, "Köp", "SEK", "Industrivärden C");');
        alasql('INSERT INTO AvanzaData VALUES (400, -116010, "2015-05-30", 2015, 5, "SE0000106270", "ISK", 290, "Köp", "SEK", "Hennes & Mauritz B");');
        alasql('INSERT INTO AvanzaData VALUES (700, -182010, "2015-05-30", 2015, 5, "SE0000936478", "ISK", 260, "Köp", "SEK", "Intrum Justitia");');
        alasql('INSERT INTO AvanzaData VALUES (6, -1879, "2015-05-30", 2015, 5, "SE0000107401", "ISK", 313.2, "Köp", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (6, -1879, "2015-04-19", 2015, 4, "SE0000107401", "ISK", 313.2, "Köp", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (6, -1879, "2015-03-19", 2015, 3, "SE0000107401", "ISK", 313.2, "Köp", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (6, 1825, "2015-02-19", 2015, 2, "SE0000107401", "ISK", 313.2, "Sälj", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (6, 1825, "2015-01-19", 2015, 1, "SE0000107401", "ISK", 313.2, "Sälj", "SEK", "Investor A");');
        alasql('INSERT INTO AvanzaData VALUES (100, 1250, "2015-11-09", 2015, 11, "SE0005704053", "ISK", 12.5, "Utdelning", "SEK", "SAS PREF");');
        alasql('INSERT INTO AvanzaData VALUES (500, 2500, "2016-11-09", 2015, 11, "SE0005936713", "ISK", 5, "Utdelning", "SEK", "Akelius Residential Pref");');
        alasql('INSERT INTO AvanzaData VALUES (200, 1000, "2015-03-30", 2015, 3, "SE0000120784", "ISK", 5, "Utdelning", "SEK", "SEB");');
        alasql('INSERT INTO AvanzaData VALUES (150, 384, "2015-03-10", 2015, 3, "US9047677045", "KF", 2.56, "Utdelning", "SEK", "Unilever PLC");');
        alasql('INSERT INTO AvanzaData VALUES (0, 1000, "2015-09-15", 2015, 9, "-", "ISK", 0, "Insättning", "SEK", "Direktinsättning från SEB");');
        alasql('INSERT INTO AvanzaData VALUES (0, 20000, "2015-05-15", 2015, 5, "-", "ISK", 0, "Insättning", "SEK", "Direktinsättning från SEB");');
        alasql('INSERT INTO AvanzaData VALUES (0, 20000, "2015-05-15", 2015, 5, "-", "ISK", 0, "Insättning", "SEK", "Direktinsättning från SEB");');
        alasql('INSERT INTO AvanzaData VALUES (0, 10000, "2015-01-15", 2015, 1, "-", "ISK", 0, "Insättning", "SEK", "Direktinsättning från SEB");');
        alasql('INSERT INTO AvanzaData VALUES (100, 900, "2015-04-11", 2015, 4, "SE0000190134", "ISK", 9, "Utdelning", "SEK", "Beijer Alma B");');
        alasql('INSERT INTO AvanzaData VALUES (100, 625, "2015-04-11", 2015, 4, "SE0000107203", "ISK", 6.25, "Utdelning", "SEK", "Industrivärden C");');
        alasql('INSERT INTO AvanzaData VALUES (80, 248.8, "2015-11-28", 2015, 11, "US40414L1098", "KF", 3.11, "Utdelning", "SEK", "HCP Inc");');
        alasql('INSERT INTO AvanzaData VALUES (10, 49, "2015-04-11", 2015, 4, "SE0000379190", "ISK", 4.9, "Utdelning", "SEK", "Castellum");');

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