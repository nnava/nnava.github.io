define([], function() {

    var dropdownData = [];
    var dropdownId;

    function setDropdownId(fieldId) {
        dropdownId = fieldId;
    }

    function setDropdownData() {
        dropdownData = [];

        dropdownData.push({ text: "Storlek", value: "size" });
        dropdownData.push({ text: "Namn", value: "name" });
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