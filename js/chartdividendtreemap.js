define(['./alasql.min', './alasqlavanza', './alasqlnordnet', './monthstaticvalues'], function(alasqlhelper, alasqlavanza, alasqlnordnet, monthstaticvalues) {

    var chartData;
    var totalBelopp;
    var chartId;

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData(avanzaValue, nordnetValue) {

        alasqlnordnet.setSourceData(nordnetValue);
        alasqlavanza.setSourceData(avanzaValue);

        var resultNordnetTotal = alasqlnordnet.getTotalDividend();
        var resultAvanzaTotal = alasqlavanza.getTotalDividend();

        var beloppNordnet = JSON.parse(JSON.stringify(resultNordnetTotal));
        var beloppAvanza = JSON.parse(JSON.stringify(resultAvanzaTotal));

        totalBelopp = parseInt(beloppNordnet["0"].Belopp) + parseInt(beloppAvanza["0"].Belopp);

        var resultNordnetDividend = alasqlnordnet.getVardepapperTotalDividend();
        var resultAvanzaDividend = alasqlavanza.getVardepapperTotalDividend();

        var avanzaDividendDataItems = [ { name: 'Avanza totalt: ' + kendo.toString(parseInt(beloppAvanza["0"].Belopp), "#,0 kr"), value: parseInt(beloppAvanza["0"].Belopp), items: resultAvanzaDividend }]
        var nordnetDividendDataItems = [ { name: 'Nordnet totalt: ' + kendo.toString(parseInt(beloppNordnet["0"].Belopp), "#,0 kr"), value: parseInt(beloppNordnet["0"].Belopp), items: resultNordnetDividend }]

        chartData = avanzaDividendDataItems.concat(nordnetDividendDataItems);
    }

    function loadChart() {
        $(chartId).kendoTreeMap({
            dataSource: {
                data: [{
                    name: 'Utdelningar totalt: ' + kendo.toString(totalBelopp, "#,0 kr"),
                    value: kendo.toString(totalBelopp, "#,0 kr"),
                    items: chartData
                }]
            },
            valueField: "value",
            textField: "name",
            theme: "bootstrap"
        });

        $(chartId).kendoTooltip({
            filter: ".k-leaf,.k-treemap-title",
            position: "top",
            content: function (e) {
                var treemap = $(chartId).data("kendoTreeMap");
                var item = treemap.dataItem(e.target.closest(".k-treemap-tile"));
                return item.name + ": " + kendo.toString(item.value, "#,0 kr");
            }
        });
    }

    return {
        setChartId: setChartId,
        setChartData: setChartData,
        loadChart: loadChart
    };
});