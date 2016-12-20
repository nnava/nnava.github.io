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

        $("#btnExportToPdf").kendoButton({
            enable: false
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
        kendo.resize($("#treeMapDividend"));
    });

    document.getElementById('checkboxTax').addEventListener('change', function() {
        appControlLoader.loadChartDividendExpenses();
        appControlLoader.loadChartDonutExpenses();
        appControlLoader.loadChartDividendYearMonth();
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
        
    });

    document.getElementById('btnExportToPdf').addEventListener('click', function() {

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
                fileName: "Aktierapport.pdf"
            });
        });
    });

});