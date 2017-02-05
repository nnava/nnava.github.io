define(['./spreadsheetstocks'], 
     function(
     spreadsheetStocks) {

    function loadControls() {

        setTimeout(function(){   
            loadSpreadsheetStocks();
            kendo.ui.progress($(document.body), false);
        }, 10);
    }

    function loadSpreadsheetStocks() {
        spreadsheetStocks.setSpreadsheetId('#spreadsheetStocks');
        spreadsheetStocks.setData();
        spreadsheetStocks.loadSpreadSheet();
    }

    function portfolioData() {
        var spreadsheet = $("#spreadsheetStocks").data("kendoSpreadsheet");
        var data = spreadsheet.toJSON();

        console.log(data);
    }

    return {
        loadControls: loadControls,
        portfolioData: portfolioData
    }
});