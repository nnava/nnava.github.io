define(['./chartdonutexpenses', 
     './chartdividendexpenses', 
     './chartdividendyearmonth', 
     './chartdividendtreemap',
     './chartdividendyeargrowth',
     './chartyeardeposit'], 
     function(chartDonutExpenses, 
     chartDividendExpenses, 
     chartDividendYearMonth, 
     chartDividendTreemap,
     chartDividendYearGrowth,
     chartYearDeposit) {

    function loadControls() {
        loadChartYearDeposit();
        loadChartDividendYearGrowth();
        loadChartDividendTreemap();
        loadChartDividendYearMonth();
        loadChartDividendExpenses();
        loadChartDonutExpenses();
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
        chartDividendTreemap.setChartData($('#avanzaData').val(), $('#nordnetData').val());
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
        loadControls: loadControls
    }
});