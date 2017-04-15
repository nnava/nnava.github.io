define(['./chartdonutexpenses', 
     './chartdividendexpenses', 
     './chartdividendyearmonth', 
     './chartdividendtreemap',
     './chartdividendyeargrowth',
     './chartyeardeposit',
     './chartdonutdividend',
     './dropdowndividendperiod',
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
     dropdownDividendPeriod,
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

    function enableExportReloadButtons() {
        $("#btnExportToPdf").kendoButton().data("kendoButton").enable(true);
        $("#btnExportToPng").kendoButton().data("kendoButton").enable(true);
        $("#btnExportToSvg").kendoButton().data("kendoButton").enable(true);
        $("#btnReloadPortfolio").kendoButton().data("kendoButton").enable(true);
    }

    function loadControlsWithTimeout() {
        loadMultiselectorPortfolio();
        loadDropdownDividendPeriod();
        loadDropdownDonutDividendSort();              
        loadChartDividendStackedCumulative();
        loadChartDividendExpenses();
        loadChartDividendYearGrowth(); 
        loadChartDonutExpenses();
        loadCurrencyData();
       
        kendo.ui.progress($(document.body), false);

        initChartSettingButtonGroups();
        initChartSettingToolbar();
        
        setTimeout(function(){   
            loadSpandividendPeriodInfo();
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
        }, 3200);
    }

    function loadControlsFull() {

        alasql.options.cache = false;
        enableExportReloadButtons();
        $('#mainContainer').attr("class", "container-fluid");

        loadControlsWithTimeout();
    }

    function loadControlsUploadComplete() {
        var isAutoLoadChecked = $('#checkboxAutoLoad').is(":checked");
        if(isAutoLoadChecked) {
            loadControlsFull();
        } else {
            alasql.options.cache = false;
            loadMultiselectorPortfolio();
            $("#btnReloadPortfolio").kendoButton().data("kendoButton").enable(true);
            kendo.ui.progress($(document.body), false);
        }
    }

    function loadSpandividendPeriodInfo() {
        $("#spandividendperiodinfo").kendoTooltip({
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
        var period = dropdownDividendPeriod.getValue();
        if(period == null || period == '')
            period = 0;

        chartDividendStackedCumulative.setChartId('#chartDividendStackedCumulative');
        chartDividendStackedCumulative.setCategoryAxisData(period);
        chartDividendStackedCumulative.setChartData(period);
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

    function loadDropdownDividendPeriod() {
        dropdownDividendPeriod.setDropdownId('#dropdownDividendPeriod');
        dropdownDividendPeriod.setDropdownData();
        dropdownDividendPeriod.loadDropdown();

        $("#dropdownDividendPeriod").data("kendoDropDownList").bind("change", dropDownListDividendYear_Change);
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
        var year = dropdownDividendPeriod.getValue();
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
        var year = dropdownDividendPeriod.getValue();
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
        chartDividendExpenses.setChartData("N");
        chartDividendExpenses.loadChart();
    };

    function initChartSettingButtonGroups() {
        initChartDividendYearMonthSettingBtnGroup();
        initChartDividendStackedCumulativeSettingBtnGroup();
    }

    function initChartSettingToolbar() {
        initToolbarChartDividendExpensesMonth();
    }

    function initChartDividendStackedCumulativeSettingBtnGroup() {
        $("#chartDividendStackedCumulativeSettingBtnGroup").kendoMobileButtonGroup({
            select: function(e) {
                var seriesDefaultType = "column";
                // This is purely ugly but since only using image...
                if(e.index === 1)
                    seriesDefaultType = "bar";
                    
                chartDividendStackedCumulative.updateChartOptions(seriesDefaultType);
            },
            index: 0
        });
    }

    function buttonToolbarChartDividendExpensesMonthNR12(e) {
        chartDividendExpenses.setCategoryAxisData(e.id);
        chartDividendExpenses.setChartData(e.id);
        chartDividendExpenses.loadChart();
    }

    function buttonToolbarChartDividendExpensesMonthLS(e) {
        chartDividendExpenses.updateChartOptions(e.id);
    }

    function initToolbarChartDividendExpensesMonth() {
        var toolbar = $("#toolbarChartDividendExpensesMonth").data("kendoToolBar");
        if(toolbar) return;

        $("#toolbarChartDividendExpensesMonth").kendoToolBar({
            resizable: false,
            items: [
                {
                    type: "buttonGroup",
                    buttons: [
                        { text: "N", id: "N", togglable: true, group: "NR12", toggle: buttonToolbarChartDividendExpensesMonthNR12, enable: true },
                        { text: "R12", id: "R12", togglable: true, group: "NR12", toggle: buttonToolbarChartDividendExpensesMonthNR12 }
                    ]
                },
                { type: "separator" },
                {
                    type: "buttonGroup",
                    buttons: [
                        { icon: "columns", id: "column", text: "", width:"50px", togglable: true, group: "LS", toggle: buttonToolbarChartDividendExpensesMonthLS, enable: true },
                        { icon: "rows", id: "bar", text: "", togglable: true, group: "LS", toggle: buttonToolbarChartDividendExpensesMonthLS }
                    ]
                }
            ],
            theme: "bootstrap"
        });

        var toolbar = $("#toolbarChartDividendExpensesMonth").data("kendoToolBar");
        toolbar.toggle("#column", true);
        toolbar.toggle("#N", true);

        $("#N").kendoTooltip({
            content: "Nuvarande år",
            position: "top"
        });

        $("#R12").kendoTooltip({
            content: "Rullande 12 månader",
            position: "top"
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
        loadControlsFull: loadControlsFull,
        loadControlsUploadComplete: loadControlsUploadComplete,
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