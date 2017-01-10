define(['./alasql.min', './alasqlavanza', './alasqlnordnet', './colors'], function(alasqlhelper, alasqlavanza, alasqlnordnet, colors) {

    var chartData;
    var chartId;
    var colorArray = colors.getColorArray();

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData(avanzaValue, nordnetValue, year) {

        alasqlnordnet.setSourceData(nordnetValue);
        alasqlavanza.setSourceData(avanzaValue);

        var isTaxChecked = $('#checkboxTax').is(":checked");

        var resultNordnetDividend = alasqlnordnet.getVardepapperTotalDividend(year, isTaxChecked);
        var resultAvanzaDividend = alasqlavanza.getVardepapperTotalDividend(year, isTaxChecked);

        var donutData = [];
        resultNordnetDividend.forEach(function(entry) {
            if(entry == null) return;
            if(entry.name == null) return;

            donutData.push({ 
                "category": entry.name,
                "value": entry.value
            });
        });

        resultAvanzaDividend.forEach(function(entry) {
            if(entry == null) return;
            if(entry.name == null) return;

            donutData.push({ 
                "category": entry.name,
                "value": entry.value
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
                text: "Värdepapper/utdelning"
            },
            legend: {
                position: "top"
            },
            chartArea: {
                background: ""
            },
            seriesDefaults: {
                type: "donut",
                startAngle: 150,
                holeSize: 70,
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