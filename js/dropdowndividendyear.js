define(['./alasqlavanza', './alasqlnordnet'], function(alasqlavanza, alasqlnordnet) {

    var dropdownData = [];
    var dropdownId;

    function setDropdownId(fieldId) {
        dropdownId = fieldId;
    }

    function setDropdownData() {

        var nordnetYearData = alasqlnordnet.getDividendYears();
        var avanzaYearData = alasqlavanza.getDividendYears();

        alasql('CREATE TABLE IF NOT EXISTS DropdownDivYearTable \
                (Year INT);');

        alasql('INSERT INTO DropdownDivYearTable SELECT Year \
                FROM ?', [nordnetYearData]);

        alasql('INSERT INTO DropdownDivYearTable SELECT Year \
                FROM ?', [avanzaYearData]);

        var resultYear = alasql('SELECT DISTINCT Year FROM DropdownDivYearTable');
        alasql('TRUNCATE TABLE DropdownDivYearTable');
        
        dropdownData = [];
        resultYear.forEach(function(entry) {

            if (entry.Year == null) { return; }

            dropdownData.push({ text: entry.Year, value: entry.Year });
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