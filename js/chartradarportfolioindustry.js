define(['./colors', './alasqlportfoliodata'], function(colors, alasqlportfoliodata) {

    var chartData;
    var chartId;
    var colorArray = colors.getColorArray();
    var categoryArray = [];

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData() {
        var result = alasqlportfoliodata.getPortfolioIndustry();

        var data = [];
        categoryArray = [];
        result.forEach(function(entry) {
            if(entry == null) return;
            if(entry.name == null) return;

            categoryArray.push(entry.name);
            data.push(parseInt(entry.value));
        });

        chartData = [];
        chartData.push({
            name: "Fördelning bransch",
            data: data
        })
    }

    function loadChart() {
        $(chartId).kendoChart({
            plotArea: {
                background: ""
            },
            legend: {
                position: "bottom"
            },
            seriesDefaults: {
                type: "radarLine"
            },
            series: chartData,
            categoryAxis: {
                categories: categoryArray
            },
            valueAxis: {
                labels: {
                    format: "#,0 kr"
                }
            },
            tooltip: {
                visible: true,
                format: "#,0 kr"
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