define([], function() {

    var dropdownData = [];
    var dropdownId;

    function setDropdownId(fieldId) {
        dropdownId = fieldId;
    }

    function setDropdownData() {
        var currentYear = new Date().getFullYear();
        var nextYear = new Date().getFullYear() + 1;

        dropdownData.push({ text: currentYear, value: currentYear });
        dropdownData.push({ text: nextYear, value: nextYear });
    }

    function loadDropdown() {
        var lastIndex = dropdownData.length - 2;

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