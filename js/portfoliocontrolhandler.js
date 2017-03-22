define(['./spreadsheetstocks', 
        './chartdonutportfolioallocation', 
        './chartdonutportfoliocurrency', 
        './treemapportfoliocurrency', 
        './chartfunnelportfolioindustry', 
        './chartradarportfolioindustry',
        './dropdowndonutportfolioallocation',
        './gridportfoliodividend',
        './alasqlstockdividenddata',
        './chartdividendstackedcumulativeportfolio',
        './schedulerportfoliodividend'], 
     function(
     spreadsheetStocks,
     chartDonutPortfolioAllocation,
     chartDonutPortfolioCurrency,
     treeMapPortfolioCurrency,
     chartFunnelPortfolioIndustry,
     chartRadarPortfolioIndustry,
     dropdownDonutPortfolioAllocation,
     gridPortfolioDividend,
     alasqlStockDividendData,
     chartDividendStackedCumulativePortfolio,
     schedulerPortfolioDividend) {

    function loadSpreadsheetWithProgress() {
        kendo.ui.progress($(document.body), true);

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

    function loadChartDividendStackedCumulativePortfolio() {       
        chartDividendStackedCumulativePortfolio.setChartId('#chartDividendStackedCumulativePortfolio');
        chartDividendStackedCumulativePortfolio.setChartData();
        chartDividendStackedCumulativePortfolio.loadChart();
    }

    function loadSchedulerPortfolioDividend() {
        schedulerPortfolioDividend.setId("#schedulerPortfolioDividend");
        schedulerPortfolioDividend.setData();
        schedulerPortfolioDividend.load();
    }

    function loadSpangridportfoliodividendinfo() {
        $("#spangridportfoliodividendinfo").kendoTooltip({
            content: "<p align=\"left\">Erhållna/förväntad utdelningar. !! Under utveckling !! </br> \
                      Förväntade utdelningar utgår från de antal aktier som presenteras i kalkylark portföljöversikt. </br> \
                      För utländska innehav beräknas utdelningen utifrån dagens växelkurs och utan beräkning av den källskatt som dras. </br> \
                      För utländska innehav som presenteras som erhållen utdelning är källskatten avdragen från beloppet. </br> \
                      Du kan alltså inte förlita dig på att denna information är 100% tillförlitlig men den ska ge en god översiktlig bild över dina utdelningar för året.</p>",
            position: "bottom",
            width: 500
        });
    }

    function initChartDividendStackedCumulativePortfolioSettingBtnGroup() {
        $("#chartDividendStackedCumulativePortfolioSettingBtnGroup").kendoMobileButtonGroup({
            select: function(e) {
                var seriesDefaultType = "column";
                // This is purely ugly but since only using image...
                if(e.index === 1)
                    seriesDefaultType = "bar";
                    
                chartDividendStackedCumulativePortfolio.updateChartOptions(seriesDefaultType);
            },
            index: 0
        });
    }

    function saveSpreadsheetDataToTable() {
        spreadsheetStocks.saveSpreadsheetDataToTable();
    }

    function initBtnToTop() {
        $(".btnToTop").kendoButton({
            click: function(e) {
                $('html, body').animate({scrollTop: 0}, "slow");
            }
        });
    }

    function loadControls() {
        $('#chartPortfolioContent').attr("class", "");

        initBtnToTop();
        loadSchedulerPortfolioDividend();
        initChartDividendStackedCumulativePortfolioSettingBtnGroup();
        loadDropdownDonutPortfolioAllocationSelectSort();
        loadChartDonutPortfolioAllocation();
        loadChartDonutPortfolioCurrency();
        loadTreeMapPortfolioCurrency();
        loadChartFunnelPortfolioIndustry();
        loadChartRadarPortfolioIndustry();        
        loadSpangridportfoliodividendinfo();
        loadGridPortfolioDividend();
        loadChartDividendStackedCumulativePortfolio();
    }

    return {
        loadSpreadsheetWithProgress: loadSpreadsheetWithProgress,
        saveSpreadsheetDataToTable: saveSpreadsheetDataToTable,
        loadControls: loadControls,
        loadSpreadsheetWithProgress: loadSpreadsheetWithProgress
    }
});