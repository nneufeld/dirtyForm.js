# Built using https://github.com/jquery-boilerplate/jquery-boilerplate

# Note that when compiling with coffeescript, the plugin is wrapped in another
# anonymous function. We do not need to pass in undefined as well, since
# coffeescript uses (void 0) instead.
do ($ = jQuery, window, document) ->

  # window and document are passed through as local variable rather than global
  # as this (slightly) quickens the resolution process and can be more efficiently
  # minified (especially when both are regularly referenced in your plugin).

  # Create the defaults once
  pluginName = "dirtyForm"
  defaults =
    selector: "input, select, textarea"
    dirtyClass: "dirty"

  # The actual plugin constructor
  class DirtyForm
    constructor: (@element, options) ->
      # jQuery has an extend method which merges the contents of two or
      # more objects, storing the result in the first object. The first object
      # is generally empty as we don't want to alter the default options for
      # future instances of the plugin
      @settings = $.extend {}, defaults, options
      @_defaults = defaults
      @_name = pluginName
      @init()

    init: ->
      # Place initialization logic here
      # You already have access to the DOM element and the options via the instance,
      # e.g., @element and @settings
      $(@element).find(@settings.selector).each (index, element) =>
        $(element).data('initial-value', @getValue($(element)))
        @attachHandlers($(element))

    formIsDirty: ->
      $(@element).find(".#{@settings.dirtyClass}").length > 0

    setDirtyOnForm: ->
      $(@element).toggleClass(@settings.dirtyClass, @formIsDirty())

    elementIsDirty: (element) ->
      @getValue(element) != element.data('initial-value')

    setDirtyOnElement: (element, updateForm = true) ->
      element.toggleClass(@settings.dirtyClass, @elementIsDirty(element))
      @setDirtyOnForm() if updateForm

    attachHandlers: (element) ->
      defaultHandler = =>
        element.on 'change', (event) =>
          @setDirtyOnElement($(event.target))

      handlers =
        "INPUT": =>
          type = element.attr('type')
          if type == 'checkbox'
            defaultHandler()
          else if type == 'radio'
            element.on 'change', (event) =>
              # when a radio button changes, make sure we update all radio buttons in the set
              radios_set = $(@element).find("[type=\"radio\"][name=\"#{$(event.target).attr('name')}\"]")
              radios_set.each (index, element) =>
                @setDirtyOnElement($(element), false)
              @setDirtyOnForm()
          else
            defaultHandler()
            element.on "keyup", (event) =>
              @setDirtyOnElement($(event.target))

        "TEXTAREA": =>
          defaultHandler()
          element.on "keyup", (event) =>
            @setDirtyOnElement($(event.target))

      handler = handlers[element.prop('tagName')] || defaultHandler
      handler()

    getValue: (element) ->
      defaultGetter = ->
        element.val()

      getters =
        "INPUT": ->
          type = element.attr('type')
          if type == 'checkbox' || type == 'radio'
            element.prop('checked')
          else
            defaultGetter()

      getter = getters[element.prop('tagName')] || defaultGetter
      getter()

  # A really lightweight plugin wrapper around the constructor,
  # preventing against multiple instantiations
  $.fn[pluginName] = (options) ->
    @each ->
      unless $.data @, "plugin_#{pluginName}"
        $.data @, "plugin_#{pluginName}", new DirtyForm @, options