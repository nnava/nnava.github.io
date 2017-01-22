define(['./alasqlavanza', './alasqlnordnet'], function(alasqlavanza, alasqlnordnet) {

    function getSellTransactionSumBelopp(year) {
        var avanzaBelopp = alasqlavanza.getSellTransactionSumBelopp(year);
        if(isNaN(avanzaBelopp))
            avanzaBelopp = 0;

        var nordnetBelopp = alasqlnordnet.getSellTransactionSumBelopp(year);
        if(isNaN(nordnetBelopp))
            nordnetBelopp = 0;

        return avanzaBelopp + nordnetBelopp;
    }

    function getBuyTransactionSumBelopp(year) {        
        var avanzaBelopp = alasqlavanza.getBuyTransactionSumBelopp(year);
        if(isNaN(avanzaBelopp))
            avanzaBelopp = 0;

        var nordnetBelopp = alasqlnordnet.getBuyTransactionSumBelopp(year);
        if(isNaN(nordnetBelopp))
            nordnetBelopp = 0;

        return avanzaBelopp + nordnetBelopp;
    }

    function getTransactionYears() {

        var avanzaYearData = alasqlavanza.getTransactionYears();
        var nordnetYearData = alasqlnordnet.getTransactionYears();

        alasql('CREATE TABLE IF NOT EXISTS TransactionYearTable \
               (Year INT);');

         alasql('INSERT INTO TransactionYearTable SELECT Year \
                 FROM ?', [nordnetYearData]);

        alasql('INSERT INTO TransactionYearTable SELECT Year \
                FROM ?', [avanzaYearData]);

        var resultYear = alasql('SELECT DISTINCT Year FROM TransactionYearTable');
        alasql('TRUNCATE TABLE TransactionYearTable');
        return resultYear;        
    }

    return { 
        getBuyTransactionSumBelopp: getBuyTransactionSumBelopp,
        getSellTransactionSumBelopp: getSellTransactionSumBelopp,
        getTransactionYears: getTransactionYears
    };
});