define(['./alasqlavanza', './alasqlnordnet', './monthstaticvalues'], function(alasqlavanza, alasqlnordnet, monthstaticvalues) {

    var chartData;
    var totalBelopp;
    var chartId;
    var selectedYear = 0;

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData(year) {

        selectedYear = year;

        var isTaxChecked = $('#checkboxTax').is(":checked");

        var resultNordnetTotal = alasqlnordnet.getTotalDividend(year, isTaxChecked);
        var resultAvanzaTotal = alasqlavanza.getTotalDividend(year, isTaxChecked);

        totalBelopp = resultNordnetTotal + resultAvanzaTotal;

        var resultNordnetDividend = alasqlnordnet.getVardepapperTotalDividend(year, isTaxChecked);
        var resultAvanzaDividend = alasqlavanza.getVardepapperTotalDividend(year, isTaxChecked);

        var avanzaDividendDataItems = [ { name: 'Avanza totalt: ' + kendo.toString(resultAvanzaTotal, "#,0 kr"), value: resultAvanzaTotal, items: resultAvanzaDividend }]
        var nordnetDividendDataItems = [ { name: 'Nordnet totalt: ' + kendo.toString(resultNordnetTotal, "#,0 kr"), value: resultNordnetTotal, items: resultNordnetDividend }]

        chartData = avanzaDividendDataItems.concat(nordnetDividendDataItems);
    }

    function loadChart() {
        $(chartId).kendoTreeMap({
            dataSource: {
                data: [{
                    name: 'Utdelningar år ' + selectedYear + ' - totalt: ' + kendo.toString(Math.round(totalBelopp), "#,0 kr"),
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