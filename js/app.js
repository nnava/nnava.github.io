define(['./chartdonutexpenses', 
     './chartdividendexpenses', 
     './chartdividendyearmonth', 
     './chartdividendtreemap',
     './chartdividendyeargrowth'], 
     function(chartDonutExpenses, 
     chartDividendExpenses, 
     chartDividendYearMonth, 
     chartDividendTreemap,
     chartDividendYearGrowth) {

    $(document).ready(function() {

        alasql.options.cache = false;
        kendo.culture("se-SE");


    });
    
    $(window).on("resize", function() {
        kendo.resize($("#chartDividendYearGrowth"));
        kendo.resize($("#chartDividendYearMonth"));
        kendo.resize($("#chartDividendExpensesMonth"));
        kendo.resize($("#chartDonutDividendTotal"));
        kendo.resize($("#treeMapDividend"));
    });

    document.getElementById('btnLoadDividendGraph').addEventListener('click', function() {

        loadChartDividendYearGrowth();
        loadChartDividendTreemap();
        loadChartDividendYearMonth();
        loadChartDividendExpenses();
        loadChartDonutExpenses();
    });

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
});