define(['./colors', './alasqlportfoliodata'], function(colors, alasqlportfoliodata) {

    var chartData;
    var chartId;
    var colorArray = colors.getColorArray();

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData() {
        var result = alasqlportfoliodata.getPortfolioIndustry();

        var donutData = [];
        result.forEach(function(entry) {
            if(entry == null) return;
            if(entry.name == null) return;

            donutData.push({ 
                "category": entry.name,
                "value": parseInt(entry.value)
            });
        });

        chartData = donutData;
    }

    function loadChart() {
        $(chartId).kendoChart({
            plotArea: {
                background: ""
            },
            title: {
                text: "Fördelning bransch"
            },
            legend: {
                visible: false
            },
            seriesDefaults: {
                neckRatio: 5,
                labels: {
                    template: "#= category # - #= kendo.format('{0:P}', percentage) #",
                    visible: true,
                    background: "transparent",
                    color: "white"
                },
                dynamicSlope: false,
                dynamicHeight: true
            },
            seriesColors: colorArray,
            series: [{
                type: "funnel",
                data: chartData
            }],
            tooltip: {
                visible: false
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