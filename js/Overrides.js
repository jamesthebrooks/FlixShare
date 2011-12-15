Ext.override(Ext.form.TextArea, {
    renderTpl: [
        '<tpl if="label"><label for="{inputId}" class="x-form-label"><span>{label}</span></label></tpl>',
        '<tpl if="fieldEl"><div class="x-form-field-container">',
            '<textarea id="{inputId}" type="{type}" name="{name}" class="{fieldCls}"',
            '<tpl if="tabIndex">tabIndex="{tabIndex}" </tpl>',
            '<tpl if="placeHolder">placeholder="{placeHolder}" </tpl>',
            '<tpl if="style">style="{style}" </tpl>',
            '<tpl if="maxRows != undefined">rows="{maxRows}" </tpl>',
            '<tpl if="maxlength">maxlength="{maxlength}" </tpl>',
            '<tpl if="autoComplete">autocomplete="{autoComplete}" </tpl>',
            '<tpl if="autoCapitalize">autocapitalize="{autoCapitalize}" </tpl>',
            '<tpl if="autoFocus">autofocus="{autoFocus}" </tpl>',
            '></textarea>',
            '<tpl if="useMask"><div class="x-field-mask"></div></tpl>',
        '</div></tpl>'
    ]
});

Ext.override(Ext.form.Field,{
  renderTpl: [
    '<tpl if="label">',
        '<label for="{inputId}" class="x-form-label"><span>{label}</span></label>',
    '</tpl>',
    '<tpl if="fieldEl">',
        '<div class="x-form-field-container"><input id="{inputId}" type="{inputType}" name="{name}" class="{fieldCls}"',
            '<tpl if="tabIndex">tabIndex="{tabIndex}" </tpl>',
            '<tpl if="placeHolder">placeholder="{placeHolder}" </tpl>',
            '<tpl if="style">style="{style}" </tpl>',
            '<tpl if="maxlength">maxlength="{maxlength}" </tpl>',
            '<tpl if="autoComplete">autocomplete="{autoComplete}" </tpl>',
            '<tpl if="autoCapitalize">autocapitalize="{autoCapitalize}" </tpl>',
            '<tpl if="autoCorrect">autocorrect="{autoCorrect}" </tpl> />',
        '<tpl if="useMask"><div class="x-field-mask"></div></tpl>',
        '</div>',
        '<tpl if="useClearIcon"><div class="x-field-clear-container"><div class="x-field-clear x-hidden-visibility">&#215;</div></div></tpl>',
    '</tpl>'
  ]
});

Ext.override(Ext.form.Slider, {
  renderTpl: [
    '<tpl if="label">',
        '<label for="{inputId}" class="x-form-label"><span>{label}</span></label>',
    '</tpl>',
    '<tpl if="fieldEl">',
        '<div id="{inputId}" name="{name}" class="{fieldCls}"',
        '<tpl if="tabIndex">tabIndex="{tabIndex}"</tpl>',
        '<tpl if="style">style="{style}" </tpl>',
    '/></tpl>'
  ]
});

Ext.override(Ext.form.Number, {
    renderTpl: [
        '<tpl if="label"><label for="{inputId}" class="x-form-label"><span>{label}</span></label></tpl>',
        '<tpl if="fieldEl"><div class="x-form-field-container">',
            '<input id="{inputId}" type="{inputType}" name="{name}" class="{fieldCls}"',
                '<tpl if="tabIndex">tabIndex="{tabIndex}" </tpl>',
                '<tpl if="placeHolder">placeholder="{placeHolder}" </tpl>',
                '<tpl if="style">style="{style}" </tpl>',
                '<tpl if="minValue != undefined">min="{minValue}" </tpl>',
                '<tpl if="maxValue != undefined">max="{maxValue}" </tpl>',
                '<tpl if="stepValue != undefined">step="{stepValue}" </tpl>',
                '<tpl if="autoComplete">autocomplete="{autoComplete}" </tpl>',
                '<tpl if="autoCapitalize">autocapitalize="{autoCapitalize}" </tpl>',
                '<tpl if="autoFocus">autofocus="{autoFocus}" </tpl>',
            '/>',
            '<tpl if="useMask"><div class="x-field-mask"></div></tpl>',
            '</div></tpl>',
        '<tpl if="useClearIcon"><div class="x-field-clear-container"><div class="x-field-clear x-hidden-visibility">&#215;</div><div></tpl>'
    ]
});

