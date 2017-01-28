define(['./alasqlavanza'], function(alasqlavanza) {

    var data = [];
    var multiselectorId;

    function setMultiselectorId(fieldId) {
        multiselectorId = fieldId;
    }

    function setData() {
        if($(multiselectorId).data("kendoMultiSelect")) return;

        var avanzaData = alasqlavanza.getPortfolios();
        
        data = [];
        avanzaData.forEach(function(entry) {
            if (entry.Konto == null) { return; }
            data.push({ text: entry.Konto, value: entry.Konto });
        });
    }

    function loadMultiselector() {

        if($(multiselectorId).data("kendoMultiSelect")) return;
        if(data.length == 0) return;

        $('#portfolioSelector').attr("class", "row top15");
        $(multiselectorId).kendoMultiSelect({
            filter: "startswith",
            dataTextField: "text",
            dataValueField: "value",
            dataSource: data,
            ignoreCase: true,
            autoWidth: true,
            animation: {
                close: {
                    effects: "fadeOut zoom:out",
                    duration: 200
                },
                open: {
                    effects: "fadeIn zoom:in",
                    duration: 500
                }
            },
            theme: "bootstrap"
        });

        $(multiselectorId).getKendoMultiSelect().value(data);
    }

    function saveValues() {
        alasqlavanza.truncatePortfolioData();

        var multiselect = $(multiselectorId).data("kendoMultiSelect");
        if(multiselect) {
            var dataItems = multiselect.dataItems();
            if(dataItems == null) return;
            dataItems.forEach(function(entry) {
                alasqlavanza.insertPortfolioData(entry.value);
            });  
        }
    }

    return {
        setMultiselectorId: setMultiselectorId,
        setData: setData,
        loadMultiselector: loadMultiselector,
        saveValues: saveValues
    };
});