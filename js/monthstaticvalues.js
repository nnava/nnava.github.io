define([], function() {
    var monthsInput = ["inputJanuari", "inputFebruari", "inputMars", "inputApril", "inputMaj", "inputJuni", "inputJuli", "inputAugusti", "inputSeptember", "inputOktober", "inputNovember", "inputDecember"];
    var months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];
    var monthsWitLetters = ["A. Januari", "B. Februari", "C. Mars", "D. April", "E. Maj", "F. Juni", "G. Juli", "H. Augusti", "I. September", "J. Oktober", "K. November", "L. December"];

    function getMonthInputs() {
        return monthsInput;
    };

    function getMonthValues() {
        return months;
    };

    function getMonthWithLettersValues() {
        return monthsWitLetters;
    };

    return { 
        getMonthInputs: getMonthInputs,
        getMonthValues: getMonthValues,
        getMonthWithLettersValues: getMonthWithLettersValues
    };
});