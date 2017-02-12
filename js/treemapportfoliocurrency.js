define(['./alasqlportfoliodata', './colors'], function(alasqlportfoliodata, colors) {

    var chartData;
    var totalBelopp;
    var colorArray = colors.getColorArray();
    var chartId;

    function setChartId(fieldId) {
        chartId = fieldId;
    }

    function setChartData() {
        var resultCurrency = alasqlportfoliodata.getPortfolioCurrency();

        var data = [];
        totalBelopp = 0;
        resultCurrency.forEach(function(object) {
            if (object == null) return; 
            if (object.name == null) return;

            totalBelopp += parseInt(object.value);

            var currencyItems = alasqlportfoliodata.getPortfolioCurrencyStocks(object.name);
            data.push( {
                name: object.name + ' totalt: ' + kendo.toString(parseInt(object.value), "#,0 kr"),
                value: object.value,
                items: currencyItems
            })
        });

        chartData = data;
    }

    function loadChart() {
        $(chartId).kendoTreeMap({
            dataSource: {
                data: [{
                    name: 'Fördelning valuta - totalt: ' + kendo.toString(totalBelopp, "#,0 kr"),
                    value: totalBelopp,
                    items: chartData
                }]
            },
            valueField: "value",
            textField: "name",
            colors: colorArray,
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