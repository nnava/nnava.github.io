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
        var result = avanzaYearData.concat(nordnetYearData);

        return alasql('SELECT DISTINCT Year FROM ?', [result]);   
    }

    return { 
        getNordnetCourtageSumSell: getNordnetCourtageSumSell,
        getNordnetCourtageSumBuy: getNordnetCourtageSumBuy,
        getAvanzaCourtageSumSell: getAvanzaCourtageSumSell,
        getAvanzaCourtageSumBuy: getAvanzaCourtageSumBuy,
        getCourtageYears: getCourtageYears
    };
});