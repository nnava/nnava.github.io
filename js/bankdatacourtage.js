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
        return alasqlnordnet.getCourtageYears();
    }

    return { 
        getCourtageSumSell: getCourtageSumSell,
        getCourtageSumBuy: getCourtageSumBuy,
        getCourtageYears, getCourtageYears,
        setDataValues: setDataValues,
        setSourceData: setSourceData
    };
});