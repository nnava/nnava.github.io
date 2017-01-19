define(['./alasqlavanza', './alasqlnordnet'], function(alasqlavanza, alasqlnordnet) {

    var avanzaValue;
    var nordnetValue;

    function setDataValues(avanzaValueIn, nordnetValueIn) {
        avanzaValue = avanzaValueIn;
        nordnetValue = nordnetValueIn;
    }

    function setSourceData() {
        alasqlnordnet.setSourceData(nordnetValue);
    }

    function getCourtageSumSell(year) {
        return alasqlnordnet.getCourtageSumSell(year);
    }

    function getCourtageSumBuy(year) {        
        return alasqlnordnet.getCourtageSumBuy(year);
    }

    function getCourtageYears() {

        var nordnetYearData = alasqlnordnet.getCourtageYears();

        alasql('CREATE TABLE IF NOT EXISTS CourtageYearTable \
               (Year INT);');

        alasql('INSERT INTO CourtageYearTable SELECT Year \
                FROM ?', [nordnetYearData]);

        var resultYear = alasql('SELECT DISTINCT Year FROM CourtageYearTable');
        alasql('TRUNCATE TABLE CourtageYearTable');
        return resultYear;        
    }

    return { 
        getCourtageSumSell: getCourtageSumSell,
        getCourtageSumBuy: getCourtageSumBuy,
        getCourtageYears, getCourtageYears,
        setDataValues: setDataValues,
        setSourceData: setSourceData
    };
});