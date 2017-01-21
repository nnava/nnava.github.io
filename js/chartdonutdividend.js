define(['./colors', './bankdatadividend', './dropdowndonutdividendsort'], function(colors, bankdatadividend, dropdowndonutdividendsort) {

    var chartData;
    var chartId;
    var colorArray = colors.getColorArray();
    var selectedYear = 0;

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData(year, sort) {

        selectedYear = year;

        var isTaxChecked = $('#checkboxTax').is(":checked");

        var result = bankdatadividend.getVärdepapperTotalDividend(year, sort, isTaxChecked);

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

    return {
        setChartId: setChartId,
        setChartData: setChartData,
        loadChart: loadChart
    };
});