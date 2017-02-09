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

    function saveSpreadsheetDataToTable() {
        spreadsheetStocks.saveSpreadsheetDataToTable();
    }

    return {
        loadControls: loadControls,
        saveSpreadsheetDataToTable: saveSpreadsheetDataToTable
    }
});