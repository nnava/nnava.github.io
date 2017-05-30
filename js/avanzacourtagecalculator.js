define([], function() {

    function calculateSell(antal, kurs, belopp) {
        var transactionWithoutCourtage = (Math.abs(antal) * kurs);
        var courtage = transactionWithoutCourtage - belopp;

        var courtageDecimalValue = (courtage % 1).toFixed(2);
        if(courtageDecimalValue == 0.50)
            return (Math.round(courtage));
        else if(courtageDecimalValue < 0.50)
            return (Math.floor(courtage));
        else
            return (Math.round(courtage));
    }

    function calculateBuy(antal, kurs, belopp) {
        var transactionWithoutCourtage = (antal * kurs);
        var courtage = Math.abs(belopp) - transactionWithoutCourtage;

        var courtageDecimalValue = (courtage % 1).toFixed(2);
        if(courtageDecimalValue <= 0.50)
            return (Math.floor(courtage));
        else
            return (Math.round(courtage));
    }

    return { 
        calculateSell: calculateSell,
        calculateBuy: calculateBuy
    };
});