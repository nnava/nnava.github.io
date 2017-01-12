define(['./alasql.min', './alasqlavanza', './alasqlnordnet', './colors'], function(alasqlhelper, alasqlavanza, alasqlnordnet, colors) {

    var chartData;
    var chartId;
    var colorArray = colors.getColorArray();
    var selectedYear = 0;

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData(avanzaValue, nordnetValue, year) {

        alasqlnordnet.setSourceData(nordnetValue);
        alasqlavanza.setSourceData(avanzaValue);

        selectedYear = year;

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
                text: "Värdepapper/utdelning - år " + selectedYear
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

    function resize() {
        var height = ($(window).height() * 0.8);

        $(chartId).css("height", height).data("kendoChart").resize();
    }

    return {
        setChartId: setChartId,
        setChartData: setChartData,
        loadChart: loadChart,
        resize: resize
    };
});