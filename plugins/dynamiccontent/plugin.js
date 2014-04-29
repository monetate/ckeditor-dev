CKEDITOR.plugins.add('dynamiccontent', {
    requires: 'widget',

    icons: 'dynamiccontent',

    init: function(editor) {

        CKEDITOR.dialog.add('dynamiccontent', this.path + 'dialogs/dynamiccontent.js');

        var parentCls = 'dynamic-text-placeholder';
        var templates = editor.config.templates;

        var dynamicProperties = {
            "subtractcart": true,
            "accounttable": true,
            "get_nth_closest_store_address": true,
            "customvar": true,
            "days_until": true
        };

        var getOuterHtml = function() {
            return templates.placeholder({});
        };

        var getInnerHtml = function(data) {
            return templates.token(data) + templates.icon(data);
        };

        var getInnerToken = function(token) {
            if (!token) return null;
            var innerMatcher = /\{\{([^\}]*)\}\}/;
            return innerMatcher.exec(token)[1];
        };

        var upcast = function(element) {
            return element.name == 'span' && element.hasClass(parentCls);
        };

        var init = function() {
            var tokenEl = this.element.getFirst(function(el) { return el.type == 1; });
            var property = tokenEl.data('property');
            var param = tokenEl.data('param-param');
            var token = getInnerToken(tokenEl.getText());
            this.setData({ property: property, param: param, token: token });
        };

        var data = function() {
            this.element.setHtml(getInnerHtml(this.data));
        };

        editor.widgets.add('dynamiccontent', {
            allowedContent: 'span(!' + parentCls + '); span(!dynamic-text-token)[*]; span(!dynamic-text-icon)',
            button: 'Add dynamic content',
            data: data,
            dialog: 'dynamiccontent',
            init: init,
            requiredContent: 'span(' + parentCls + ')',
            template: getOuterHtml(),
            upcast: upcast
        });
    }
});
