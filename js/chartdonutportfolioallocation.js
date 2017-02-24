define(['./colors', './alasqlportfoliodata'], function(colors, alasqlportfoliodata) {

    var chartData;
    var chartId;
    var colorArray = colors.getColorArray();

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData() {
        var result = alasqlportfoliodata.getPortfolioAllocation();

        var donutData = [];
        result.forEach(function(entry) {
            if(entry == null) return;
            if(entry.name == null) return;

            donutData.push({ 
                "category": entry.name,
                "value": parseInt(entry.value),
                "antal": entry.Antal,
                "senastepris": entry.SenastePris
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
                text: "Fördelning innehav"
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
                template: "#= window.returnPortfolioAllocationTooltipText(category, kendo.format('{0:P}', percentage), value, dataItem) #"
            },
            theme: "bootstrap"
        });
    }

    window.returnPortfolioAllocationTooltipText = function returnPortfolioAllocationTooltipText(category, percentage, value, dataItem) {
        return category + " - " + percentage + " (" + kendo.toString(value, 'n0') + ') kr' + "</br>" + "Antal: " + kendo.toString(dataItem.antal, 'n0') + " st á senaste pris: " + dataItem.senastepris + " kr";
    }

    return {
        setChartId: setChartId,
        setChartData: setChartData,
        loadChart: loadChart
    };
});