define([], function() {

    var dropdownData = [];
    var dropdownId;

    function setDropdownId(fieldId) {
        dropdownId = fieldId;
    }

    function setDropdownData() {
        dropdownData = [];

        dropdownData.push({ text: "Markn. värde", value: "size" });
        dropdownData.push({ text: "Namn", value: "name" });
    }

    function loadDropdown(indexValue) {
        $(dropdownId).kendoDropDownList({
            autoWidth: true,
            dataTextField: "text",
            dataValueField: "value",
            dataSource: dropdownData,
            index: indexValue,
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