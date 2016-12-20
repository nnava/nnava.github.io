define(['./alasql.min', './alasqlavanza', './alasqlnordnet'], function(alasqlhelper, alasqlavanza, alasqlnordnet) {

    var dropdownData = [];
    var dropdownId;

    function setDropdownId(fieldId) {
        dropdownId = fieldId;
    }

    function setDropdownData(avanzaValue, nordnetValue) {

        alasqlnordnet.setSourceData(nordnetValue);
        alasqlavanza.setSourceData(avanzaValue);

        var nordnetYearData = alasqlnordnet.getDividendYears();
        var avanzaYearData = alasqlavanza.getDividendYears();

        alasql('CREATE TABLE IF NOT EXISTS ArTable \
                (Ar INT);');

        alasql('INSERT INTO ArTable SELECT Ar \
                FROM ?', [nordnetYearData]);

        alasql('INSERT INTO ArTable SELECT Ar \
                FROM ?', [avanzaYearData]);

        var resultYear = alasql('SELECT DISTINCT Ar FROM ArTable');
        alasql('TRUNCATE TABLE ArTable');
        
        dropdownData = [];
        resultYear.forEach(function(entry) {

            if (entry.Ar == null) { return; }

            dropdownData.push({ text: entry.Ar, value: entry.Ar });
        });
    }

    function loadDropdown() {
        var lastIndex = dropdownData.length - 1;

        $(dropdownId).kendoDropDownList({
            autoWidth: true,
            dataTextField: "text",
            dataValueField: "value",
            dataSource: dropdownData,
            index: lastIndex,
            theme: "bootstrap"
        });
    }

    function getValue() {
        return $(dropdownId).val();
    }

    return {
        setDropdownId: setDropdownId,
        setDropdownData: setDropdownData,
        loadDropdown: loadDropdown,
        getValue: getValue
    };
});