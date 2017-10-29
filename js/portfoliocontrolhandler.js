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
        './schedulerportfoliodividend',
        './dropdownportfoliodividendperiod'], 
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
     schedulerPortfolioDividend,
     dropdownPortfolioDividendPeriod) {

    function loadSpreadsheetWithProgress() {
        kendo.ui.progress($(document.body), true);

        alasqlStockDividendData.createStockDividendDataTable();
        alasqlStockDividendData.loadDataFromFileToTable();
        
        setTimeout(function(){   
            loadSpreadsheetStocks();
            kendo.ui.progress($(document.body), false);
        }, 10);
    }

    function loadDropdownPortfolioDividendPeriod() {
        dropdownPortfolioDividendPeriod.setDropdownId('#dropdownPortfolioDividendPeriod');
        dropdownPortfolioDividendPeriod.setDropdownData();
        dropdownPortfolioDividendPeriod.loadDropdown();

        $("#dropdownPortfolioDividendPeriod").data("kendoDropDownList").bind("change", dropDownListPortfolioDividendPeriod_Change);
    }

    function dropDownListPortfolioDividendPeriod_Change(e) {
        kendo.ui.progress($(".chart-portfolio-loading"), true);

        setTimeout(function(){ 
            loadChartDividendStackedCumulativePortfolio();
            kendo.ui.progress($(".chart-portfolio-loading"), false);
            loadGridPortfolioDividend();
            loadSchedulerPortfolioDividend();
        });
    }

    function loadDropdownDonutPortfolioAllocationSelectSort() {
        var indexValue = chartDonutPortfolioAllocation.getSort() == "name" ? 1 : 0;

        dropdownDonutPortfolioAllocation.setDropdownId('#dropdownDonutPortfolioAllocationSelectSort');
        dropdownDonutPortfolioAllocation.setDropdownData();
        dropdownDonutPortfolioAllocation.loadDropdown(indexValue);

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
        chartDonutPortfolioAllocation.saveSortLocalStorage(sort);
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
        var year = dropdownPortfolioDividendPeriod.getValue();

        gridPortfolioDividend.setId("#gridPortfolioDividend");
        gridPortfolioDividend.setData(year);
        gridPortfolioDividend.load();
    }

    function loadChartDividendStackedCumulativePortfolio() {     
        var year = dropdownPortfolioDividendPeriod.getValue();

        chartDividendStackedCumulativePortfolio.setChartId('#chartDividendStackedCumulativePortfolio');
        chartDividendStackedCumulativePortfolio.setChartData(year);
        chartDividendStackedCumulativePortfolio.loadChart();
    }

    function loadSchedulerPortfolioDividend() {
        var year = dropdownPortfolioDividendPeriod.getValue();

        schedulerPortfolioDividend.setId("#schedulerPortfolioDividend");
        schedulerPortfolioDividend.setData(year);
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
        var indexValue = chartDividendStackedCumulativePortfolio.getSeriesDefaultType() == "column" ? 0 : 1;

        $("#chartDividendStackedCumulativePortfolioSettingBtnGroup").kendoMobileButtonGroup({
            select: function(e) {
                var seriesDefaultType = "column";
                // This is purely ugly but since only using image...
                if(e.index === 1)
                    seriesDefaultType = "bar";
                    
                chartDividendStackedCumulativePortfolio.updateChartOptions(seriesDefaultType);
            },
            index: indexValue
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
        $('#chartPortfolioContent').attr("class", "contentportfolio-wrapper");

        loadDropdownPortfolioDividendPeriod();
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
        enableExportButtons();
    }

    function enableExportButtons() {
        $("#btnExportPortfolioToPdf").kendoButton().data("kendoButton").enable(true);
        $("#btnExportPortfolioToPng").kendoButton().data("kendoButton").enable(true);
        $("#btnExportPortfolioToSvg").kendoButton().data("kendoButton").enable(true);
    }

    return {
        loadSpreadsheetWithProgress: loadSpreadsheetWithProgress,
        saveSpreadsheetDataToTable: saveSpreadsheetDataToTable,
        loadControls: loadControls,
        loadSpreadsheetWithProgress: loadSpreadsheetWithProgress
    }
});