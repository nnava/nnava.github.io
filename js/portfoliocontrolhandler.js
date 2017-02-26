define(['./spreadsheetstocks', 
        './chartdonutportfolioallocation', 
        './chartdonutportfoliocurrency', 
        './treemapportfoliocurrency', 
        './chartfunnelportfolioindustry', 
        './chartradarportfolioindustry',
        './dropdowndonutportfolioallocation'], 
     function(
     spreadsheetStocks,
     chartDonutPortfolioAllocation,
     chartDonutPortfolioCurrency,
     treeMapPortfolioCurrency,
     chartFunnelPortfolioIndustry,
     chartRadarPortfolioIndustry,
     dropdownDonutPortfolioAllocation) {

    function loadSpreadsheetWithProgress() {

        setTimeout(function(){   
            loadSpreadsheetStocks();
            kendo.ui.progress($(document.body), false);
        }, 10);
    }

    function loadDropdownDonutPortfolioAllocationSelectSort() {
        dropdownDonutPortfolioAllocation.setDropdownId('#dropdownDonutPortfolioAllocationSelectSort');
        dropdownDonutPortfolioAllocation.setDropdownData();
        dropdownDonutPortfolioAllocation.loadDropdown();

        $("#dropdownDonutPortfolioAllocationSelectSort").data("kendoDropDownList").bind("change", dropDownListDonutPortfolioAllocation_Change);
    }

    function dropDownListDonutPortfolioAllocation_Change(e) {
        loadChartDonutPortfolioAllocation();
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
        var sort = dropdownDonutPortfolioAllocation.getValue();
        if(sort == null || sort == '')
            sort = "name";

        chartDonutPortfolioAllocation.setChartId('#chartDonutPortfolioAllocation');
        chartDonutPortfolioAllocation.setChartData(sort);
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
        
        loadDropdownDonutPortfolioAllocationSelectSort();
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