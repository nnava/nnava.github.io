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
     './currencydataservice',
     './bankdataportfolio',
     './portfoliodistributioncontrolhandler'], 
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
     currencydataservice,
     bankdataportfolio,
     portfoliodistributioncontrolhandler) {

    function enableExportReloadButtons() {
        $("#btnExportToPdf").kendoButton().data("kendoButton").enable(true);
        $("#btnExportToPng").kendoButton().data("kendoButton").enable(true);
        $("#btnExportToSvg").kendoButton().data("kendoButton").enable(true);
        $("#btnReloadPortfolio").kendoButton().data("kendoButton").enable(true);
    }

    function loadControlsWithTimeout() {
        loadCurrencyData();
        loadMultiselectorPortfolio();
        loadDropdownDividendPeriod();
        loadDropdownDonutDividendSort();              
        loadChartDividendStackedCumulative();
        loadChartDividendExpenses();
        loadChartDividendYearGrowth(); 
        loadChartDonutExpenses();
        loadChartDividendYearMonth();

        kendo.ui.progress($(document.body), false);

        initChartSettingButtonGroups();
        initChartSettingToolbar();
        
        setTimeout(function(){   
            loadSpandividendPeriodInfo();            
            loadChartDividendCumulative();  
            loadChartDonutDividend(); 
        }, 100);

        setTimeout(function(){ 
            bankdataportfolio.setPortfolioLastPriceData();
            loadChartDividendTreemap();
            loadChartTransactionBuyLine();            
        }, 1500);

        setTimeout(function(){    
            loadChartTransactionNetYearGrowth();           
            loadChartTransactionSellLine();            
            loadChartCourtageYear();            
            loadChartYearDeposit();
        }, 2000);
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

        portfoliodistributioncontrolhandler.initPortfolioDistributionBankBtnGroup();
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
        var indexValue = chartDonutDividend.getSort() == "name" ? 1 : 0;

        dropdownDonutDividendSort.setDropdownId('#dropdownDonutDividendSelectSort');
        dropdownDonutDividendSort.setDropdownData();
        dropdownDonutDividendSort.loadDropdown(indexValue);

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
        chartDonutDividend.saveSortLocalStorage(sort);
        chartDonutDividend.setChartData(year);
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
        var selectedPeriod = chartDonutExpenses.getSelectedPeriod();

        chartDonutExpenses.setChartId('#chartDonutDividendTotal');
        chartDonutExpenses.setChartData(selectedPeriod);
        chartDonutExpenses.loadChart();
    };

    function loadChartDividendExpenses() {
        var selectedPeriod = chartDividendExpenses.getSelectedPeriod();

        chartDividendExpenses.setChartId('#chartDividendExpensesMonth');
        chartDividendExpenses.setCategoryAxisData(selectedPeriod);
        chartDividendExpenses.setChartData(selectedPeriod);
        chartDividendExpenses.loadChart();
    };

    function initChartSettingButtonGroups() {
        initChartDividendYearMonthSettingBtnGroup();
        initChartDividendStackedCumulativeSettingBtnGroup();
    }

    function initChartSettingToolbar() {
        initToolbarChartDividendExpensesMonth();
        initToolbarChartDonutDividendTotal();
    }

    function initChartDividendStackedCumulativeSettingBtnGroup() {
        var indexValue = chartDividendStackedCumulative.getSeriesDefaultType() == "column" ? 0 : 1;

        $("#chartDividendStackedCumulativeSettingBtnGroup").kendoMobileButtonGroup({
            select: function(e) {
                var seriesDefaultType = "column";
                // This is purely ugly but since only using image...
                if(e.index === 1)
                    seriesDefaultType = "bar";
                    
                chartDividendStackedCumulative.updateChartOptions(seriesDefaultType);
            },
            index: indexValue
        });
    }

    function buttonToolbarChartDividendExpensesMonthNR12(e) {
        var period = e.id.replace("ChartDividendExpensesMonth-", "");
        chartDividendExpenses.setCategoryAxisData(period);
        chartDividendExpenses.setChartData(period);
        chartDividendExpenses.loadChart();
    }

    function buttonToolbarChartDividendExpensesMonthLS(e) {
        var seriesDefault = e.id.replace("ChartDividendExpensesMonth-", "");
        chartDividendExpenses.updateChartOptions(seriesDefault);
    }

    function buttonToolbarChartDonutDividendTotalNR12(e) {
        chartDonutExpenses.setChartData(e.id.replace("ChartDonutDividendTotal-", ""));
        chartDonutExpenses.loadChart();
    }

    function initToolbarChartDonutDividendTotal() {
        var toolbarId = "#toolbarChartDonutDividendTotal";
        var toolbar = $(toolbarId).data("kendoToolBar");
        if(toolbar) return;

        toolbar = $(toolbarId).kendoToolBar({
            resizable: false,
            items: [
                {
                    type: "buttonGroup",
                    buttons: [
                        { text: "N", id: "ChartDonutDividendTotal-N", togglable: true, group: "NR12", toggle: buttonToolbarChartDonutDividendTotalNR12 },
                        { text: "R12", id: "ChartDonutDividendTotal-R12", togglable: true, group: "NR12", toggle: buttonToolbarChartDonutDividendTotalNR12 }
                    ]
                }
            ],
            theme: "bootstrap"
        }).data("kendoToolBar");

        var selectedPeriod = chartDonutExpenses.getSelectedPeriod();
        toolbar.toggle("#ChartDonutDividendTotal-" + selectedPeriod, true);

        $("#ChartDonutDividendTotal-N").kendoTooltip({
            content: "Nuvarande år",
            position: "top"
        });

        $("#ChartDonutDividendTotal-R12").kendoTooltip({
            content: "Rullande 12 månader",
            position: "top"
        });
    }

    function initToolbarChartDividendExpensesMonth() {
        var toolbarId = "#toolbarChartDividendExpensesMonth";
        var toolbar = $(toolbarId).data("kendoToolBar");
        if(toolbar) return;

        toolbar = $(toolbarId).kendoToolBar({
            resizable: false,
            items: [
                {
                    type: "buttonGroup",
                    buttons: [
                        { text: "N", id: "ChartDividendExpensesMonth-N", togglable: true, group: "NR12", toggle: buttonToolbarChartDividendExpensesMonthNR12 },
                        { text: "R12", id: "ChartDividendExpensesMonth-R12", togglable: true, group: "NR12", toggle: buttonToolbarChartDividendExpensesMonthNR12 }
                    ]
                },
                { type: "separator" },
                {
                    type: "buttonGroup",
                    buttons: [
                        { icon: "columns", id: "ChartDividendExpensesMonth-column", text: "", width:"50px", togglable: true, group: "LS", toggle: buttonToolbarChartDividendExpensesMonthLS },
                        { icon: "rows", id: "ChartDividendExpensesMonth-bar", text: "", togglable: true, group: "LS", toggle: buttonToolbarChartDividendExpensesMonthLS }
                    ]
                }
            ],
            theme: "bootstrap"
        }).data("kendoToolBar");

        var seriesDefaultType = chartDividendExpenses.getSeriesDefaultType();
        toolbar.toggle("#ChartDividendExpensesMonth-" + seriesDefaultType, true);

        var selectedPeriod = chartDividendExpenses.getSelectedPeriod();
        toolbar.toggle("#ChartDividendExpensesMonth-" + selectedPeriod, true);

        $("#ChartDividendExpensesMonth-N").kendoTooltip({
            content: "Nuvarande år",
            position: "top"
        });

        $("#ChartDividendExpensesMonth-R12").kendoTooltip({
            content: "Rullande 12 månader",
            position: "top"
        });
    }

    function initChartDividendYearMonthSettingBtnGroup() {
        var indexValue = chartDividendYearMonth.getSeriesDefaultType() == "column" ? 0 : 1;

        $("#chartDividendYearMonthSettingBtnGroup").kendoMobileButtonGroup({
            select: function(e) {
                var seriesDefaultType = "column";
                // This is purely ugly but since only using image...
                if(e.index === 1)
                    seriesDefaultType = "bar";
                    
                chartDividendYearMonth.updateChartOptions(seriesDefaultType);
            },
            index: indexValue
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