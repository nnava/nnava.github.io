define(['./spreadsheetstocks', './chartdonutportfolioallocation', './chartdonutportfoliocurrency', './treemapportfoliocurrency', './chartfunnelportfolioindustry', './chartradarportfolioindustry'], 
     function(
     spreadsheetStocks,
     chartDonutPortfolioAllocation,
     chartDonutPortfolioCurrency,
     treeMapPortfolioCurrency,
     chartFunnelPortfolioIndustry,
     chartRadarPortfolioIndustry) {

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

    function loadChartRadarPortfolioIndustry() {       
        chartRadarPortfolioIndustry.setChartId('#chartRadarPortfolioIndustry');
        chartRadarPortfolioIndustry.setChartData();
        chartRadarPortfolioIndustry.loadChart();
    }

    function loadChartFunnelPortfolioIndustry() {       
        chartFunnelPortfolioIndustry.setChartId('#chartFunnelPortfolioIndustry');
        chartFunnelPortfolioIndustry.setChartData();
        chartFunnelPortfolioIndustry.loadChart();
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
        loadChartFunnelPortfolioIndustry();
        loadChartRadarPortfolioIndustry();
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