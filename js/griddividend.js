define([], function() {

    var gridData = [];
    var gridId;

    function setId(fieldId) {
        gridId = fieldId;
    }

    function setData() {
        kendo.ui.progress($(gridId), true);

        var data = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "stockdividenddata_ext.json",
                    dataType: "json"
                }
            },
            schema: {
                model: {
                    fields: {
                        I: { type: "string" },
                        N: { type: "string" },
                        C: { type: "string" },
                        T: { type: "string" },
                        U1: { type: "number" },
                        U2: { type: "date"},
                        U4: {type: "number" }
                    }
                }
            },
            sort: ({ field: "N", dir: "asc" }),
            pageSize: 20
        });

        gridData = data;
    }

    function load() {
        var today = new Date().toISOString().slice(0, 10);

        var grid = $(gridId).kendoGrid({
            sortable: true,
            reorderable: true,
            groupable: true,
            dataBound: onDataBound,
            filterable: {
                mode: "row"
            },
            toolbar: ["excel", "pdf"],
            excel: {
                fileName: "utdelningsdata.xlsx",
                filterable: true,
                allPages: true
            },
            pdf: {
                fileName: "utdelningsdata.pdf",
                allPages: true,
                avoidLinks: true,
                paperSize: "A4",
                margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                landscape: true,
                repeatHeaders: true,
                scale: 0.8
            },
            columns: [
                { field: "I", title: "ISIN", width: "55px" },
                { field: "N", title: "Värdepapper", width: "80px", 
                    filterable: {
                        cell: {
                            operator: "contains",
                            template: function (args) {
                            args.element.css("width", "100%").addClass("k-textbox").keydown(function(e){
                                setTimeout(function(){
                                $(e.target).trigger("change");
                                });
                            });                   
                            },
                            showOperators: false
                        }
                    } 
                },
                { field: "T", title: "Typ", width: "55px" },
                { field: "U2", title: "Datum", width: "60px", format: "{0:yyyy-MM-dd}" },
                { field: "U1", title: "Belopp", width: "50px" },
                { field: "C", title: "Valuta", width: "45px" }, 
                { field: "U4", title: "Utdelningstillväxt jmf fg utd", width: "50px", format: "{0} %" }                
            ],
            dataSource: gridData,
            pageable: {
                numeric: true,
                previousNext: true,
                pageSizes: [5, 10, 20, 100]
            },
            excelExport: function(e) {
                var sheet = e.workbook.sheets[0];
                for (var i = 0; i < sheet.columns.length; i++) {
                    sheet.columns[i].width = getExcelColumnWidth(i);
                }
            },
            theme: "bootstrap"}
        );
    }

    function onDataBound(arg) {
        kendo.ui.progress($(gridId), false);
    }

    function getExcelColumnWidth(index) {
        var columnWidth = 150;
        switch(index) {
            case 0: // ISIN
                columnWidth = 100;
                break;
            case 1: // Värdepapper
                columnWidth = 200;
                break;   
            case 2: // Typ
                columnWidth = 80;
                break;     
            case 3: // Datum
                columnWidth = 80;
                break;     
            case 4: // Belopp
                columnWidth = 90;
                break;  
            case 5: // Valuta
                columnWidth = 60;
                break;  
            case 6: // Utdelningstillväxt
                columnWidth = 120;
                break;                             
            default:
                columnWidth = 150;
        }
        return columnWidth;
    }

    return {
        setId: setId,
        setData: setData,
        load: load
    };
});