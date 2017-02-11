define(['./spreadsheetstocks', './chartdonutportfolioallocation'], 
     function(
     spreadsheetStocks,
     chartDonutPortfolioAllocation) {

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

    function loadChartDonutPortfolioAllocation() {
        $('#chartPortfolioAllocationRow').attr("class", "row-fluid");

        chartDonutPortfolioAllocation.setChartId('#chartDonutPortfolioAllocation');
        chartDonutPortfolioAllocation.setChartData();
        chartDonutPortfolioAllocation.loadChart();
    }

    function saveSpreadsheetDataToTable() {
        spreadsheetStocks.saveSpreadsheetDataToTable();
    }

    return {
        loadControls: loadControls,
        saveSpreadsheetDataToTable: saveSpreadsheetDataToTable,
        loadChartDonutPortfolioAllocation: loadChartDonutPortfolioAllocation
    }
});