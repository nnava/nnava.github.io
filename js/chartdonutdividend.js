define(['./colors', './bankdatadividend'], function(colors, bankdatadividend) {

    var chartData;
    var chartId;
    var colorArray = colors.getColorArray();
    var selectedYear = 0;

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData(avanzaValue, nordnetValue, year) {

        selectedYear = year;

        var isTaxChecked = $('#checkboxTax').is(":checked");

        bankdatadividend.setData(avanzaValue, nordnetValue);
        var result = bankdatadividend.getVärdepapperTotalDividend(year, isTaxChecked);

        var donutData = [];
        result.forEach(function(entry) {
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
        if(chartId == null) return;

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