Ext.override(Ext.form.Spinner, {
    renderTpl: [
        '<tpl if="label"><label for="{inputId}" class="x-form-label"><span>{label}</span></label></tpl>',
        '<tpl if="fieldEl">',
            '<div class="{componentCls}-body">',
                '<div class="{componentCls}-down"><span>-</span></div>',
                '<div class="x-form-field-container">',
                    '<input id="{inputId}" type="{type}" name="{name}" class="{fieldCls}"',
                        '<tpl if="tabIndex">tabIndex="{tabIndex}" </tpl>',
                        '<tpl if="placeHolder">placeholder="{placeHolder}" </tpl>',
                        '<tpl if="style">style="{style}" </tpl>',
                        '<tpl if="minValue != undefined">min="{minValue}" </tpl>',
                        '<tpl if="maxValue != undefined">max="{maxValue}" </tpl>',
                        '<tpl if="stepValue != undefined">step="{stepValue}" </tpl>',
                        '<tpl if="autoComplete">autocomplete="{autoComplete}" </tpl>',
                        '<tpl if="autoFocus">autofocus="{autoFocus}" </tpl>',
                    '/>',
                    '<tpl if="useMask"><div class="x-field-mask"></div></tpl>',
                '</div>',
                '<div class="{componentCls}-up"><span>+</span></div>',
            '</div>',
        '</tpl>'
    ]
});

Ext.override(Ext.form.Checkbox, {
  renderTpl : [
    '<tpl if="label"><label for="{inputId}" class="x-form-label"><span>{label}</span></label></tpl>',
    '<tpl if="fieldEl"><input id="{inputId}" type="{inputType}" name="{name}" class="{fieldCls}" tabIndex="-1" ',
        '<tpl if="checked"> checked </tpl>',
        '<tpl if="style">style="{style}" </tpl> value="{inputValue}" />',
  '</tpl>'
  ]
});

Ext.override(Ext.DataView, {
    onRender : function() {
        Ext.DataView.superclass.onRender.apply(this, arguments);
        if (this.loadingText) {
            this.loadMask = new Ext.LoadMask(Ext.getBody(), {
                msg: this.loadingText
            });
        }
     }
});

Ext.Msg.on("show", function () {
  this.doComponentLayout();
});

Ext.override(Ext.data.Model, {
  /**
   * Validates the current data against all of its configured
   * {@link #validations} and returns an {@link Ext.data.Errors Errors} object
   * @return {Ext.data.Errors} The errors object
   */
  validate: function() {
    var errors      = new Ext.data.Errors(),
      validations = this.validations,
      validators  = Ext.data.validations,
      length, validation, field, valid, type, i;
    if (validations) {
      length = validations.length;
      for (i = 0; i < length; i++) {
        validation = validations[i];
        field = validation.field || validation.name;
        type  = validation.type;
        valid = validators[type](validation, this.get(field), this);
        if (!valid) {
          errors.add({
            field  : field,
            message: validation.message || validators[type + 'Message']
          });
        }
      }
    }
    return errors;
  }
});

Ext.override(Ext.Button, {
  label   : '',
  setIconClass: function(cls) {
      var me = this;

      if (me.rendered) {
          if (!me.iconEl && cls) {
              me.iconEl = me.el.createChild({
                  tag: 'img',
                  src: Ext.BLANK_IMAGE_URL,
                  cls: cls
              });
              me.iconEl.set({
                'alt'   : this.label
              });
              me.setIconAlign(me.iconAlign);
          }
          else if (me.iconEl && cls != me.iconCls) {
              if (cls) {
                  if (me.iconCls) {
                      me.iconEl.removeCls(me.iconCls);
                  }
                  me.iconEl.addCls(cls);
                  me.setIconAlign(me.iconAlign);
              }
              else {
                  me.setIconAlign(false);
                  me.iconEl.remove();
                  me.iconEl = null;
              }
          }
      }
      me.iconCls = cls;
      return me;
  },
  setIcon : function(icon) {
    var me = this;
    if (me.rendered) {
      if (!me.iconEl && icon) {
        me.iconEl = me.el.createChild({
          tag: 'img',
          src: Ext.BLANK_IMAGE_URL,
          style: 'background-image: ' + (icon ? 'url(' + icon + ')' : '')
        });
        me.iconEl.set({
          'alt'   : this.label
        });
        me.setIconAlign(me.iconAlign);
      } else if (me.iconEl && icon != me.icon) {
        if (icon) {
          me.iconEl.setStyle('background-image', icon ? 'url(' + icon + ')' : '');
          me.setIconAlign(me.iconAlign);
        }
        else {
          me.setIconAlign(false);
          me.iconEl.remove();
          me.iconEl = null;
        }
      }
    }
    me.icon = icon;
    return me;
  }
});