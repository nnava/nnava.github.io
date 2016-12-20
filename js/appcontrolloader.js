define(['./chartdonutexpenses', 
     './chartdividendexpenses', 
     './chartdividendyearmonth', 
     './chartdividendtreemap',
     './chartdividendyeargrowth',
     './chartyeardeposit',
     './dropdowndividendyear'], 
     function(chartDonutExpenses, 
     chartDividendExpenses, 
     chartDividendYearMonth, 
     chartDividendTreemap,
     chartDividendYearGrowth,
     chartYearDeposit,
     dropdownDividendYear) {

    function loadControls() {
        loadDropdownDividendYear();
        loadChartYearDeposit();
        loadChartDividendYearGrowth();
        loadChartDividendTreemap();
        loadChartDividendYearMonth();
        loadChartDividendExpenses();
        loadChartDonutExpenses();
    }

    function loadDropdownDividendYear() {
        dropdownDividendYear.setDropdownId('#dropdownDividendYear');
        dropdownDividendYear.setDropdownData($('#avanzaData').val(), $('#nordnetData').val());
        dropdownDividendYear.loadDropdown();
        $('#divDividendYear').attr("class", "row-fluid");

        $("#dropdownDividendYear").data("kendoDropDownList").bind("change", dropDownListDividendYear_Change);
    }

    function dropDownListDividendYear_Change(e) {
        loadChartDividendTreemap();
    }

    function loadChartYearDeposit() {
        chartYearDeposit.setChartId('#chartYearDeposit');
        chartYearDeposit.setChartData($('#avanzaData').val(), $('#nordnetData').val());
        chartYearDeposit.loadChart();
    }

    function loadChartDividendYearGrowth() {
        chartDividendYearGrowth.setChartId('#chartDividendYearGrowth');
        chartDividendYearGrowth.setChartData($('#avanzaData').val(), $('#nordnetData').val());
        chartDividendYearGrowth.loadChart();
    }

    function loadChartDividendTreemap() {
        chartDividendTreemap.setChartId('#treeMapDividend');
        chartDividendTreemap.setChartData($('#avanzaData').val(), $('#nordnetData').val(), dropdownDividendYear.getValue());
        chartDividendTreemap.loadChart();
    };

    function loadChartDividendYearMonth() {
        chartDividendYearMonth.setChartId('#chartDividendYearMonth');
        chartDividendYearMonth.setChartData($('#avanzaData').val(), $('#nordnetData').val());
        chartDividendYearMonth.loadChart();
    };

    function loadChartDonutExpenses() {
        chartDonutExpenses.setChartId('#chartDonutDividendTotal');
        chartDonutExpenses.setChartData($('#avanzaData').val(), $('#nordnetData').val());
        chartDonutExpenses.loadChart();
    };

    function loadChartDividendExpenses() {
        chartDividendExpenses.setChartId('#chartDividendExpensesMonth');
        chartDividendExpenses.setChartData($('#avanzaData').val(), $('#nordnetData').val());
        chartDividendExpenses.loadChart();
    };

    return {
        loadControls: loadControls,
        loadChartDividendExpenses: loadChartDividendExpenses,
        loadChartDonutExpenses: loadChartDonutExpenses,
        loadChartDividendYearMonth: loadChartDividendYearMonth
    }
});