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
     './multiselectorportfolio',
     './alasqlcurrencydata',
     './currencydataservice'], 
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
     multiselectorPortfolio,
     alasqlcurrencydata,
     currencydataservice) {

    function loadControls() {

        alasql.options.cache = false;

        $("#btnExportToPdf").kendoButton().data("kendoButton").enable(true);
        $("#btnExportToPng").kendoButton().data("kendoButton").enable(true);
        $("#btnExportToSvg").kendoButton().data("kendoButton").enable(true);
        $("#btnReloadPortfolio").kendoButton().data("kendoButton").enable(true);

        $('#mainContainer').attr("class", "container-fluid");

        loadMultiselectorPortfolio();
        loadDropdownDividendYear();
        loadDropdownDonutDividendSort();              
        loadChartDividendStackedCumulative();
        loadChartDividendExpenses();
        loadChartDividendYearGrowth(); 
        loadChartDonutExpenses();
        loadCurrencyData();
       
        kendo.ui.progress($(document.body), false);

        initChartSettingButtonGroups();
        
        setTimeout(function(){   
            loadSpandividendyearinfo();
            loadChartDividendYearMonth();
            loadChartDividendCumulative();  
            loadChartDonutDividend(); 
        }, 100);

        setTimeout(function(){ 
            loadChartDividendTreemap();
            loadChartTransactionBuyLine();
        }, 1500);

        setTimeout(function(){    
            loadChartTransactionNetYearGrowth();           
            loadChartTransactionSellLine();            
        }, 2200);

        setTimeout(function(){                           
            loadChartCourtageYear();            
            loadChartYearDeposit();
            $("#btnLoadSpreadsheetPortfolio").kendoButton().data("kendoButton").enable(true);
        }, 3200);
    }

    function loadSpandividendyearinfo() {
        $("#spandividendyearinfo").kendoTooltip({
            content: "<div style=\"text-align:left\">Påverkar graferna: <br/> \
                      <ul>\
                           <li>Utdelning per månad/värdepapper - år</li> \
                           <li>Treemap utdelningar - år</li> \
                           <li>Donut utdelningar - år</li> \
                      </ul></div>",
            position: "bottom",
            width: 300
        });
    }

    function saveSettings() {
        multiselectorPortfolio.saveValues();
    }

    function loadCurrencyData() {
        alasqlcurrencydata.createCurrencyDataTable();
        currencydataservice.fillCurrencyDataFromYahooFinance();
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

    function initChartSettingButtonGroups() {
        initChartDividendExpensesMonthSettingBtnGroup();
        initChartDividendYearMonthSettingBtnGroup();
    }

    function initChartDividendExpensesMonthSettingBtnGroup() {
        $("#chartDividendExpensesMonthSettingBtnGroup").kendoMobileButtonGroup({
            select: function(e) {
                var seriesDefaultType = "column";
                // This is purely ugly but since only using image...
                if(e.index === 1)
                    seriesDefaultType = "bar";
                    
                chartDividendExpenses.updateChartOptions(seriesDefaultType);
            },
            index: 0
        });
    }

    function initChartDividendYearMonthSettingBtnGroup() {
        $("#chartDividendYearMonthSettingBtnGroup").kendoMobileButtonGroup({
            select: function(e) {
                var seriesDefaultType = "column";
                // This is purely ugly but since only using image...
                if(e.index === 1)
                    seriesDefaultType = "bar";
                    
                chartDividendYearMonth.updateChartOptions(seriesDefaultType);
            },
            index: 0
        });
    }

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