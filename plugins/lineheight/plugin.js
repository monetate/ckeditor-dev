/**
 * @fileOverview A plugin that adds a line height dropdown to the editor toolbar.
 * The code is heavily borrowed from the font family/size plugin.
 *
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

(function() {
    function addCombo( editor, comboName, styleType, lang, entries, defaultLabel,
        styleDefinition, order ) {

        var config = editor.config,
            style = new CKEDITOR.style( styleDefinition );

        // Gets the list of line heights from the settings.
        var names = entries.split( ';' ),
            values = [];

        // Create style objects for all line heights.
        var styles = {};
        for (var i = 0; i < names.length; i++ ) {
            var parts = names[i];

            if (parts) {
                parts = parts.split( '/' );
                var vars = {},
                name = names[i] = parts[0];
                vars[styleType] = values[i] = parts[1] || name;
                styles[name] = new CKEDITOR.style(styleDefinition, vars);
                styles[name]._.definition.name = name;
            } else {
                names.splice( i--, 1 );
            }
        }

        editor.ui.addRichCombo( comboName, {
            label: '',
            title: 'Line Height',
            allowedContent: style,
            requiredContent: style,

            panel: {
                css: [CKEDITOR.skin.getPath('editor')].concat(config.contentsCss),
                multiSelect: false,
                attributes: { 'aria-label': "lineheight" }
            },

            init: function() {
                this.startGroup('lineheight');
                for ( var i = 0; i < names.length; i++ ) {
                    var name = names[i];
                    this.add(name, name, name);
                }
            },

            onClick: function( value ) {
                editor.focus();
                editor.fire('saveSnapshot');

                var style = styles[value];

                editor[this.getValue() == value ? 'removeStyle' : 'applyStyle'](style);
                editor.fire('saveSnapshot');
            },

            onRender: function() {
                editor.on('selectionChange', function(ev) {
                    var currentValue = this.getValue();

                    var elementPath = ev.data.path,
                        elements = elementPath.elements;

                    // For each element into the elements path.
                    for (var i = 0, element; i < elements.length; i++ ) {
                        element = elements[i];

                        // Check if the element is removable by any of
                        // the styles.
                        for (var value in styles) {
                            if (styles[value].checkElementMatch(element, true)) {
                                if (value != currentValue) {
                                    this.setValue(value, defaultLabel);
                                }
                                return;
                            }
                        }
                    }

                    // If no styles match, just empty it.
                    this.setValue('', defaultLabel);
                }, this);
            }
        });
    }

    CKEDITOR.plugins.add('lineheight', {
        requires: 'richcombo',
        init: function(editor) {
            var config = editor.config;
            addCombo(editor, 'lineheight', 'lineheight', 'lineheight',
                config.lineheight_sizes, config.lineheight_defaultLabel,
                config.lineheight_style, 50);
        }
    });

})();


/**
 * The text to be displayed in the Line Height combo is none of the available values
 * matches the current cursor position or text selection.
 * @member CKEDITOR.config
 */
CKEDITOR.config.lineheight_defaultLabel = '';


/**
 * The list of line height sizes to be displayed in the Line Height combo in the
 * toolbar. Entries are separated by semi-colons (`';'`).
 *
 * Any kind of "CSS like" size can be used, like `'12px'`, `'2.3em'`, `'130%'`,
 * `'larger'` or `'x-small'`.
 *
 * A display name may be optionally defined by prefixing the entries with the
 * name and the slash character. For example, `'Bigger Font/14px'` will be
 * displayed as `'Bigger Font'` in the list, but will be outputted as `'14px'`.
 *
 *    config.fontSize_sizes = '16/16px;24/24px;48/48px;';
 *
 *    config.fontSize_sizes = '12px;2.3em;130%;larger;x-small';
 *
 *    config.fontSize_sizes = '12 Pixels/12px;Big/2.3em;30 Percent More/130%;Bigger/larger;Very Small/x-small';
 *
 * @member CKEDITOR.config
 */
CKEDITOR.config.lineheight_sizes = '8/8px;9/9px;10/10px;11/11px;12/12px;14/14px;16/16px;18/18px;' +
    '20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;72/72px';


/**
 * The style definition to be used to apply the line-height size in the text.
 *
 * @member CKEDITOR.config
 */
CKEDITOR.config.lineheight_style = {
    element: 'div',
    styles: { 'line-height': '#(lineheight)' },
    overrides: [ {
        element: 'lineheight', attributes: { 'lineheight': null }
    }]
};
