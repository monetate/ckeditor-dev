CKEDITOR.dialog.add('dynamiccontent', function(editor) {
    var optionsList = editor.config.fnData;
    var optionItems = optionsList.map(function(option) {
        return [option[1] + ' - ' + option[2], option[0]];
    });

    // The labels for the param field for a given property.
    var propertyLabels = {
        "subtractcart": "Enter an x value for x - cart value",
        "account_table_lookup": "Enter a property to lookup in the account table",
        "get_nth_closest_store_address": "Enter an n value for nth closest store",
        "customvar": "Enter a custom variable name"
    };

    // The default values for the param field for a given property.
    var propertyDefaults = {
        "subtractcart": 100,
        "account_table_lookup": "property",
        "get_nth_closest_store_address": 1,
        "customvar": "property"
    };

    var isNonEmptyString = function(value) {
        var trimValue = value.trim();
        if (!trimValue) {
            throw new Error("Value must not be empty");
        }
        return true;
    };

    var getBoundedIntegerValidator = function(min, max) {
        return function(value) {
            var intValue = parseInt(value, 10);
            if (window.isNaN(intValue)) {
                throw new Error("Enter a numerical value.");
            }
            if (intValue < min || intValue > max) {
                var rangeMsg = [min, max].join(" and ");
                throw new Error("Value must be between " + rangeMsg);
            }
            return true;
        };
    };

    var isPositiveFloat = function(value) {
        var floatValue = parseFloat(value);
        if (window.isNaN(floatValue)) {
            throw new Error("Enter a numerical value.");
        }
        if (floatValue < 0) {
            throw new Error("Value must be greater than 0.");
        }
        return true;
};

    var propertyValidators = {
        "account_table_lookup": isNonEmptyString,
        "customvar": isNonEmptyString,
        "get_nth_closest_store_address": getBoundedIntegerValidator(1, 9),
        "subtractcart": isPositiveFloat
    };

    var commitField = function(widget) {
        widget.setData(this.id, this.getValue());
        widget.data.token = editor.config.getToken();
    };

    var disableField = function(field) {
        field.disable();
        field.setLabel("");
        field.setValue("");
    };

    var enableField = function(field, property) {
        field.enable();
        field.setLabel(propertyLabels[property]);
        field.setValue(propertyDefaults[property]);
    };

    var handlePropertyChange = function(event) {
        if (event.sender == this) {
            var dialog = this.getDialog();
            var paramField = dialog.getContentElement('dynamiccontent', 'param');
            var property = this.getValue();

            updateParamField(paramField, property);
        }
    };

    var setupField = function(widget) {
        this.setValue(widget.data[this.id]);
    };

    var updateParamField = function(paramField, property) {
        if (property && property in propertyDefaults) {
            enableField(paramField, property);
        } else {
            disableField(paramField);
        }
    };

    var validateParamField = function(api) {
        var dialog = this.getDialog();
        var propertyField = dialog.getContentElement('dynamiccontent', 'property');
        var property = propertyField.getValue();
        var validator = propertyValidators[property];
        if (!validator) {
            return true;
        }

        try {
            return validator(this.getValue());
        } catch (e) {
            return e.message;
        }
    };

    var propertyField = {
        id: 'property',
        type: 'select',
        label: 'Property',
        items: optionItems,
        onChange: handlePropertyChange,
        property: 'city',
        setup: setupField,
        commit: commitField
    };

    var parameterField = {
        id: 'param',
        type: 'text',
        label: 'Parameter',
        param: '',
        setup: setupField,
        commit: commitField,
        validate: validateParamField
    };

    var dialogContents = {
        id: 'dynamiccontent',
        elements: [propertyField, parameterField]
    };

    return {
        title: 'Add dynamic content',
        minWidth: 250,
        minHeight: 100,
        resizable: CKEDITOR.DIALOG_RESIZE_NONE,
        contents: [dialogContents]
    };
});
