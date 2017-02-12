define(['./spreadsheetstocks', './chartdonutportfolioallocation', './chartdonutportfoliocurrency', './treemapportfoliocurrency'], 
     function(
     spreadsheetStocks,
     chartDonutPortfolioAllocation,
     chartDonutPortfolioCurrency,
     treeMapPortfolioCurrency) {

    function loadSpreadsheetWithProgress() {

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
        chartDonutPortfolioAllocation.setChartId('#chartDonutPortfolioAllocation');
        chartDonutPortfolioAllocation.setChartData();
        chartDonutPortfolioAllocation.loadChart();
    }

    function loadChartDonutPortfolioCurrency() {       
        chartDonutPortfolioCurrency.setChartId('#chartDonutPortfolioCurrency');
        chartDonutPortfolioCurrency.setChartData();
        chartDonutPortfolioCurrency.loadChart();
    }

    function loadTreeMapPortfolioCurrency() {
        treeMapPortfolioCurrency.setChartId('#treeMapPortfolioCurrency');
        treeMapPortfolioCurrency.setChartData();
        treeMapPortfolioCurrency.loadChart();
    }

    function loadCharts() {
        $('#chartPortfolioContent').attr("class", "");
        
        loadChartDonutPortfolioAllocation();
        loadChartDonutPortfolioCurrency();
        loadTreeMapPortfolioCurrency();
    }

    function saveSpreadsheetDataToTable() {
        spreadsheetStocks.saveSpreadsheetDataToTable();
    }

    return {
        loadSpreadsheetWithProgress: loadSpreadsheetWithProgress,
        saveSpreadsheetDataToTable: saveSpreadsheetDataToTable,
        loadCharts: loadCharts
    }
});