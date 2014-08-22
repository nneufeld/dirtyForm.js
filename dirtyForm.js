// Generated by CoffeeScript 1.7.1
(function() {
  (function($, window, document) {
    var DirtyForm, defaults, pluginName;
    pluginName = "dirtyForm";
    defaults = {
      selector: "input, select, textarea",
      dirtyClass: "dirty"
    };
    DirtyForm = (function() {
      function DirtyForm(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
      }

      DirtyForm.prototype.init = function() {
        return $(this.element).find(this.settings.selector).each((function(_this) {
          return function(index, element) {
            $(element).data('initial-value', _this.getValue($(element)));
            return _this.attachHandlers($(element));
          };
        })(this));
      };

      DirtyForm.prototype.formIsDirty = function() {
        return $(this.element).find("." + this.settings.dirtyClass).length > 0;
      };

      DirtyForm.prototype.setDirtyOnForm = function() {
        return $(this.element).toggleClass(this.settings.dirtyClass, this.formIsDirty());
      };

      DirtyForm.prototype.elementIsDirty = function(element) {
        return this.getValue(element) !== element.data('initial-value');
      };

      DirtyForm.prototype.setDirtyOnElement = function(element, updateForm) {
        if (updateForm == null) {
          updateForm = true;
        }
        element.toggleClass(this.settings.dirtyClass, this.elementIsDirty(element));
        if (updateForm) {
          return this.setDirtyOnForm();
        }
      };

      DirtyForm.prototype.attachHandlers = function(element) {
        var defaultHandler, handler, handlers;
        defaultHandler = (function(_this) {
          return function() {
            return element.on('change', function(event) {
              return _this.setDirtyOnElement($(event.target));
            });
          };
        })(this);
        handlers = {
          "INPUT": (function(_this) {
            return function() {
              var type;
              type = element.attr('type');
              if (type === 'checkbox') {
                return defaultHandler();
              } else if (type === 'radio') {
                return element.on('change', function(event) {
                  var radios_set;
                  radios_set = $(_this.element).find("[type=\"radio\"][name=\"" + ($(event.target).attr('name')) + "\"]");
                  radios_set.each(function(index, element) {
                    return _this.setDirtyOnElement($(element), false);
                  });
                  return _this.setDirtyOnForm();
                });
              } else {
                defaultHandler();
                return element.on("keyup", function(event) {
                  return _this.setDirtyOnElement($(event.target));
                });
              }
            };
          })(this),
          "TEXTAREA": (function(_this) {
            return function() {
              defaultHandler();
              return element.on("keyup", function(event) {
                return _this.setDirtyOnElement($(event.target));
              });
            };
          })(this)
        };
        handler = handlers[element.prop('tagName')] || defaultHandler;
        return handler();
      };

      DirtyForm.prototype.getValue = function(element) {
        var defaultGetter, getter, getters;
        defaultGetter = function() {
          return element.val();
        };
        getters = {
          "INPUT": function() {
            var type;
            type = element.attr('type');
            if (type === 'checkbox' || type === 'radio') {
              return element.prop('checked');
            } else {
              return defaultGetter();
            }
          }
        };
        getter = getters[element.prop('tagName')] || defaultGetter;
        return getter();
      };

      return DirtyForm;

    })();
    return $.fn[pluginName] = function(options) {
      return this.each(function() {
        if (!$.data(this, "plugin_" + pluginName)) {
          return $.data(this, "plugin_" + pluginName, new DirtyForm(this, options));
        }
      });
    };
  })(jQuery, window, document);

}).call(this);