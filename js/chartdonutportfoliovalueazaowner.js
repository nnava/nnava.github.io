define(['./colors', './alasqlportfoliodata'], function(colors, alasqlportfoliodata) {

    var chartData;
    var chartId;
    var colorArray = colors.getColorArray();

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData() {
        var result = alasqlportfoliodata.getPortfolioValueAZAOwnerCount();
        var groupedData = alasql('SELECT category, SUM([value]::NUMBER) AS [value] FROM ? GROUP BY category', [result]);
        var donutData = [];
        groupedData.forEach(function(entry) {
            if(entry == null) return;
            if(entry.category == null) return;

            donutData.push({ 
                "category": entry.category,
                "sortOrder": getAZAOwnerSortOrder(entry.category),
                "value": parseInt(entry.value)
            });
        });

        var groupedSortedData = alasql('SELECT category, [value] FROM ? ORDER BY sortOrder', [donutData]);

        chartData = groupedSortedData;
    }

    function getAZAOwnerSortOrder(category) {
        if(category == "N/A")
            return 6;
        else if(category == "> 10 000")
            return 5;
        else if(category == "1 000 - 10 000")
            return 4;
        else if(category == "100 - 1 000")
            return 3;
        else if(category == "10 - 100")
            return 2;
        else
            return 1;
    }

    function loadChart() {
        $(chartId).kendoChart({
            plotArea: {
                background: ""
            },
            title: {
                text: "Antal ägare Avanza/Marknadsvärde"
            },
            legend: {
                position: "top"
            },
            chartArea: {
                background: ""
            },
            seriesDefaults: {
                type: "donut"
            },
            series: [{
                name: "Data",
                data: chartData,
                labels: {
                    visible: true,
                    background: "transparent",
                    position: "outsideEnd",
                    template: "#= category # - #= kendo.format('{0:P}', percentage) #"
                }
            }],
            seriesColors: colorArray,
            tooltip: {
                visible: true,
                template: "#= category # - #= kendo.format('{0:P}', percentage) # (#= kendo.toString(value, 'n0') # kr)"
            },
            theme: "bootstrap"
        });
    }

    return {
        setChartId: setChartId,
        setChartData: setChartData,
        loadChart: loadChart
    };
});