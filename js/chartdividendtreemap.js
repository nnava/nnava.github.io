define(['./alasqlavanza', './alasqlnordnet', './dateperiod'], function(alasqlavanza, alasqlnordnet, dateperiod) {

    var chartData;
    var totalBelopp;
    var chartId;
    var selectedPeriod = 0;

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData(period) {

        selectedPeriod = period;

        var startPeriod = dateperiod.getStartOfYear(selectedPeriod);
        var endPeriod = dateperiod.getEndOfYear(selectedPeriod);

        if(selectedPeriod == "R12") {
            var today = new Date().toISOString();
            startPeriod = dateperiod.getStartOfTrailingPeriod(today, -11);
            endPeriod = dateperiod.getDateEndOfMonth(today);
        }

        var isTaxChecked = $('#checkboxTax').is(":checked");

        var resultNordnetTotal = alasqlnordnet.getTotalDividend(startPeriod, endPeriod, isTaxChecked);
        var resultAvanzaTotal = alasqlavanza.getTotalDividend(startPeriod, endPeriod, isTaxChecked);

        totalBelopp = resultNordnetTotal + resultAvanzaTotal;

        var resultNordnetDividend = alasqlnordnet.getVardepapperTotalDividend(startPeriod, endPeriod, isTaxChecked);
        var resultAvanzaDividend = alasqlavanza.getVardepapperTotalDividend(startPeriod, endPeriod, isTaxChecked);

        var avanzaDividendDataItems = [ { name: 'Avanza totalt: ' + kendo.toString(resultAvanzaTotal, "#,0 kr"), value: resultAvanzaTotal, items: resultAvanzaDividend }]
        var nordnetDividendDataItems = [ { name: 'Nordnet totalt: ' + kendo.toString(resultNordnetTotal, "#,0 kr"), value: resultNordnetTotal, items: resultNordnetDividend }]

        chartData = avanzaDividendDataItems.concat(nordnetDividendDataItems);
    }

    function loadChart() {
        $(chartId).kendoTreeMap({
            dataSource: {
                data: [{
                    name: 'Utdelningar - totalt: ' + kendo.toString(Math.round(totalBelopp), "#,0 kr"),
                    value: totalBelopp,
                    items: chartData
                }]
            },
            valueField: "value",
            textField: "name",
            theme: "bootstrap"
        });

        $(chartId).kendoTooltip({
            filter: ".k-leaf, .k-treemap-title",
            position: "top",
            content: function (e) {
                var treemap = $(chartId).data("kendoTreeMap");
                var item = treemap.dataItem(e.target.closest(".k-treemap-tile"));           
                var text = item.name + ": " + kendo.toString(Math.round(item.value), "#,0 kr");
                if(item.name.indexOf('totalt:') >= 0){
                    text = item.name;
                }
                
                return '<div style="width: ' + text.length * .6 + 'em; max-width: 18em">' + text + '</div>';                                
            }
        });
    }

    return {
        setChartId: setChartId,
        setChartData: setChartData,
        loadChart: loadChart
    };
});