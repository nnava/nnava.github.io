define(['./uploadcontrol', './appcontrolloader'], 
     function(uploadControl, appControlLoader) {

    $(document).ready(function() {

        $(".inputMonthNumberParent").kendoNumericTextBox({
            format: "#,0 kr"
        });

        $(".inputMonthNumber").kendoNumericTextBox({
            format: "#,0 kr",
            change: function() {
                appControlLoader.loadChartDonutExpenses();
                appControlLoader.loadChartDividendExpenses();
            }
        });

        uploadControl.setControlId('#dataFiles');
        uploadControl.load();
                
        alasql.options.cache = false;
        kendo.culture("se-SE");
    });
    
    $(window).on("resize", function() {
        kendo.resize($("#chartYearDeposit"));
        kendo.resize($("#chartDividendYearGrowth"));
        kendo.resize($("#chartDividendYearMonth"));
        kendo.resize($("#chartDividendExpensesMonth"));
        kendo.resize($("#chartDonutDividendTotal"));
        kendo.resize($("#chartDonutDividend"));
        kendo.resize($("#treeMapDividend"));
        kendo.resize($("#chartTransactionBuyLine"));
        kendo.resize($("#chartTransactionSellLine"));
    });

    document.getElementById('checkboxTax').addEventListener('change', function() {
        appControlLoader.loadChartDividendExpenses();
        appControlLoader.loadChartDonutExpenses();
        appControlLoader.loadChartDividendYearMonth();
        appControlLoader.loadChartDividendTreemap();
        appControlLoader.loadChartDonutDividend();
    }, false);

    document.getElementById('btnSetInputMonthValues').addEventListener('click', function() {
        
        var newValue = $("#inputMonthParent").data("kendoNumericTextBox").value();
        
        $("#inputJanuari").data("kendoNumericTextBox").value(newValue);
        $("#inputFebruari").data("kendoNumericTextBox").value(newValue);
        $("#inputMars").data("kendoNumericTextBox").value(newValue);
        $("#inputApril").data("kendoNumericTextBox").value(newValue);
        $("#inputMaj").data("kendoNumericTextBox").value(newValue);
        $("#inputJuni").data("kendoNumericTextBox").value(newValue);
        $("#inputJuli").data("kendoNumericTextBox").value(newValue);
        $("#inputAugusti").data("kendoNumericTextBox").value(newValue);
        $("#inputSeptember").data("kendoNumericTextBox").value(newValue);
        $("#inputOktober").data("kendoNumericTextBox").value(newValue);
        $("#inputNovember").data("kendoNumericTextBox").value(newValue);
        $("#inputDecember").data("kendoNumericTextBox").value(newValue);

        appControlLoader.loadChartDonutExpenses();
        appControlLoader.loadChartDividendExpenses();
        
    });

    document.getElementById('btnExportToPng').addEventListener('click', function() {
        $(".export-chartToImg").each(function(index) {
            $(this).click();
        });

        $(".export-DOMToImg").each(function(index) {
            $(this).click();
        });        
    });

    document.getElementById('btnExportToSvg').addEventListener('click', function() {
        $(".export-chartToSvg").each(function(index) {
            $(this).click();
        });
        
        $(".export-DOMToSvg").each(function(index) {
            $(this).click();
        });
    });

    document.getElementById('btnExportToPdf').addEventListener('click', function() {

        var today = new Date().toISOString().slice(0, 10);

        kendo.drawing.drawDOM($(".content-wrapper"))
        .then(function(group) {
            return kendo.drawing.exportPDF(group, {
                paperSize: "auto",
                margin: { left: "1cm", top: "1cm", right: "1cm", bottom: "1cm" }
            });
        })
        .done(function(data) {
            kendo.saveAs({
                dataURI: data,
                fileName: "Aktierapport_" + today + ".pdf"
            });
        });
    });

    $(".export-chartToSvg").click(function() {
        var chartId = this.id.toString().replace("btn-", "").replace("ToSvg", "");
        var chartFilename = getChartFilename(chartId) + ".svg";

        var chart = $("#" + chartId).getKendoChart();
        chart.exportSVG().done(function(data) {
            kendo.saveAs({
                dataURI: data,
                fileName: chartFilename
            });
        });
    });

    $(".export-DOMToSvg").click(function() {
        var domId = this.id.toString().replace("btn-", "").replace("ToSvg", "");
        var filename = getChartFilename(domId) + ".svg";

        kendo.drawing.drawDOM($("#" + domId))
            .then(function(domObject) {
                return kendo.drawing.exportSVG(domObject);
            })
            .done(function(data) {        
                kendo.saveAs({
                    dataURI: data,
                    fileName: filename
            });
        });
    });

    $(".export-DOMToImg").click(function() {
        var domId = this.id.toString().replace("btn-", "").replace("ToImg", "");
        var filename = getChartFilename(domId) + ".png";

        kendo.drawing.drawDOM($("#" + domId))
            .then(function(domObject) {
                return kendo.drawing.exportImage(domObject);
            })
            .done(function(data) {
                kendo.saveAs({
                    dataURI: data,
                    fileName: filename
            });
        });
    });

    $(".export-chartToImg").click(function() {
        var chartId = this.id.toString().replace("btn-", "").replace("ToImg", "");
        var chartFilename = getChartFilename(chartId) + ".png";

        var chart = $("#" + chartId).getKendoChart();
        chart.exportImage().done(function(data) {
            kendo.saveAs({
                dataURI: data,
                fileName: chartFilename,
            });
        });
    });

    function getChartFilename(chartId) {
        var today = new Date().toISOString().slice(0, 10);
        var chartFilename = "NOTFOUND";

        switch(chartId) {
            case "chartDividendExpensesMonth":
                chartFilename = "utdelningar_kostnader";
                break;
            case "chartDonutDividendTotal":
                chartFilename = "utdelningar_kostnader_total";
                break;
            case "chartDividendYearGrowth":
                chartFilename = "utd_utdtillväxt_år";
                break;
            case "treeMapDividend":
                chartFilename = "treemap_utd_år";
                break;
            case "chartDonutDividend":
                chartFilename = "donut_utd_år";
                break;
            case "chartYearDeposit":
                chartFilename = "insättningar";
                break;
            case "chartTransactionSellLine":
                chartFilename = "transaktioner_sälj";
                break;
            case "chartTransactionBuyLine":
                chartFilename = "transaktioner_köp";
                break;
            default:
                chartFilename = "NOTFOUND";
        }

        return chartFilename + "_" + today;
    }

});