define(['./spreadsheetstocks', 
        './chartdonutportfolioallocation', 
        './chartdonutportfoliocurrency', 
        './treemapportfoliocurrency', 
        './chartfunnelportfolioindustry', 
        './chartradarportfolioindustry',
        './dropdowndonutportfolioallocation',
        './gridportfoliodividend',
        './alasqlstockdividenddata'], 
     function(
     spreadsheetStocks,
     chartDonutPortfolioAllocation,
     chartDonutPortfolioCurrency,
     treeMapPortfolioCurrency,
     chartFunnelPortfolioIndustry,
     chartRadarPortfolioIndustry,
     dropdownDonutPortfolioAllocation,
     gridPortfolioDividend,
     alasqlStockDividendData) {

    function loadSpreadsheetWithProgress() {

        alasqlStockDividendData.createStockDividendDataTable();
        alasqlStockDividendData.loadDataFromFileToTable();
        
        setTimeout(function(){   
            loadSpreadsheetStocks();
            kendo.ui.progress($(document.body), false);
        }, 10);

        setTimeout(function(){ 
            $("#btnLoadPortfolioCharts").kendoButton().data("kendoButton").enable(true);
        }, 1500);
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

    function loadGridPortfolioDividend() {
        gridPortfolioDividend.setId("#gridPortfolioDividend");
        gridPortfolioDividend.setData();
        gridPortfolioDividend.load();
    }

    function loadSpangridportfoliodividendinfo() {
        $("#spangridportfoliodividendinfo").kendoTooltip({
            content: "<p align=\"left\">Erhållna/förväntad utdelningar. !! Under utveckling !! </br> \
                      Utdelningsinformation rörande kanadensiska innehav saknas för stunden. </br> \
                      Förväntade utdelningar utgår från de antal aktier som presenteras i kalkylark portföljöversikt. </br> \
                      För utländska innehav beräknas utdelningen utifrån dagens växelkurs och utan beräkning av den källskatt som dras. </br> \
                      För utländska innehav som presenteras som erhållen utdelning är källskatten avdragen från beloppet. </br> \
                      Du kan alltså inte förlita dig på att denna information är 100% tillförlitlig men den ska ge en god översiktlig bild över dina utdelningar för året.</p>",
            position: "bottom",
            width: 500
        });
    }

    function loadCharts() {
        $('#chartPortfolioContent').attr("class", "");

        loadDropdownDonutPortfolioAllocationSelectSort();
        loadChartDonutPortfolioAllocation();
        loadChartDonutPortfolioCurrency();
        loadTreeMapPortfolioCurrency();
        loadChartFunnelPortfolioIndustry();
        loadChartRadarPortfolioIndustry();        
        loadSpangridportfoliodividendinfo();
        loadGridPortfolioDividend();
    }

    function saveSpreadsheetDataToTable() {
        spreadsheetStocks.saveSpreadsheetDataToTable();
    }

    return {
        loadSpreadsheetWithProgress: loadSpreadsheetWithProgress,
        saveSpreadsheetDataToTable: saveSpreadsheetDataToTable,
        loadCharts: loadCharts,
        loadSpreadsheetWithProgress: loadSpreadsheetWithProgress
    }
});