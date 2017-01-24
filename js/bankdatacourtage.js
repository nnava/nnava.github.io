define(['./alasqlavanza', './alasqlnordnet'], function(alasqlavanza, alasqlnordnet) {

    function getNordnetCourtageSumSell(year) {
        return alasqlnordnet.getCourtageSumSell(year);
    }

    function getNordnetCourtageSumBuy(year) {        
        return alasqlnordnet.getCourtageSumBuy(year);
    }

    function getAvanzaCourtageSumSell(year) {
        return alasqlavanza.getCourtageSumSell(year);
    }

    function getAvanzaCourtageSumBuy(year) {        
        return alasqlavanza.getCourtageSumBuy(year);
    }

    function getCourtageYears() {

        var nordnetYearData = alasqlnordnet.getCourtageYears();
        var avanzaYearData = alasqlavanza.getCourtageYears();

        alasql('CREATE TABLE IF NOT EXISTS CourtageYearTable \
               (Year INT);');

        alasql('INSERT INTO CourtageYearTable SELECT Year \
                FROM ?', [nordnetYearData]);

        alasql('INSERT INTO CourtageYearTable SELECT Year \
                FROM ?', [avanzaYearData]);

        var resultYear = alasql('SELECT DISTINCT Year FROM CourtageYearTable');
        alasql('TRUNCATE TABLE CourtageYearTable');
        return resultYear;        
    }

    return { 
        getNordnetCourtageSumSell: getNordnetCourtageSumSell,
        getNordnetCourtageSumBuy: getNordnetCourtageSumBuy,
        getAvanzaCourtageSumSell: getAvanzaCourtageSumSell,
        getAvanzaCourtageSumBuy: getAvanzaCourtageSumBuy,
        getCourtageYears, getCourtageYears
    };
});