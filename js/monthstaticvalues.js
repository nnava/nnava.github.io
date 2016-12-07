define([], function() {
    var monthsInput = ["inputJanuari", "inputFebruari", "inputMars", "inputApril", "inputMaj", "inputJuni", "inputJuli", "inputAugusti", "inputSeptember", "inputOktober", "inputNovember", "inputDecember"];
    var months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];

    function getMonthInputs() {
        return monthsInput;
    };

    function getMonthValues() {
        return months;
    };

    return { 
        getMonthInputs: getMonthInputs,
        getMonthValues: getMonthValues
    };
});