define(['./chartdonutexpenses', 
     './chartdividendexpenses', 
     './chartdividendyearmonth', 
     './chartdividendtreemap',
     './chartdividendyeargrowth',
     './chartyeardeposit',
     './chartdonutdividend',
     './dropdowndividendyear',
     './charttransactionbuyline',
     './charttransactionsellline',
     './chartdividendcumulative',
     './chartdividendstackedcumulative',
     './chartcourtageyear',
     './dropdowndonutdividendsort',
     './charttransactionnetyeargrowth',
     './multiselectorportfolio'], 
     function(chartDonutExpenses, 
     chartDividendExpenses, 
     chartDividendYearMonth, 
     chartDividendTreemap,
     chartDividendYearGrowth,
     chartYearDeposit,
     chartDonutDividend,
     dropdownDividendYear,
     chartTransactionBuyLine,
     chartTransactionSellLine,
     chartDividendCumulative,
     chartDividendStackedCumulative,
     chartCourtageYear,
     dropdownDonutDividendSort,
     chartTransactionNetYearGrowth,
     multiselectorPortfolio) {

    function loadControls() {

        $("#btnExportToPdf").kendoButton().data("kendoButton").enable(true);
        $("#btnExportToPng").kendoButton().data("kendoButton").enable(true);
        $("#btnExportToSvg").kendoButton().data("kendoButton").enable(true);
        $("#btnReloadPortfolio").kendoButton().data("kendoButton").enable(true);

        $('#mainContainer').attr("class", "container-fluid");

        loadMultiselectorPortfolio();
        loadDropdownDividendYear();
        loadDropdownDonutDividendSort();              
        loadChartDividendStackedCumulative();
          
        kendo.ui.progress($(document.body), false);

        loadChartDividendExpenses();

        setTimeout(function(){  
            loadChartDividendYearGrowth(); 
            loadChartDonutExpenses();
        }, 100);

        setTimeout(function(){   
            loadChartDividendYearMonth();
            loadChartDividendCumulative();  
            loadChartDonutDividend(); 
        }, 500);

        setTimeout(function(){ 
            loadChartDividendTreemap();
            loadChartTransactionBuyLine();
        }, 2000);

        setTimeout(function(){    
            loadChartTransactionNetYearGrowth();           
            loadChartTransactionSellLine();            
        }, 3000);

        setTimeout(function(){                           
            loadChartCourtageYear();            
            loadChartYearDeposit();
            $("#btnLoadSpreadsheetPortfolio").kendoButton().data("kendoButton").enable(true);
        }, 4000);
    }

    function saveSettings() {
        multiselectorPortfolio.saveValues();
    }

    function loadChartDividendStackedCumulative() {
        var year = dropdownDividendYear.getValue();
        if(year == null || year == '')
            year = 0;

        chartDividendStackedCumulative.setChartId('#chartDividendStackedCumulative');
        chartDividendStackedCumulative.setChartData(year);
        chartDividendStackedCumulative.loadChart();
    }
    
    function loadMultiselectorPortfolio() {
        multiselectorPortfolio.setMultiselectorId('#portfolioMultiSelect');
        multiselectorPortfolio.setData();
        multiselectorPortfolio.loadMultiselector();
    }

    function loadChartTransactionNetYearGrowth() {
        chartTransactionNetYearGrowth.setChartId('#chartTransactionNetYearGrowth');
        chartTransactionNetYearGrowth.setChartData();
        chartTransactionNetYearGrowth.loadChart();
    }

    function loadChartCourtageYear() {
        chartCourtageYear.setChartId('#chartCourtageYear');
        chartCourtageYear.setChartData();
        chartCourtageYear.loadChart();
    }

    function loadChartDividendCumulative() {
        chartDividendCumulative.setChartId('#chartDividendCumulative');
        chartDividendCumulative.setChartData();
        chartDividendCumulative.loadChart();
    }

    function loadChartTransactionSellLine() {
        chartTransactionSellLine.setChartId('#chartTransactionSellLine');
        chartTransactionSellLine.setChartData();
        chartTransactionSellLine.loadChart();
    }

    function loadChartTransactionBuyLine() {
        chartTransactionBuyLine.setChartId('#chartTransactionBuyLine');
        chartTransactionBuyLine.setChartData();
        chartTransactionBuyLine.loadChart();
    }

    function loadDropdownDividendYear() {
        dropdownDividendYear.setDropdownId('#dropdownDividendYear');
        dropdownDividendYear.setDropdownData();
        dropdownDividendYear.loadDropdown();

        $("#dropdownDividendYear").data("kendoDropDownList").bind("change", dropDownListDividendYear_Change);
    }

    function dropDownListDividendYear_Change(e) {
        kendo.ui.progress($(".chart-loading"), true);

        setTimeout(function(){ 
            loadChartDividendTreemap();
            loadChartDonutDividend();
            loadChartDividendStackedCumulative();
        });
    }

    function loadDropdownDonutDividendSort() {
        dropdownDonutDividendSort.setDropdownId('#dropdownDonutDividendSelectSort');
        dropdownDonutDividendSort.setDropdownData();
        dropdownDonutDividendSort.loadDropdown();

        $("#dropdownDonutDividendSelectSort").data("kendoDropDownList").bind("change", dropDownListDonutDividendSort_Change);
    }

    function dropDownListDonutDividendSort_Change(e) {
        loadChartDonutDividend();
    }

    function loadChartYearDeposit() {
        chartYearDeposit.setChartId('#chartYearDeposit');
        chartYearDeposit.setChartData();
        chartYearDeposit.loadChart();
    }

    function loadChartDividendYearGrowth() {
        chartDividendYearGrowth.setChartId('#chartDividendYearGrowth');
        chartDividendYearGrowth.setChartData();
        chartDividendYearGrowth.loadChart();
    }

    function loadChartDonutDividend() {
        var year = dropdownDividendYear.getValue();
        if(year == null || year == '')
            year = 0;

        var sort = dropdownDonutDividendSort.getValue();
        if(sort == null || sort == '')
            sort = "name";

        chartDonutDividend.setChartId('#chartDonutDividend');
        chartDonutDividend.setChartData(year, sort);
        chartDonutDividend.loadChart();
    }

    function loadChartDividendTreemap() {
        var year = dropdownDividendYear.getValue();
        if(year == null || year == '')
            year = 0;

        chartDividendTreemap.setChartId('#treeMapDividend');
        chartDividendTreemap.setChartData(year);
        chartDividendTreemap.loadChart();
    };

    function loadChartDividendYearMonth() {
        chartDividendYearMonth.setChartId('#chartDividendYearMonth');
        chartDividendYearMonth.setChartData();
        chartDividendYearMonth.loadChart();
    };

    function loadChartDonutExpenses() {
        chartDonutExpenses.setChartId('#chartDonutDividendTotal');
        chartDonutExpenses.setChartData();
        chartDonutExpenses.loadChart();
    };

    function loadChartDividendExpenses() {
        chartDividendExpenses.setChartId('#chartDividendExpensesMonth');
        chartDividendExpenses.setChartData();
        chartDividendExpenses.loadChart();
    };

    return {
        loadControls: loadControls,
        loadChartDividendExpenses: loadChartDividendExpenses,
        loadChartDonutExpenses: loadChartDonutExpenses,
        loadChartDividendYearMonth: loadChartDividendYearMonth,
        loadChartDividendTreemap: loadChartDividendTreemap,
        loadChartDonutDividend: loadChartDonutDividend,
        loadChartDividendCumulative: loadChartDividendCumulative,
        loadChartDividendStackedCumulative: loadChartDividendStackedCumulative,
        saveSettings: saveSettings
    }
});