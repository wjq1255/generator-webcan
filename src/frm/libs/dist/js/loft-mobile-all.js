/**
         * loft-mobile v1.0.1
         *
         * Copyright By Linkage Technology Co.,Ltd. All rights reserved.2014-2015.
         * All rights reserved.
         *
         * This source code is licensed under the LGPLV3-style license found in the
         * LICENSE file in the root directory of this source tree. 
         *
         */// Zepto 1.1.6 (generated with Zepto Builder) - zepto event ajax form assets data deferred detect fx fx_methods gesture selector stack touch callbacks - zeptojs.com/license 
//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

var Zepto = (function() {
  var undefined, key, $, classList, emptyArray = [], concat = emptyArray.concat, filter = emptyArray.filter, slice = emptyArray.slice,
    document = window.document,
    elementDisplay = {}, classCache = {},
    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
    singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    rootNodeRE = /^(?:body|html)$/i,
    capitalRE = /([A-Z])/g,

    // special attributes that should be get/set via method calls
    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
    table = document.createElement('table'),
    tableRow = document.createElement('tr'),
    containers = {
      'tr': document.createElement('tbody'),
      'tbody': table, 'thead': table, 'tfoot': table,
      'td': tableRow, 'th': tableRow,
      '*': document.createElement('div')
    },
    readyRE = /complete|loaded|interactive/,
    simpleSelectorRE = /^[\w-]*$/,
    class2type = {},
    toString = class2type.toString,
    zepto = {},
    camelize, uniq,
    tempParent = document.createElement('div'),
    propMap = {
      'tabindex': 'tabIndex',
      'readonly': 'readOnly',
      'for': 'htmlFor',
      'class': 'className',
      'maxlength': 'maxLength',
      'cellspacing': 'cellSpacing',
      'cellpadding': 'cellPadding',
      'rowspan': 'rowSpan',
      'colspan': 'colSpan',
      'usemap': 'useMap',
      'frameborder': 'frameBorder',
      'contenteditable': 'contentEditable'
    },
    isArray = Array.isArray ||
      function(object){ return object instanceof Array }

  zepto.matches = function(element, selector) {
    if (!selector || !element || element.nodeType !== 1) return false
    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                          element.oMatchesSelector || element.matchesSelector
    if (matchesSelector) return matchesSelector.call(element, selector)
    // fall back to performing a selector:
    var match, parent = element.parentNode, temp = !parent
    if (temp) (parent = tempParent).appendChild(element)
    match = ~zepto.qsa(parent, selector).indexOf(element)
    temp && tempParent.removeChild(element)
    return match
  }

  function type(obj) {
    return obj == null ? String(obj) :
      class2type[toString.call(obj)] || "object"
  }

  function isFunction(value) { return type(value) == "function" }
  function isWindow(obj)     { return obj != null && obj == obj.window }
  function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
  function isObject(obj)     { return type(obj) == "object" }
  function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
  }
  function likeArray(obj) { return typeof obj.length == 'number' }

  function compact(array) { return filter.call(array, function(item){ return item != null }) }
  function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function dasherize(str) {
    return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase()
  }
  uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }
  zepto.camelize = camelize;
  zepto.uniq = uniq;
  function classRE(name) {
    return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
  }

  function maybeAddPx(name, value) {
    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
  }

  function defaultDisplay(nodeName) {
    var element, display
    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName)
      document.body.appendChild(element)
      display = getComputedStyle(element, '').getPropertyValue("display")
      element.parentNode.removeChild(element)
      display == "none" && (display = "block")
      elementDisplay[nodeName] = display
    }
    return elementDisplay[nodeName]
  }

  function children(element) {
    return 'children' in element ?
      slice.call(element.children) :
      $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
  }

  function Z(dom, selector) {
    var i, len = dom ? dom.length : 0
    for (i = 0; i < len; i++) this[i] = dom[i]
    this.length = len
    this.selector = selector || ''
  }

  // `$.zepto.fragment` takes a html string and an optional tag name
  // to generate DOM nodes from the given html string.
  // The generated DOM nodes are returned as an array.
  // This function can be overriden in plugins for example to make
  // it compatible with browsers that don't support the DOM fully.
  zepto.fragment = function(html, name, properties) {
    var dom, nodes, container

    // A special case optimization for a single tag
    if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

    if (!dom) {
      if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
      if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
      if (!(name in containers)) name = '*'

      container = containers[name]
      container.innerHTML = '' + html
      dom = $.each(slice.call(container.childNodes), function(){
        container.removeChild(this)
      })
    }

    if (isPlainObject(properties)) {
      nodes = $(dom)
      $.each(properties, function(key, value) {
        if (methodAttributes.indexOf(key) > -1) nodes[key](value)
        else nodes.attr(key, value)
      })
    }

    return dom
  }

  // `$.zepto.Z` swaps out the prototype of the given `dom` array
  // of nodes with `$.fn` and thus supplying all the Zepto functions
  // to the array. This method can be overriden in plugins.
  zepto.Z = function(dom, selector) {
    return new Z(dom, selector)
  }

  // `$.zepto.isZ` should return `true` if the given object is a Zepto
  // collection. This method can be overriden in plugins.
  zepto.isZ = function(object) {
    return object instanceof zepto.Z
  }

  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
  // takes a CSS selector and an optional context (and handles various
  // special cases).
  // This method can be overriden in plugins.
  zepto.init = function(selector, context) {
    var dom
    // If nothing given, return an empty Zepto collection
    if (!selector) return zepto.Z()
    // Optimize for string selectors
    else if (typeof selector == 'string') {
      selector = selector.trim()
      // If it's a html fragment, create nodes from it
      // Note: In both Chrome 21 and Firefox 15, DOM error 12
      // is thrown if the fragment doesn't begin with <
      if (selector[0] == '<' && fragmentRE.test(selector))
        dom = zepto.fragment(selector, RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // If it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // If a function is given, call it when the DOM is ready
    else if (isFunction(selector)) return $(document).ready(selector)
    // If a Zepto collection is given, just return it
    else if (zepto.isZ(selector)) return selector
    else {
      // normalize array if an array of nodes is given
      if (isArray(selector)) dom = compact(selector)
      // Wrap DOM nodes.
      else if (isObject(selector))
        dom = [selector], selector = null
      // If it's a html fragment, create nodes from it
      else if (fragmentRE.test(selector))
        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // And last but no least, if it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // create a new Zepto collection from the nodes found
    return zepto.Z(dom, selector)
  }

  // `$` will be the base `Zepto` object. When calling this
  // function just call `$.zepto.init, which makes the implementation
  // details of selecting nodes and creating Zepto collections
  // patchable in plugins.
  $ = function(selector, context){
    return zepto.init(selector, context)
  }

  function extend(target, source, deep) {
    for (key in source)
      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
          target[key] = {}
        if (isArray(source[key]) && !isArray(target[key]))
          target[key] = []
        extend(target[key], source[key], deep)
      }
      else if (source[key] !== undefined) target[key] = source[key]
  }

  // Copy all but undefined properties from one or more
  // objects to the `target` object.
  $.extend = function(target){
    var deep, args = slice.call(arguments, 1)
    if (typeof target == 'boolean') {
      deep = target
      target = args.shift()
    }
    args.forEach(function(arg){ extend(target, arg, deep) })
    return target
  }

  // `$.zepto.qsa` is Zepto's CSS selector implementation which
  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
  // This method can be overriden in plugins.
  zepto.qsa = function(element, selector){
    var found,
        maybeID = selector[0] == '#',
        maybeClass = !maybeID && selector[0] == '.',
        nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
        isSimple = simpleSelectorRE.test(nameOnly)
    return (element.getElementById && isSimple && maybeID) ? // Safari DocumentFragment doesn't have getElementById
      ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
      (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
      slice.call(
        isSimple && !maybeID && element.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
          maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
          element.getElementsByTagName(selector) : // Or a tag
          element.querySelectorAll(selector) // Or it's not simple, and we need to query all
      )
  }

  function filtered(nodes, selector) {
    return selector == null ? $(nodes) : $(nodes).filter(selector)
  }

  $.contains = document.documentElement.contains ?
    function(parent, node) {
      return parent !== node && parent.contains(node)
    } :
    function(parent, node) {
      while (node && (node = node.parentNode))
        if (node === parent) return true
      return false
    }

  function funcArg(context, arg, idx, payload) {
    return isFunction(arg) ? arg.call(context, idx, payload) : arg
  }

  function setAttribute(node, name, value) {
    value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
  }

  // access className property while respecting SVGAnimatedString
  function className(node, value){
    var klass = node.className || '',
        svg   = klass && klass.baseVal !== undefined

    if (value === undefined) return svg ? klass.baseVal : klass
    svg ? (klass.baseVal = value) : (node.className = value)
  }

  // "true"  => true
  // "false" => false
  // "null"  => null
  // "42"    => 42
  // "42.5"  => 42.5
  // "08"    => "08"
  // JSON    => parse if valid
  // String  => self
  function deserializeValue(value) {
    try {
      return value ?
        value == "true" ||
        ( value == "false" ? false :
          value == "null" ? null :
          +value + "" == value ? +value :
          /^[\[\{]/.test(value) ? $.parseJSON(value) :
          value )
        : value
    } catch(e) {
      return value
    }
  }

  $.type = type
  $.isFunction = isFunction
  $.isWindow = isWindow
  $.isArray = isArray
  $.isPlainObject = isPlainObject

  $.isEmptyObject = function(obj) {
    var name
    for (name in obj) return false
    return true
  }

  $.inArray = function(elem, array, i){
    return emptyArray.indexOf.call(array, elem, i)
  }

  $.camelCase = camelize
  $.trim = function(str) {
    return str == null ? "" : String.prototype.trim.call(str)
  }

  // plugin compatibility
  $.uuid = 0
  $.support = { }
  $.expr = { }
  $.noop = function() {}

  $.map = function(elements, callback){
    var value, values = [], i, key
    if (likeArray(elements))
      for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i)
        if (value != null) values.push(value)
      }
    else
      for (key in elements) {
        value = callback(elements[key], key)
        if (value != null) values.push(value)
      }
    return flatten(values)
  }

  $.each = function(elements, callback){
    var i, key
    if (likeArray(elements)) {
      for (i = 0; i < elements.length; i++)
        if (callback.call(elements[i], i, elements[i]) === false) return elements
    } else {
      for (key in elements)
        if (callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements
  }

  $.grep = function(elements, callback){
    return filter.call(elements, callback)
  }

  if (window.JSON) $.parseJSON = JSON.parse

  // Populate the class2type map
  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase()
  })

  // Define methods that will be available on all
  // Zepto collections
  $.fn = {
    constructor: zepto.Z,
    length: 0,

    // Because a collection acts like an array
    // copy over these useful array functions.
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    sort: emptyArray.sort,
    splice: emptyArray.splice,
    indexOf: emptyArray.indexOf,
    concat: function(){
      var i, value, args = []
      for (i = 0; i < arguments.length; i++) {
        value = arguments[i]
        args[i] = zepto.isZ(value) ? value.toArray() : value
      }
      return concat.apply(zepto.isZ(this) ? this.toArray() : this, args)
    },

    // `map` and `slice` in the jQuery API work differently
    // from their array counterparts
    map: function(fn){
      return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
    },
    slice: function(){
      return $(slice.apply(this, arguments))
    },

    ready: function(callback){
      // need to check if document.body exists for IE as that browser reports
      // document ready when it hasn't yet created the body element
      if (readyRE.test(document.readyState) && document.body) callback($)
      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
      return this
    },
    get: function(idx){
      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
    },
    toArray: function(){ return this.get() },
    size: function(){
      return this.length
    },
    remove: function(){
      return this.each(function(){
        if (this.parentNode != null)
          this.parentNode.removeChild(this)
      })
    },
    each: function(callback){
      emptyArray.every.call(this, function(el, idx){
        return callback.call(el, idx, el) !== false
      })
      return this
    },
    filter: function(selector){
      if (isFunction(selector)) return this.not(this.not(selector))
      return $(filter.call(this, function(element){
        return zepto.matches(element, selector)
      }))
    },
    add: function(selector,context){
      return $(uniq(this.concat($(selector,context))))
    },
    is: function(selector){
      return this.length > 0 && zepto.matches(this[0], selector)
    },
    not: function(selector){
      var nodes=[]
      if (isFunction(selector) && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this)
        })
      else {
        var excludes = typeof selector == 'string' ? this.filter(selector) :
          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
        this.forEach(function(el){
          if (excludes.indexOf(el) < 0) nodes.push(el)
        })
      }
      return $(nodes)
    },
    has: function(selector){
      return this.filter(function(){
        return isObject(selector) ?
          $.contains(this, selector) :
          $(this).find(selector).size()
      })
    },
    eq: function(idx){
      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
    },
    first: function(){
      var el = this[0]
      return el && !isObject(el) ? el : $(el)
    },
    last: function(){
      var el = this[this.length - 1]
      return el && !isObject(el) ? el : $(el)
    },
    find: function(selector){
      var result, $this = this
      if (!selector) result = $()
      else if (typeof selector == 'object')
        result = $(selector).filter(function(){
          var node = this
          return emptyArray.some.call($this, function(parent){
            return $.contains(parent, node)
          })
        })
      else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
      else result = this.map(function(){ return zepto.qsa(this, selector) })
      return result
    },
    closest: function(selector, context){
      var node = this[0], collection = false
      if (typeof selector == 'object') collection = $(selector)
      while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
        node = node !== context && !isDocument(node) && node.parentNode
      return $(node)
    },
    parents: function(selector){
      var ancestors = [], nodes = this
      while (nodes.length > 0)
        nodes = $.map(nodes, function(node){
          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
            ancestors.push(node)
            return node
          }
        })
      return filtered(ancestors, selector)
    },
    parent: function(selector){
      return filtered(uniq(this.pluck('parentNode')), selector)
    },
    children: function(selector){
      return filtered(this.map(function(){ return children(this) }), selector)
    },
    contents: function() {
      return this.map(function() { return this.contentDocument || slice.call(this.childNodes) })
    },
    siblings: function(selector){
      return filtered(this.map(function(i, el){
        return filter.call(children(el.parentNode), function(child){ return child!==el })
      }), selector)
    },
    empty: function(){
      return this.each(function(){ this.innerHTML = '' })
    },
    // `pluck` is borrowed from Prototype.js
    pluck: function(property){
      return $.map(this, function(el){ return el[property] })
    },
    show: function(){
      return this.each(function(){
        this.style.display == "none" && (this.style.display = '')
        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
          this.style.display = defaultDisplay(this.nodeName)
      })
    },
    replaceWith: function(newContent){
      return this.before(newContent).remove()
    },
    wrap: function(structure){
      var func = isFunction(structure)
      if (this[0] && !func)
        var dom   = $(structure).get(0),
            clone = dom.parentNode || this.length > 1

      return this.each(function(index){
        $(this).wrapAll(
          func ? structure.call(this, index) :
            clone ? dom.cloneNode(true) : dom
        )
      })
    },
    wrapAll: function(structure){
      if (this[0]) {
        $(this[0]).before(structure = $(structure))
        var children
        // drill down to the inmost element
        while ((children = structure.children()).length) structure = children.first()
        $(structure).append(this)
      }
      return this
    },
    wrapInner: function(structure){
      var func = isFunction(structure)
      return this.each(function(index){
        var self = $(this), contents = self.contents(),
            dom  = func ? structure.call(this, index) : structure
        contents.length ? contents.wrapAll(dom) : self.append(dom)
      })
    },
    unwrap: function(){
      this.parent().each(function(){
        $(this).replaceWith($(this).children())
      })
      return this
    },
    clone: function(){
      return this.map(function(){ return this.cloneNode(true) })
    },
    hide: function(){
      return this.css("display", "none")
    },
    toggle: function(setting){
      return this.each(function(){
        var el = $(this)
        ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
      })
    },
    prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
    next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
    html: function(html){
      return 0 in arguments ?
        this.each(function(idx){
          var originHtml = this.innerHTML
          $(this).empty().append( funcArg(this, html, idx, originHtml) )
        }) :
        (0 in this ? this[0].innerHTML : null)
    },
    text: function(text){
      return 0 in arguments ?
        this.each(function(idx){
          var newText = funcArg(this, text, idx, this.textContent)
          this.textContent = newText == null ? '' : ''+newText
        }) :
        (0 in this ? this[0].textContent : null)
    },
    attr: function(name, value){
      var result
      return (typeof name == 'string' && !(1 in arguments)) ?
        (!this.length || this[0].nodeType !== 1 ? undefined :
          (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
        ) :
        this.each(function(idx){
          if (this.nodeType !== 1) return
          if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
          else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
        })
    },
    removeAttr: function(name){
      return this.each(function(){ this.nodeType === 1 && name.split(' ').forEach(function(attribute){
        setAttribute(this, attribute)
      }, this)})
    },
    prop: function(name, value){
      name = propMap[name] || name
      return (1 in arguments) ?
        this.each(function(idx){
          this[name] = funcArg(this, value, idx, this[name])
        }) :
        (this[0] && this[0][name])
    },
    data: function(name, value){
      var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()

      var data = (1 in arguments) ?
        this.attr(attrName, value) :
        this.attr(attrName)

      return data !== null ? deserializeValue(data) : undefined
    },
    val: function(value){
      return 0 in arguments ?
        this.each(function(idx){
          this.value = funcArg(this, value, idx, this.value)
        }) :
        (this[0] && (this[0].multiple ?
           $(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
           this[0].value)
        )
    },
    offset: function(coordinates){
      if (coordinates) return this.each(function(index){
        var $this = $(this),
            coords = funcArg(this, coordinates, index, $this.offset()),
            parentOffset = $this.offsetParent().offset(),
            props = {
              top:  coords.top  - parentOffset.top,
              left: coords.left - parentOffset.left
            }

        if ($this.css('position') == 'static') props['position'] = 'relative'
        $this.css(props)
      })
      if (!this.length) return null
      if (!$.contains(document.documentElement, this[0]))
        return {top: 0, left: 0}
      var obj = this[0].getBoundingClientRect()
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: Math.round(obj.width),
        height: Math.round(obj.height)
      }
    },
    css: function(property, value){
      if (arguments.length < 2) {
        var computedStyle, element = this[0]
        if(!element) return
        computedStyle = getComputedStyle(element, '')
        if (typeof property == 'string')
          return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
        else if (isArray(property)) {
          var props = {}
          $.each(property, function(_, prop){
            props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
          })
          return props
        }
      }

      var css = ''
      if (type(property) == 'string') {
        if (!value && value !== 0)
          this.each(function(){ this.style.removeProperty(dasherize(property)) })
        else
          css = dasherize(property) + ":" + maybeAddPx(property, value)
      } else {
        for (key in property)
          if (!property[key] && property[key] !== 0)
            this.each(function(){ this.style.removeProperty(dasherize(key)) })
          else
            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
      }

      return this.each(function(){ this.style.cssText += ';' + css })
    },
    index: function(element){
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
    },
    hasClass: function(name){
      if (!name) return false
      return emptyArray.some.call(this, function(el){
        return this.test(className(el))
      }, classRE(name))
    },
    addClass: function(name){
      if (!name) return this
      return this.each(function(idx){
        if (!('className' in this)) return
        classList = []
        var cls = className(this), newName = funcArg(this, name, idx, cls)
        newName.split(/\s+/g).forEach(function(klass){
          if (!$(this).hasClass(klass)) classList.push(klass)
        }, this)
        classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
      })
    },
    removeClass: function(name){
      return this.each(function(idx){
        if (!('className' in this)) return
        if (name === undefined) return className(this, '')
        classList = className(this)
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
          classList = classList.replace(classRE(klass), " ")
        })
        className(this, classList.trim())
      })
    },
    toggleClass: function(name, when){
      if (!name) return this
      return this.each(function(idx){
        var $this = $(this), names = funcArg(this, name, idx, className(this))
        names.split(/\s+/g).forEach(function(klass){
          (when === undefined ? !$this.hasClass(klass) : when) ?
            $this.addClass(klass) : $this.removeClass(klass)
        })
      })
    },
    scrollTop: function(value){
      if (!this.length) return
      var hasScrollTop = 'scrollTop' in this[0]
      if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
      return this.each(hasScrollTop ?
        function(){ this.scrollTop = value } :
        function(){ this.scrollTo(this.scrollX, value) })
    },
    scrollLeft: function(value){
      if (!this.length) return
      var hasScrollLeft = 'scrollLeft' in this[0]
      if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
      return this.each(hasScrollLeft ?
        function(){ this.scrollLeft = value } :
        function(){ this.scrollTo(value, this.scrollY) })
    },
    position: function() {
      if (!this.length) return

      var elem = this[0],
        // Get *real* offsetParent
        offsetParent = this.offsetParent(),
        // Get correct offsets
        offset       = this.offset(),
        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

      // Subtract element margins
      // note: when an element has margin: auto the offsetLeft and marginLeft
      // are the same in Safari causing offset.left to incorrectly be 0
      offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
      offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

      // Add offsetParent borders
      parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
      parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

      // Subtract the two offsets
      return {
        top:  offset.top  - parentOffset.top,
        left: offset.left - parentOffset.left
      }
    },
    offsetParent: function() {
      return this.map(function(){
        var parent = this.offsetParent || document.body
        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
          parent = parent.offsetParent
        return parent
      })
    }
  }

  // for now
  $.fn.detach = $.fn.remove

  // Generate the `width` and `height` functions
  ;['width', 'height'].forEach(function(dimension){
    var dimensionProperty =
      dimension.replace(/./, function(m){ return m[0].toUpperCase() })

    $.fn[dimension] = function(value){
      var offset, el = this[0]
      if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
        isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
        (offset = this.offset()) && offset[dimension]
      else return this.each(function(idx){
        el = $(this)
        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
      })
    }
  })

  function traverseNode(node, fun) {
    fun(node)
    for (var i = 0, len = node.childNodes.length; i < len; i++)
      traverseNode(node.childNodes[i], fun)
  }

  // Generate the `after`, `prepend`, `before`, `append`,
  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
  adjacencyOperators.forEach(function(operator, operatorIndex) {
    var inside = operatorIndex % 2 //=> prepend, append

    $.fn[operator] = function(){
      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
      var argType, nodes = $.map(arguments, function(arg) {
            argType = type(arg)
            return argType == "object" || argType == "array" || arg == null ?
              arg : zepto.fragment(arg)
          }),
          parent, copyByClone = this.length > 1
      if (nodes.length < 1) return this

      return this.each(function(_, target){
        parent = inside ? target : target.parentNode

        // convert all methods to a "before" operation
        target = operatorIndex == 0 ? target.nextSibling :
                 operatorIndex == 1 ? target.firstChild :
                 operatorIndex == 2 ? target :
                 null

        var parentInDocument = $.contains(document.documentElement, parent)

        nodes.forEach(function(node){
          if (copyByClone) node = node.cloneNode(true)
          else if (!parent) return $(node).remove()

          parent.insertBefore(node, target)
          if (parentInDocument) traverseNode(node, function(el){
            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
               (!el.type || el.type === 'text/javascript') && !el.src)
              window['eval'].call(window, el.innerHTML)
          })
        })
      })
    }

    // after    => insertAfter
    // prepend  => prependTo
    // before   => insertBefore
    // append   => appendTo
    $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
      $(html)[operator](this)
      return this
    }
  })

  zepto.Z.prototype = Z.prototype = $.fn

  // Export internal API functions in the `$.zepto` namespace
  zepto.uniq = uniq
  zepto.deserializeValue = deserializeValue
  $.zepto = zepto

  return $
})()

// If `$` is not yet defined, point it to `Zepto`
window.Zepto = Zepto
window.$ === undefined && (window.$ = Zepto)
//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  var jsonpID = 0,
      document = window.document,
      key,
      name,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      scriptTypeRE = /^(?:text|application)\/javascript/i,
      xmlTypeRE = /^(?:text|application)\/xml/i,
      jsonType = 'application/json',
      htmlType = 'text/html',
      blankRE = /^\s*$/,
      originAnchor = document.createElement('a')

  originAnchor.href = window.location.href

  // trigger a custom event and return false if it was cancelled
  function triggerAndReturn(context, eventName, data) {
    var event = $.Event(eventName)
    $(context).trigger(event, data)
    return !event.isDefaultPrevented()
  }

  // trigger an Ajax "global" event
  function triggerGlobal(settings, context, eventName, data) {
    if (settings.global) return triggerAndReturn(context || document, eventName, data)
  }

  // Number of active Ajax requests
  $.active = 0

  function ajaxStart(settings) {
    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
  }
  function ajaxStop(settings) {
    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
  }

  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
  function ajaxBeforeSend(xhr, settings) {
    var context = settings.context
    if (settings.beforeSend.call(context, xhr, settings) === false ||
        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
      return false

    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
  }
  function ajaxSuccess(data, xhr, settings, deferred) {
    var context = settings.context, status = 'success'
    settings.success.call(context, data, status, xhr)
    if (deferred) deferred.resolveWith(context, [data, status, xhr])
    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
    ajaxComplete(status, xhr, settings)
  }
  // type: "timeout", "error", "abort", "parsererror"
  function ajaxError(error, type, xhr, settings, deferred) {
    var context = settings.context
    settings.error.call(context, xhr, type, error)
    if (deferred) deferred.rejectWith(context, [xhr, type, error])
    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
    ajaxComplete(type, xhr, settings)
  }
  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
  function ajaxComplete(status, xhr, settings) {
    var context = settings.context
    settings.complete.call(context, xhr, status)
    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
    ajaxStop(settings)
  }

  // Empty function, used as default callback
  function empty() {}

  $.ajaxJSONP = function(options, deferred){
    if (!('type' in options)) return $.ajax(options)

    var _callbackName = options.jsonpCallback,
      callbackName = ($.isFunction(_callbackName) ?
        _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
      script = document.createElement('script'),
      originalCallback = window[callbackName],
      responseData,
      abort = function(errorType) {
        $(script).triggerHandler('error', errorType || 'abort')
      },
      xhr = { abort: abort }, abortTimeout

    if (deferred) deferred.promise(xhr)

    $(script).on('load error', function(e, errorType){
      clearTimeout(abortTimeout)
      $(script).off().remove()

      if (e.type == 'error' || !responseData) {
        ajaxError(null, errorType || 'error', xhr, options, deferred)
      } else {
        ajaxSuccess(responseData[0], xhr, options, deferred)
      }

      window[callbackName] = originalCallback
      if (responseData && $.isFunction(originalCallback))
        originalCallback(responseData[0])

      originalCallback = responseData = undefined
    })

    if (ajaxBeforeSend(xhr, options) === false) {
      abort('abort')
      return xhr
    }

    window[callbackName] = function(){
      responseData = arguments
    }

    script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
    document.head.appendChild(script)

    if (options.timeout > 0) abortTimeout = setTimeout(function(){
      abort('timeout')
    }, options.timeout)

    return xhr
  }

  $.ajaxSettings = {
    // Default type of request
    type: 'GET',
    // Callback that is executed before request
    beforeSend: empty,
    // Callback that is executed if the request succeeds
    success: empty,
    // Callback that is executed the the server drops error
    error: empty,
    // Callback that is executed on request complete (both: error and success)
    complete: empty,
    // The context for the callbacks
    context: null,
    // Whether to trigger "global" Ajax events
    global: true,
    // Transport
    xhr: function () {
      return new window.XMLHttpRequest()
    },
    // MIME types mapping
    // IIS returns Javascript as "application/x-javascript"
    accepts: {
      script: 'text/javascript, application/javascript, application/x-javascript',
      json:   jsonType,
      xml:    'application/xml, text/xml',
      html:   htmlType,
      text:   'text/plain'
    },
    // Whether the request is to another domain
    crossDomain: false,
    // Default timeout
    timeout: 0,
    // Whether data should be serialized to string
    processData: true,
    // Whether the browser should be allowed to cache GET responses
    cache: true
  }

  function mimeToDataType(mime) {
    if (mime) mime = mime.split(';', 2)[0]
    return mime && ( mime == htmlType ? 'html' :
      mime == jsonType ? 'json' :
      scriptTypeRE.test(mime) ? 'script' :
      xmlTypeRE.test(mime) && 'xml' ) || 'text'
  }

  function appendQuery(url, query) {
    if (query == '') return url
    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
  }

  // serialize payload and append it to the URL for GET requests
  function serializeData(options) {
    if (options.processData && options.data && $.type(options.data) != "string")
      options.data = $.param(options.data, options.traditional)
    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
      options.url = appendQuery(options.url, options.data), options.data = undefined
  }

  $.ajax = function(options){
    var settings = $.extend({}, options || {}),
        deferred = $.Deferred && $.Deferred(),
        urlAnchor, hashIndex
    for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

    ajaxStart(settings)

    if (!settings.crossDomain) {
      urlAnchor = document.createElement('a')
      urlAnchor.href = settings.url
      // cleans up URL for .href (IE only), see https://github.com/madrobby/zepto/pull/1049
      urlAnchor.href = urlAnchor.href
      settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host)
    }

    if (!settings.url) settings.url = window.location.toString()
    if ((hashIndex = settings.url.indexOf('#')) > -1) settings.url = settings.url.slice(0, hashIndex)
    serializeData(settings)

    var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
    if (hasPlaceholder) dataType = 'jsonp'

    if (settings.cache === false || (
         (!options || options.cache !== true) &&
         ('script' == dataType || 'jsonp' == dataType)
        ))
      settings.url = appendQuery(settings.url, '_=' + Date.now())

    if ('jsonp' == dataType) {
      if (!hasPlaceholder)
        settings.url = appendQuery(settings.url,
          settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
      return $.ajaxJSONP(settings, deferred)
    }

    var mime = settings.accepts[dataType],
        headers = { },
        setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
        xhr = settings.xhr(),
        nativeSetHeader = xhr.setRequestHeader,
        abortTimeout

    if (deferred) deferred.promise(xhr)

    if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
    setHeader('Accept', mime || '*/*')
    if (mime = settings.mimeType || mime) {
      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
      xhr.overrideMimeType && xhr.overrideMimeType(mime)
    }
    if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
      setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

    if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name])
    xhr.setRequestHeader = setHeader

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        xhr.onreadystatechange = empty
        clearTimeout(abortTimeout)
        var result, error = false
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
          dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
          result = xhr.responseText

          try {
            // http://perfectionkills.com/global-eval-what-are-the-options/
            if (dataType == 'script')    (1,eval)(result)
            else if (dataType == 'xml')  result = xhr.responseXML
            else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
          } catch (e) { error = e }

          if (error) ajaxError(error, 'parsererror', xhr, settings, deferred)
          else ajaxSuccess(result, xhr, settings, deferred)
        } else {
          ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
        }
      }
    }

    if (ajaxBeforeSend(xhr, settings) === false) {
      xhr.abort()
      ajaxError(null, 'abort', xhr, settings, deferred)
      return xhr
    }

    if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

    var async = 'async' in settings ? settings.async : true
    xhr.open(settings.type, settings.url, async, settings.username, settings.password)

    for (name in headers) nativeSetHeader.apply(xhr, headers[name])

    if (settings.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.onreadystatechange = empty
        xhr.abort()
        ajaxError(null, 'timeout', xhr, settings, deferred)
      }, settings.timeout)

    // avoid sending empty string (#319)
    xhr.send(settings.data ? settings.data : null)
    return xhr
  }

  // handle optional data/success arguments
  function parseArguments(url, data, success, dataType) {
    if ($.isFunction(data)) dataType = success, success = data, data = undefined
    if (!$.isFunction(success)) dataType = success, success = undefined
    return {
      url: url
    , data: data
    , success: success
    , dataType: dataType
    }
  }

  $.get = function(/* url, data, success, dataType */){
    return $.ajax(parseArguments.apply(null, arguments))
  }

  $.post = function(/* url, data, success, dataType */){
    var options = parseArguments.apply(null, arguments)
    options.type = 'POST'
    return $.ajax(options)
  }

  $.getJSON = function(/* url, data, success */){
    var options = parseArguments.apply(null, arguments)
    options.dataType = 'json'
    return $.ajax(options)
  }

  $.fn.load = function(url, data, success){
    if (!this.length) return this
    var self = this, parts = url.split(/\s/), selector,
        options = parseArguments(url, data, success),
        callback = options.success
    if (parts.length > 1) options.url = parts[0], selector = parts[1]
    options.success = function(response){
      self.html(selector ?
        $('<div>').html(response.replace(rscript, "")).find(selector)
        : response)
      callback && callback.apply(self, arguments)
    }
    $.ajax(options)
    return this
  }

  var escape = encodeURIComponent

  function serialize(params, obj, traditional, scope){
    var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
    $.each(obj, function(key, value) {
      type = $.type(value)
      if (scope) key = traditional ? scope :
        scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
      // handle data in serializeArray() format
      if (!scope && array) params.add(value.name, value.value)
      // recurse into nested objects
      else if (type == "array" || (!traditional && type == "object"))
        serialize(params, value, traditional, key)
      else params.add(key, value)
    })
  }

  $.param = function(obj, traditional){
    var params = []
    params.add = function(key, value) {
      if ($.isFunction(value)) value = value()
      if (value == null) value = ""
      this.push(escape(key) + '=' + escape(value))
    }
    serialize(params, obj, traditional)
    return params.join('&').replace(/%20/g, '+')
  }
})(Zepto)
//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  var cache = [], timeout

  $.fn.remove = function(){
    return this.each(function(){
      if(this.parentNode){
        if(this.tagName === 'IMG'){
          cache.push(this)
          this.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
          if (timeout) clearTimeout(timeout)
          timeout = setTimeout(function(){ cache = [] }, 60000)
        }
        this.parentNode.removeChild(this)
      }
    })
  }
})(Zepto)

//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  // Create a collection of callbacks to be fired in a sequence, with configurable behaviour
  // Option flags:
  //   - once: Callbacks fired at most one time.
  //   - memory: Remember the most recent context and arguments
  //   - stopOnFalse: Cease iterating over callback list
  //   - unique: Permit adding at most one instance of the same callback
  $.Callbacks = function(options) {
    options = $.extend({}, options)

    var memory, // Last fire value (for non-forgettable lists)
        fired,  // Flag to know if list was already fired
        firing, // Flag to know if list is currently firing
        firingStart, // First callback to fire (used internally by add and fireWith)
        firingLength, // End of the loop when firing
        firingIndex, // Index of currently firing callback (modified by remove if needed)
        list = [], // Actual callback list
        stack = !options.once && [], // Stack of fire calls for repeatable lists
        fire = function(data) {
          memory = options.memory && data
          fired = true
          firingIndex = firingStart || 0
          firingStart = 0
          firingLength = list.length
          firing = true
          for ( ; list && firingIndex < firingLength ; ++firingIndex ) {
            if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
              memory = false
              break
            }
          }
          firing = false
          if (list) {
            if (stack) stack.length && fire(stack.shift())
            else if (memory) list.length = 0
            else Callbacks.disable()
          }
        },

        Callbacks = {
          add: function() {
            if (list) {
              var start = list.length,
                  add = function(args) {
                    $.each(args, function(_, arg){
                      if (typeof arg === "function") {
                        if (!options.unique || !Callbacks.has(arg)) list.push(arg)
                      }
                      else if (arg && arg.length && typeof arg !== 'string') add(arg)
                    })
                  }
              add(arguments)
              if (firing) firingLength = list.length
              else if (memory) {
                firingStart = start
                fire(memory)
              }
            }
            return this
          },
          remove: function() {
            if (list) {
              $.each(arguments, function(_, arg){
                var index
                while ((index = $.inArray(arg, list, index)) > -1) {
                  list.splice(index, 1)
                  // Handle firing indexes
                  if (firing) {
                    if (index <= firingLength) --firingLength
                    if (index <= firingIndex) --firingIndex
                  }
                }
              })
            }
            return this
          },
          has: function(fn) {
            return !!(list && (fn ? $.inArray(fn, list) > -1 : list.length))
          },
          empty: function() {
            firingLength = list.length = 0
            return this
          },
          disable: function() {
            list = stack = memory = undefined
            return this
          },
          disabled: function() {
            return !list
          },
          lock: function() {
            stack = undefined;
            if (!memory) Callbacks.disable()
            return this
          },
          locked: function() {
            return !stack
          },
          fireWith: function(context, args) {
            if (list && (!fired || stack)) {
              args = args || []
              args = [context, args.slice ? args.slice() : args]
              if (firing) stack.push(args)
              else fire(args)
            }
            return this
          },
          fire: function() {
            return Callbacks.fireWith(this, arguments)
          },
          fired: function() {
            return !!fired
          }
        }

    return Callbacks
  }
})(Zepto)
//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

// The following code is heavily inspired by jQuery's $.fn.data()

;(function($){
  var data = {}, dataAttr = $.fn.data, camelize = $.camelCase,
    exp = $.expando = 'Zepto' + (+new Date()), emptyArray = []

  // Get value from node:
  // 1. first try key as given,
  // 2. then try camelized key,
  // 3. fall back to reading "data-*" attribute.
  function getData(node, name) {
    var id = node[exp], store = id && data[id]
    if (name === undefined) return store || setData(node)
    else {
      if (store) {
        if (name in store) return store[name]
        var camelName = camelize(name)
        if (camelName in store) return store[camelName]
      }
      return dataAttr.call($(node), name)
    }
  }

  // Store value under camelized key on node
  function setData(node, name, value) {
    var id = node[exp] || (node[exp] = ++$.uuid),
      store = data[id] || (data[id] = attributeData(node))
    if (name !== undefined) store[camelize(name)] = value
    return store
  }

  // Read all "data-*" attributes from a node
  function attributeData(node) {
    var store = {}
    $.each(node.attributes || emptyArray, function(i, attr){
      if (attr.name.indexOf('data-') == 0)
        store[camelize(attr.name.replace('data-', ''))] =
          $.zepto.deserializeValue(attr.value)
    })
    return store
  }

  $.fn.data = function(name, value) {
    return value === undefined ?
      // set multiple values via object
      $.isPlainObject(name) ?
        this.each(function(i, node){
          $.each(name, function(key, value){ setData(node, key, value) })
        }) :
        // get value from first element
        (0 in this ? getData(this[0], name) : undefined) :
      // set value on all elements
      this.each(function(){ setData(this, name, value) })
  }

  $.fn.removeData = function(names) {
    if (typeof names == 'string') names = names.split(/\s+/)
    return this.each(function(){
      var id = this[exp], store = id && data[id]
      if (store) $.each(names || store, function(key){
        delete store[names ? camelize(this) : key]
      })
    })
  }

  // Generate extended `remove` and `empty` functions
  ;['remove', 'empty'].forEach(function(methodName){
    var origFn = $.fn[methodName]
    $.fn[methodName] = function() {
      var elements = this.find('*')
      if (methodName === 'remove') elements = elements.add(this)
      elements.removeData()
      return origFn.call(this)
    }
  })
})(Zepto)
//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
//
//     Some code (c) 2005, 2013 jQuery Foundation, Inc. and other contributors

;(function($){
  var slice = Array.prototype.slice

  function Deferred(func) {
    var tuples = [
          // action, add listener, listener list, final state
          [ "resolve", "done", $.Callbacks({once:1, memory:1}), "resolved" ],
          [ "reject", "fail", $.Callbacks({once:1, memory:1}), "rejected" ],
          [ "notify", "progress", $.Callbacks({memory:1}) ]
        ],
        state = "pending",
        promise = {
          state: function() {
            return state
          },
          always: function() {
            deferred.done(arguments).fail(arguments)
            return this
          },
          then: function(/* fnDone [, fnFailed [, fnProgress]] */) {
            var fns = arguments
            return Deferred(function(defer){
              $.each(tuples, function(i, tuple){
                var fn = $.isFunction(fns[i]) && fns[i]
                deferred[tuple[1]](function(){
                  var returned = fn && fn.apply(this, arguments)
                  if (returned && $.isFunction(returned.promise)) {
                    returned.promise()
                      .done(defer.resolve)
                      .fail(defer.reject)
                      .progress(defer.notify)
                  } else {
                    var context = this === promise ? defer.promise() : this,
                        values = fn ? [returned] : arguments
                    defer[tuple[0] + "With"](context, values)
                  }
                })
              })
              fns = null
            }).promise()
          },

          promise: function(obj) {
            return obj != null ? $.extend( obj, promise ) : promise
          }
        },
        deferred = {}

    $.each(tuples, function(i, tuple){
      var list = tuple[2],
          stateString = tuple[3]

      promise[tuple[1]] = list.add

      if (stateString) {
        list.add(function(){
          state = stateString
        }, tuples[i^1][2].disable, tuples[2][2].lock)
      }

      deferred[tuple[0]] = function(){
        deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments)
        return this
      }
      deferred[tuple[0] + "With"] = list.fireWith
    })

    promise.promise(deferred)
    if (func) func.call(deferred, deferred)
    return deferred
  }

  $.when = function(sub) {
    var resolveValues = slice.call(arguments),
        len = resolveValues.length,
        i = 0,
        remain = len !== 1 || (sub && $.isFunction(sub.promise)) ? len : 0,
        deferred = remain === 1 ? sub : Deferred(),
        progressValues, progressContexts, resolveContexts,
        updateFn = function(i, ctx, val){
          return function(value){
            ctx[i] = this
            val[i] = arguments.length > 1 ? slice.call(arguments) : value
            if (val === progressValues) {
              deferred.notifyWith(ctx, val)
            } else if (!(--remain)) {
              deferred.resolveWith(ctx, val)
            }
          }
        }

    if (len > 1) {
      progressValues = new Array(len)
      progressContexts = new Array(len)
      resolveContexts = new Array(len)
      for ( ; i < len; ++i ) {
        if (resolveValues[i] && $.isFunction(resolveValues[i].promise)) {
          resolveValues[i].promise()
            .done(updateFn(i, resolveContexts, resolveValues))
            .fail(deferred.reject)
            .progress(updateFn(i, progressContexts, progressValues))
        } else {
          --remain
        }
      }
    }
    if (!remain) deferred.resolveWith(resolveContexts, resolveValues)
    return deferred.promise()
  }

  $.Deferred = Deferred
})(Zepto)
//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  function detect(ua, platform){
    var os = this.os = {}, browser = this.browser = {},
      webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
      android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
      osx = !!ua.match(/\(Macintosh\; Intel /),
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
      iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
      win = /Win\d{2}|Windows/.test(platform),
      wp = ua.match(/Windows Phone ([\d.]+)/),
      touchpad = webos && ua.match(/TouchPad/),
      kindle = ua.match(/Kindle\/([\d.]+)/),
      silk = ua.match(/Silk\/([\d._]+)/),
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
      bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
      rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
      playbook = ua.match(/PlayBook/),
      chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
      firefox = ua.match(/Firefox\/([\d.]+)/),
      firefoxos = ua.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
      ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
      webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
      safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/)

    // Todo: clean this up with a better OS/browser seperation:
    // - discern (more) between multiple browsers on android
    // - decide if kindle fire in silk mode is android or not
    // - Firefox on Android doesn't specify the Android version
    // - possibly devide in os, device and browser hashes

    if (browser.webkit = !!webkit) browser.version = webkit[1]

    if (android) os.android = true, os.version = android[2]
    if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
    if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
    if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
    if (wp) os.wp = true, os.version = wp[1]
    if (webos) os.webos = true, os.version = webos[2]
    if (touchpad) os.touchpad = true
    if (blackberry) os.blackberry = true, os.version = blackberry[2]
    if (bb10) os.bb10 = true, os.version = bb10[2]
    if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
    if (playbook) browser.playbook = true
    if (kindle) os.kindle = true, os.version = kindle[1]
    if (silk) browser.silk = true, browser.version = silk[1]
    if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
    if (chrome) browser.chrome = true, browser.version = chrome[1]
    if (firefox) browser.firefox = true, browser.version = firefox[1]
    if (firefoxos) os.firefoxos = true, os.version = firefoxos[1]
    if (ie) browser.ie = true, browser.version = ie[1]
    if (safari && (osx || os.ios || win)) {
      browser.safari = true
      if (!os.ios) browser.version = safari[1]
    }
    if (webview) browser.webview = true

    os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
      (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)))
    os.phone  = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
      (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
      (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))))
  }

  detect.call($, navigator.userAgent, navigator.platform)
  // make available to unit tests
  $.__detect = detect

})(Zepto)
//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  var _zid = 1, undefined,
      slice = Array.prototype.slice,
      isFunction = $.isFunction,
      isString = function(obj){ return typeof obj == 'string' },
      handlers = {},
      specialEvents={},
      focusinSupported = 'onfocusin' in window,
      focus = { focus: 'focusin', blur: 'focusout' },
      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event)
    if (event.ns) var matcher = matcherFor(event.ns)
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || zid(handler.fn) === zid(fn))
        && (!selector || handler.sel == selector)
    })
  }
  function parse(event) {
    var parts = ('' + event).split('.')
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

  function eventCapture(handler, captureSetting) {
    return handler.del &&
      (!focusinSupported && (handler.e in focus)) ||
      !!captureSetting
  }

  function realEvent(type) {
    return hover[type] || (focusinSupported && focus[type]) || type
  }

  function add(element, events, fn, data, selector, delegator, capture){
    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
    events.split(/\s/).forEach(function(event){
      if (event == 'ready') return $(document).ready(fn)
      var handler   = parse(event)
      handler.fn    = fn
      handler.sel   = selector
      // emulate mouseenter, mouseleave
      if (handler.e in hover) fn = function(e){
        var related = e.relatedTarget
        if (!related || (related !== this && !$.contains(this, related)))
          return handler.fn.apply(this, arguments)
      }
      handler.del   = delegator
      var callback  = delegator || fn
      handler.proxy = function(e){
        e = compatible(e)
        if (e.isImmediatePropagationStopped()) return
        e.data = data
        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
        if (result === false) e.preventDefault(), e.stopPropagation()
        return result
      }
      handler.i = set.length
      set.push(handler)
      if ('addEventListener' in element)
        element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
    })
  }
  function remove(element, events, fn, selector, capture){
    var id = zid(element)
    ;(events || '').split(/\s/).forEach(function(event){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i]
      if ('removeEventListener' in element)
        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
      })
    })
  }

  $.event = { add: add, remove: remove }

  $.proxy = function(fn, context) {
    var args = (2 in arguments) && slice.call(arguments, 2)
    if (isFunction(fn)) {
      var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (isString(context)) {
      if (args) {
        args.unshift(fn[context], fn)
        return $.proxy.apply(null, args)
      } else {
        return $.proxy(fn[context], fn)
      }
    } else {
      throw new TypeError("expected function")
    }
  }

  $.fn.bind = function(event, data, callback){
    return this.on(event, data, callback)
  }
  $.fn.unbind = function(event, callback){
    return this.off(event, callback)
  }
  $.fn.one = function(event, selector, data, callback){
    return this.on(event, selector, data, callback, 1)
  }

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      }

  function compatible(event, source) {
    if (source || !event.isDefaultPrevented) {
      source || (source = event)

      $.each(eventMethods, function(name, predicate) {
        var sourceMethod = source[name]
        event[name] = function(){
          this[predicate] = returnTrue
          return sourceMethod && sourceMethod.apply(source, arguments)
        }
        event[predicate] = returnFalse
      })

      if (source.defaultPrevented !== undefined ? source.defaultPrevented :
          'returnValue' in source ? source.returnValue === false :
          source.getPreventDefault && source.getPreventDefault())
        event.isDefaultPrevented = returnTrue
    }
    return event
  }

  function createProxy(event) {
    var key, proxy = { originalEvent: event }
    for (key in event)
      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

    return compatible(proxy, event)
  }

  $.fn.delegate = function(selector, event, callback){
    return this.on(event, selector, callback)
  }
  $.fn.undelegate = function(selector, event, callback){
    return this.off(event, selector, callback)
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

  $.fn.on = function(event, selector, data, callback, one){
    var autoRemove, delegator, $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.on(type, selector, data, fn, one)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = data, data = selector, selector = undefined
    if (callback === undefined || data === false)
      callback = data, data = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(_, element){
      if (one) autoRemove = function(e){
        remove(element, e.type, callback)
        return callback.apply(this, arguments)
      }

      if (selector) delegator = function(e){
        var evt, match = $(e.target).closest(selector, element).get(0)
        if (match && match !== element) {
          evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
          return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
        }
      }

      add(element, event, callback, data, selector, delegator || autoRemove)
    })
  }
  $.fn.off = function(event, selector, callback){
    var $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.off(type, selector, fn)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = selector, selector = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(){
      remove(this, event, callback, selector)
    })
  }

  $.fn.trigger = function(event, args){
    event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
    event._args = args
    return this.each(function(){
      // handle focus(), blur() by calling them directly
      if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
      // items in the collection might not be DOM elements
      else if ('dispatchEvent' in this) this.dispatchEvent(event)
      else $(this).triggerHandler(event, args)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function(event, args){
    var e, result
    this.each(function(i, element){
      e = createProxy(isString(event) ? $.Event(event) : event)
      e._args = args
      e.target = element
      $.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  // shortcut methods for `.bind(event, fn)` for each event type
  ;('focusin focusout focus blur load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback) {
      return (0 in arguments) ?
        this.bind(event, callback) :
        this.trigger(event)
    }
  })

  $.Event = function(type, props) {
    if (!isString(type)) props = type, type = props.type
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(type, bubbles, true)
    return compatible(event)
  }

})(Zepto)
//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  $.fn.serializeArray = function() {
    var name, type, result = [],
      add = function(value) {
        if (value.forEach) return value.forEach(add)
        result.push({ name: name, value: value })
      }
    if (this[0]) $.each(this[0].elements, function(_, field){
      type = field.type, name = field.name
      if (name && field.nodeName.toLowerCase() != 'fieldset' &&
        !field.disabled && type != 'submit' && type != 'reset' && type != 'button' && type != 'file' &&
        ((type != 'radio' && type != 'checkbox') || field.checked))
          add($(field).val())
    })
    return result
  }

  $.fn.serialize = function(){
    var result = []
    this.serializeArray().forEach(function(elm){
      result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
    })
    return result.join('&')
  }

  $.fn.submit = function(callback) {
    if (0 in arguments) this.bind('submit', callback)
    else if (this.length) {
      var event = $.Event('submit')
      this.eq(0).trigger(event)
      if (!event.isDefaultPrevented()) this.get(0).submit()
    }
    return this
  }

})(Zepto)
//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($, undefined){
  var prefix = '', eventPrefix,
    vendors = { Webkit: 'webkit', Moz: '', O: 'o' },
    testEl = document.createElement('div'),
    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
    transform,
    transitionProperty, transitionDuration, transitionTiming, transitionDelay,
    animationName, animationDuration, animationTiming, animationDelay,
    cssReset = {}

  function dasherize(str) { return str.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase() }
  function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : name.toLowerCase() }

  $.each(vendors, function(vendor, event){
    if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
      prefix = '-' + vendor.toLowerCase() + '-'
      eventPrefix = event
      return false
    }
  })

  transform = prefix + 'transform'
  cssReset[transitionProperty = prefix + 'transition-property'] =
  cssReset[transitionDuration = prefix + 'transition-duration'] =
  cssReset[transitionDelay    = prefix + 'transition-delay'] =
  cssReset[transitionTiming   = prefix + 'transition-timing-function'] =
  cssReset[animationName      = prefix + 'animation-name'] =
  cssReset[animationDuration  = prefix + 'animation-duration'] =
  cssReset[animationDelay     = prefix + 'animation-delay'] =
  cssReset[animationTiming    = prefix + 'animation-timing-function'] = ''

  $.fx = {
    off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
    speeds: { _default: 400, fast: 200, slow: 600 },
    cssPrefix: prefix,
    transitionEnd: normalizeEvent('TransitionEnd'),
    animationEnd: normalizeEvent('AnimationEnd')
  }

  $.fn.animate = function(properties, duration, ease, callback, delay){
    if ($.isFunction(duration))
      callback = duration, ease = undefined, duration = undefined
    if ($.isFunction(ease))
      callback = ease, ease = undefined
    if ($.isPlainObject(duration))
      ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration
    if (duration) duration = (typeof duration == 'number' ? duration :
                    ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
    if (delay) delay = parseFloat(delay) / 1000
    return this.anim(properties, duration, ease, callback, delay)
  }

  $.fn.anim = function(properties, duration, ease, callback, delay){
    var key, cssValues = {}, cssProperties, transforms = '',
        that = this, wrappedCallback, endEvent = $.fx.transitionEnd,
        fired = false

    if (duration === undefined) duration = $.fx.speeds._default / 1000
    if (delay === undefined) delay = 0
    if ($.fx.off) duration = 0

    if (typeof properties == 'string') {
      // keyframe animation
      cssValues[animationName] = properties
      cssValues[animationDuration] = duration + 's'
      cssValues[animationDelay] = delay + 's'
      cssValues[animationTiming] = (ease || 'linear')
      endEvent = $.fx.animationEnd
    } else {
      cssProperties = []
      // CSS transitions
      for (key in properties)
        if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
        else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

      if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
      if (duration > 0 && typeof properties === 'object') {
        cssValues[transitionProperty] = cssProperties.join(', ')
        cssValues[transitionDuration] = duration + 's'
        cssValues[transitionDelay] = delay + 's'
        cssValues[transitionTiming] = (ease || 'linear')
      }
    }

    wrappedCallback = function(event){
      if (typeof event !== 'undefined') {
        if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
        $(event.target).unbind(endEvent, wrappedCallback)
      } else
        $(this).unbind(endEvent, wrappedCallback) // triggered by setTimeout

      fired = true
      $(this).css(cssReset)
      callback && callback.call(this)
    }
    if (duration > 0){
      this.bind(endEvent, wrappedCallback)
      // transitionEnd is not always firing on older Android phones
      // so make sure it gets fired
      setTimeout(function(){
        if (fired) return
        wrappedCallback.call(that)
      }, ((duration + delay) * 1000) + 25)
    }

    // trigger page reflow so new elements can animate
    this.size() && this.get(0).clientLeft

    this.css(cssValues)

    if (duration <= 0) setTimeout(function() {
      that.each(function(){ wrappedCallback.call(this) })
    }, 0)

    return this
  }

  testEl = null
})(Zepto)
//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($, undefined){
  var document = window.document, docElem = document.documentElement,
    origShow = $.fn.show, origHide = $.fn.hide, origToggle = $.fn.toggle

  function anim(el, speed, opacity, scale, callback) {
    if (typeof speed == 'function' && !callback) callback = speed, speed = undefined
    var props = { opacity: opacity }
    if (scale) {
      props.scale = scale
      el.css($.fx.cssPrefix + 'transform-origin', '0 0')
    }
    return el.animate(props, speed, null, callback)
  }

  function hide(el, speed, scale, callback) {
    return anim(el, speed, 0, scale, function(){
      origHide.call($(this))
      callback && callback.call(this)
    })
  }

  $.fn.show = function(speed, callback) {
    origShow.call(this)
    if (speed === undefined) speed = 0
    else this.css('opacity', 0)
    return anim(this, speed, 1, '1,1', callback)
  }

  $.fn.hide = function(speed, callback) {
    if (speed === undefined) return origHide.call(this)
    else return hide(this, speed, '0,0', callback)
  }

  $.fn.toggle = function(speed, callback) {
    if (speed === undefined || typeof speed == 'boolean')
      return origToggle.call(this, speed)
    else return this.each(function(){
      var el = $(this)
      el[el.css('display') == 'none' ? 'show' : 'hide'](speed, callback)
    })
  }

  $.fn.fadeTo = function(speed, opacity, callback) {
    return anim(this, speed, opacity, null, callback)
  }

  $.fn.fadeIn = function(speed, callback) {
    var target = this.css('opacity')
    if (target > 0) this.css('opacity', 0)
    else target = 1
    return origShow.call(this).fadeTo(speed, target, callback)
  }

  $.fn.fadeOut = function(speed, callback) {
    return hide(this, speed, null, callback)
  }

  $.fn.fadeToggle = function(speed, callback) {
    return this.each(function(){
      var el = $(this)
      el[
        (el.css('opacity') == 0 || el.css('display') == 'none') ? 'fadeIn' : 'fadeOut'
      ](speed, callback)
    })
  }

})(Zepto)
//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  if ($.os.ios) {
    var gesture = {}, gestureTimeout

    function parentIfText(node){
      return 'tagName' in node ? node : node.parentNode
    }

    $(document).bind('gesturestart', function(e){
      var now = Date.now(), delta = now - (gesture.last || now)
      gesture.target = parentIfText(e.target)
      gestureTimeout && clearTimeout(gestureTimeout)
      gesture.e1 = e.scale
      gesture.last = now
    }).bind('gesturechange', function(e){
      gesture.e2 = e.scale
    }).bind('gestureend', function(e){
      if (gesture.e2 > 0) {
        Math.abs(gesture.e1 - gesture.e2) != 0 && $(gesture.target).trigger('pinch') &&
          $(gesture.target).trigger('pinch' + (gesture.e1 - gesture.e2 > 0 ? 'In' : 'Out'))
        gesture.e1 = gesture.e2 = gesture.last = 0
      } else if ('last' in gesture) {
        gesture = {}
      }
    })

    ;['pinch', 'pinchIn', 'pinchOut'].forEach(function(m){
      $.fn[m] = function(callback){ return this.bind(m, callback) }
    })
  }
})(Zepto)
//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  var zepto = $.zepto, oldQsa = zepto.qsa, oldMatches = zepto.matches

  function visible(elem){
    elem = $(elem)
    return !!(elem.width() || elem.height()) && elem.css("display") !== "none"
  }

  // Implements a subset from:
  // http://api.jquery.com/category/selectors/jquery-selector-extensions/
  //
  // Each filter function receives the current index, all nodes in the
  // considered set, and a value if there were parentheses. The value
  // of `this` is the node currently being considered. The function returns the
  // resulting node(s), null, or undefined.
  //
  // Complex selectors are not supported:
  //   li:has(label:contains("foo")) + li:has(label:contains("bar"))
  //   ul.inner:first > li
  var filters = $.expr[':'] = {
    visible:  function(){ if (visible(this)) return this },
    hidden:   function(){ if (!visible(this)) return this },
    selected: function(){ if (this.selected) return this },
    checked:  function(){ if (this.checked) return this },
    parent:   function(){ return this.parentNode },
    first:    function(idx){ if (idx === 0) return this },
    last:     function(idx, nodes){ if (idx === nodes.length - 1) return this },
    eq:       function(idx, _, value){ if (idx === value) return this },
    contains: function(idx, _, text){ if ($(this).text().indexOf(text) > -1) return this },
    has:      function(idx, _, sel){ if (zepto.qsa(this, sel).length) return this }
  }

  var filterRe = new RegExp('(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*'),
      childRe  = /^\s*>/,
      classTag = 'Zepto' + (+new Date())

  function process(sel, fn) {
    // quote the hash in `a[href^=#]` expression
    sel = sel.replace(/=#\]/g, '="#"]')
    var filter, arg, match = filterRe.exec(sel)
    if (match && match[2] in filters) {
      filter = filters[match[2]], arg = match[3]
      sel = match[1]
      if (arg) {
        var num = Number(arg)
        if (isNaN(num)) arg = arg.replace(/^["']|["']$/g, '')
        else arg = num
      }
    }
    return fn(sel, filter, arg)
  }

  zepto.qsa = function(node, selector) {
    return process(selector, function(sel, filter, arg){
      try {
        var taggedParent
        if (!sel && filter) sel = '*'
        else if (childRe.test(sel))
          // support "> *" child queries by tagging the parent node with a
          // unique class and prepending that classname onto the selector
          taggedParent = $(node).addClass(classTag), sel = '.'+classTag+' '+sel

        var nodes = oldQsa(node, sel)
      } catch(e) {
        console.error('error performing selector: %o', selector)
        throw e
      } finally {
        if (taggedParent) taggedParent.removeClass(classTag)
      }
      return !filter ? nodes :
        zepto.uniq($.map(nodes, function(n, i){ return filter.call(n, i, nodes, arg) }))
    })
  }

  zepto.matches = function(node, selector){
    return process(selector, function(sel, filter, arg){
      return (!sel || oldMatches(node, sel)) &&
        (!filter || filter.call(node, null, arg) === node)
    })
  }
})(Zepto)
//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  $.fn.end = function(){
    return this.prevObject || $()
  }

  $.fn.andSelf = function(){
    return this.add(this.prevObject || $())
  }

  'filter,add,not,eq,first,last,find,closest,parents,parent,children,siblings'.split(',').forEach(function(property){
    var fn = $.fn[property]
    $.fn[property] = function(){
      var ret = fn.apply(this, arguments)
      ret.prevObject = this
      return ret
    }
  })
})(Zepto)
//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  var touch = {},
    touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
    longTapDelay = 750,
    gesture

  function swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >=
      Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
  }

  function longTap() {
    longTapTimeout = null
    if (touch.last) {
      touch.el.trigger('longTap')
      touch = {}
    }
  }

  function cancelLongTap() {
    if (longTapTimeout) clearTimeout(longTapTimeout)
    longTapTimeout = null
  }

  function cancelAll() {
    if (touchTimeout) clearTimeout(touchTimeout)
    if (tapTimeout) clearTimeout(tapTimeout)
    if (swipeTimeout) clearTimeout(swipeTimeout)
    if (longTapTimeout) clearTimeout(longTapTimeout)
    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
    touch = {}
  }

  function isPrimaryTouch(event){
    return (event.pointerType == 'touch' ||
      event.pointerType == event.MSPOINTER_TYPE_TOUCH)
      && event.isPrimary
  }

  function isPointerEventType(e, type){
    return (e.type == 'pointer'+type ||
      e.type.toLowerCase() == 'mspointer'+type)
  }

  $(document).ready(function(){
    var now, delta, deltaX = 0, deltaY = 0, firstTouch, _isPointerType

    if ('MSGesture' in window) {
      gesture = new MSGesture()
      gesture.target = document.body
    }

    $(document)
      .bind('MSGestureEnd', function(e){
        var swipeDirectionFromVelocity =
          e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
        if (swipeDirectionFromVelocity) {
          touch.el.trigger('swipe')
          touch.el.trigger('swipe'+ swipeDirectionFromVelocity)
        }
      })
      .on('touchstart MSPointerDown pointerdown', function(e){
        if((_isPointerType = isPointerEventType(e, 'down')) &&
          !isPrimaryTouch(e)) return
        firstTouch = _isPointerType ? e : e.touches[0]
        if (e.touches && e.touches.length === 1 && touch.x2) {
          // Clear out touch movement data if we have it sticking around
          // This can occur if touchcancel doesn't fire due to preventDefault, etc.
          touch.x2 = undefined
          touch.y2 = undefined
        }
        now = Date.now()
        delta = now - (touch.last || now)
        touch.el = $('tagName' in firstTouch.target ?
          firstTouch.target : firstTouch.target.parentNode)
        touchTimeout && clearTimeout(touchTimeout)
        touch.x1 = firstTouch.pageX
        touch.y1 = firstTouch.pageY
        if (delta > 0 && delta <= 250) touch.isDoubleTap = true
        touch.last = now
        longTapTimeout = setTimeout(longTap, longTapDelay)
        // adds the current touch contact for IE gesture recognition
        if (gesture && _isPointerType) gesture.addPointer(e.pointerId);
      })
      .on('touchmove MSPointerMove pointermove', function(e){
        if((_isPointerType = isPointerEventType(e, 'move')) &&
          !isPrimaryTouch(e)) return
        firstTouch = _isPointerType ? e : e.touches[0]
        cancelLongTap()
        touch.x2 = firstTouch.pageX
        touch.y2 = firstTouch.pageY

        deltaX += Math.abs(touch.x1 - touch.x2)
        deltaY += Math.abs(touch.y1 - touch.y2)
      })
      .on('touchend MSPointerUp pointerup', function(e){
        if((_isPointerType = isPointerEventType(e, 'up')) &&
          !isPrimaryTouch(e)) return
        cancelLongTap()

        // swipe
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
            (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

          swipeTimeout = setTimeout(function() {
            touch.el.trigger('swipe')
            touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
            touch = {}
          }, 0)

        // normal tap
        else if ('last' in touch)
          // don't fire tap when delta position changed by more than 30 pixels,
          // for instance when moving to a point and back to origin
          if (deltaX < 30 && deltaY < 30) {
            // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
            // ('tap' fires before 'scroll')
            tapTimeout = setTimeout(function() {

              // trigger universal 'tap' with the option to cancelTouch()
              // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
              var event = $.Event('tap')
              event.cancelTouch = cancelAll
              touch.el.trigger(event)

              // trigger double tap immediately
              if (touch.isDoubleTap) {
                if (touch.el) touch.el.trigger('doubleTap')
                touch = {}
              }

              // trigger single tap after 250ms of inactivity
              else {
                touchTimeout = setTimeout(function(){
                  touchTimeout = null
                  if (touch.el) touch.el.trigger('singleTap')
                  touch = {}
                }, 250)
              }
            }, 0)
          } else {
            touch = {}
          }
          deltaX = deltaY = 0

      })
      // when the browser window loses focus,
      // for example when a modal dialog is shown,
      // cancel all ongoing events
      .on('touchcancel MSPointerCancel pointercancel', cancelAll)

    // scrolling the window indicates intention of the user
    // to scroll, not tap or swipe, so cancel all ongoing events
    $(window).on('scroll', cancelAll)
  })

  ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
    'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName){
    $.fn[eventName] = function(callback){ return this.on(eventName, callback) }
  })
})(Zepto)

/**
 * @name Extend
 * @file 对Zepto做了些扩展，以下所有JS都依赖与此文件
 * @desc 对Zepto一些扩展，组件必须依赖
 * @import core/zepto.js
 */


//     Zepto.js
//     (c) 2010-2012 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

// The following code is heavily inspired by jQuery's $.fn.data()

;(function($) {
    var data = {}, dataAttr = $.fn.data, camelize = $.zepto.camelize,
        exp = $.expando = 'Zepto' + (+new Date())

    // Get value from node:
    // 1. first try key as given,
    // 2. then try camelized key,
    // 3. fall back to reading "data-*" attribute.
    function getData(node, name) {
        var id = node[exp], store = id && data[id]
        if (name === undefined) return store || setData(node)
        else {
            if (store) {
                if (name in store) return store[name]
                var camelName = camelize(name)
                if (camelName in store) return store[camelName]
            }
            return dataAttr.call($(node), name)
        }
    }

    // Store value under camelized key on node
    function setData(node, name, value) {
        var id = node[exp] || (node[exp] = ++$.uuid),
            store = data[id] || (data[id] = attributeData(node))
        if (name !== undefined) store[camelize(name)] = value
        return store
    }

    // Read all "data-*" attributes from a node
    function attributeData(node) {
        var store = {}
        $.each(node.attributes, function(i, attr){
            if (attr.name.indexOf('data-') == 0)
                store[camelize(attr.name.replace('data-', ''))] = attr.value
        })
        return store
    }

    $.fn.data = function(name, value) {
        return value === undefined ?
            // set multiple values via object
            $.isPlainObject(name) ?
                this.each(function(i, node){
                    $.each(name, function(key, value){ setData(node, key, value) })
                }) :
                // get value from first element
                this.length == 0 ? undefined : getData(this[0], name) :
            // set value on all elements
            this.each(function(){ setData(this, name, value) })
    }

    $.fn.removeData = function(names) {
        if (typeof names == 'string') names = names.split(/\s+/)
        return this.each(function(){
            var id = this[exp], store = id && data[id]
            if (store) $.each(names, function(){ delete store[camelize(this)] })
        })
    }
})(Zepto);

(function($){
    var rootNodeRE = /^(?:body|html)$/i;
    $.extend($.fn, {
        offsetParent: function() {
            return $($.map(this, function(el){
                var parent = el.offsetParent || document.body
                while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
                    parent = parent.offsetParent
                return parent
            }));
        },
        scrollTop: function(){
            if (!this.length) return
            return ('scrollTop' in this[0]) ? this[0].scrollTop : this[0].scrollY
        }
    });
    $.extend($, {
        contains: function(parent, node) {
            /**
             * modified by chenluyang
             * @reason ios4 safari下，无法判断包含文字节点的情况
             * @original return parent !== node && parent.contains(node)
             */
            return parent.compareDocumentPosition
                ? !!(parent.compareDocumentPosition(node) & 16)
                : parent !== node && parent.contains(node)
        }
    });
})(Zepto);


//Core.js
;(function($) {
    //扩展在Zepto静态类上
    $.extend($, {
        /**
         * @grammar $.toString(obj)  ⇒ string
         * @name $.toString
         * @desc toString转化
         */
        toString: function(obj) {
            return Object.prototype.toString.call(obj);
        },

        /**
         * @desc 从集合中截取部分数据，这里说的集合，可以是数组，也可以是跟数组性质很像的对象，比如arguments
         * @name $.slice
         * @grammar $.slice(collection, [index])  ⇒ array
         * @example (function(){
         *     var args = $.slice(arguments, 2);
         *     console.log(args); // => [3]
         * })(1, 2, 3);
         */
        slice: function(array, index) {
            return Array.prototype.slice.call(array, index || 0);
        },

        /**
         * @name $.later
         * @grammar $.later(fn, [when, [periodic, [context, [data]]]])  ⇒ timer
         * @desc 延迟执行fn
         * **参数:**
         * - ***fn***: 将要延时执行的方法
         * - ***when***: *可选(默认 0)* 什么时间后执行
         * - ***periodic***: *可选(默认 false)* 设定是否是周期性的执行
         * - ***context***: *可选(默认 undefined)* 给方法设定上下文
         * - ***data***: *可选(默认 undefined)* 给方法设定传入参数
         * @example $.later(function(str){
         *     console.log(this.name + ' ' + str); // => Example hello
         * }, 250, false, {name:'Example'}, ['hello']);
         */
        later: function(fn, when, periodic, context, data) {
            return window['set' + (periodic ? 'Interval' : 'Timeout')](function() {
                fn.apply(context, data);
            }, when || 0);
        },

        /**
         * @desc 解析模版
         * @grammar $.parseTpl(str, data)  ⇒ string
         * @name $.parseTpl
         * @example var str = "<p><%=name%></p>",
         * obj = {name: 'ajean'};
         * console.log($.parseTpl(str, data)); // => <p>ajean</p>
         */
        parseTpl: function(str, data) {
            var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' + 'with(obj||{}){__p.push(\'' + str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/<%=([\s\S]+?)%>/g, function(match, code) {
                return "'," + code.replace(/\\'/g, "'") + ",'";
            }).replace(/<%([\s\S]+?)%>/g, function(match, code) {
                    return "');" + code.replace(/\\'/g, "'").replace(/[\r\n\t]/g, ' ') + "__p.push('";
                }).replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t') + "');}return __p.join('');";
            var func = new Function('obj', tmpl);
            return data ? func(data) : func;
        },

        /**
         * @desc 减少执行频率, 多次调用，在指定的时间内，只会执行一次。
         * **options:**
         * - ***delay***: 延时时间
         * - ***fn***: 被稀释的方法
         * - ***debounce_mode***: 是否开启防震动模式, true:start, false:end
         *
         * <code type="text">||||||||||||||||||||||||| (空闲) |||||||||||||||||||||||||
         * X    X    X    X    X    X      X    X    X    X    X    X</code>
         *
         * @grammar $.throttle(delay, fn) ⇒ function
         * @name $.throttle
         * @example var touchmoveHander = function(){
         *     //....
         * }
         * //绑定事件
         * $(document).bind('touchmove', $.throttle(250, touchmoveHander));//频繁滚动，每250ms，执行一次touchmoveHandler
         *
         * //解绑事件
         * $(document).unbind('touchmove', touchmoveHander);//注意这里面unbind还是touchmoveHander,而不是$.throttle返回的function, 当然unbind那个也是一样的效果
         *
         */
        throttle: function(delay, fn, debounce_mode) {
            var last = 0,
                timeId;

            if (typeof fn !== 'function') {
                debounce_mode = fn;
                fn = delay;
                delay = 250;
            }

            function wrapper() {
                var that = this,
                    period = Date.now() - last,
                    args = arguments;

                function exec() {
                    last = Date.now();
                    fn.apply(that, args);
                };

                function clear() {
                    timeId = undefined;
                };

                if (debounce_mode && !timeId) {
                    // debounce模式 && 第一次调用
                    exec();
                }

                timeId && clearTimeout(timeId);
                if (debounce_mode === undefined && period > delay) {
                    // throttle, 执行到了delay时间
                    exec();
                } else {
                    // debounce, 如果是start就clearTimeout
                    timeId = setTimeout(debounce_mode ? clear : exec, debounce_mode === undefined ? delay - period : delay);
                }
            };
            // for event bind | unbind
            wrapper._zid = fn._zid = fn._zid || $.proxy(fn)._zid;
            return wrapper;
        },

        /**
         * @desc 减少执行频率, 在指定的时间内, 多次调用，只会执行一次。
         * **options:**
         * - ***delay***: 延时时间
         * - ***fn***: 被稀释的方法
         * - ***t***: 指定是在开始处执行，还是结束是执行, true:start, false:end
         *
         * 非at_begin模式
         * <code type="text">||||||||||||||||||||||||| (空闲) |||||||||||||||||||||||||
         *                         X                                X</code>
         * at_begin模式
         * <code type="text">||||||||||||||||||||||||| (空闲) |||||||||||||||||||||||||
         * X                                X                        </code>
         *
         * @grammar $.debounce(delay, fn[, at_begin]) ⇒ function
         * @name $.debounce
         * @example var touchmoveHander = function(){
         *     //....
         * }
         * //绑定事件
         * $(document).bind('touchmove', $.debounce(250, touchmoveHander));//频繁滚动，只要间隔时间不大于250ms, 在一系列移动后，只会执行一次
         *
         * //解绑事件
         * $(document).unbind('touchmove', touchmoveHander);//注意这里面unbind还是touchmoveHander,而不是$.debounce返回的function, 当然unbind那个也是一样的效果
         */
        debounce: function(delay, fn, t) {
            return fn === undefined ? $.throttle(250, delay, false) : $.throttle(delay, fn, t === undefined ? false : t !== false);
        }
    });

    /**
     * 扩展类型判断
     * @param {Any} obj
     * @see isString, isBoolean, isRegExp, isNumber, isDate, isObject, isNull, isUdefined
     */
    /**
     * @name $.isString
     * @grammar $.isString(val)  ⇒ Boolean
     * @desc 判断变量类型是否为***String***
     * @example console.log($.isString({}));// => false
     * console.log($.isString(123));// => false
     * console.log($.isString('123'));// => true
     */
    /**
     * @name $.isBoolean
     * @grammar $.isBoolean(val)  ⇒ Boolean
     * @desc 判断变量类型是否为***Boolean***
     * @example console.log($.isBoolean(1));// => false
     * console.log($.isBoolean('true'));// => false
     * console.log($.isBoolean(false));// => true
     */
    /**
     * @name $.isRegExp
     * @grammar $.isRegExp(val)  ⇒ Boolean
     * @desc 判断变量类型是否为***RegExp***
     * @example console.log($.isRegExp(1));// => false
     * console.log($.isRegExp('test'));// => false
     * console.log($.isRegExp(/test/));// => true
     */
    /**
     * @name $.isNumber
     * @grammar $.isNumber(val)  ⇒ Boolean
     * @desc 判断变量类型是否为***Number***
     * @example console.log($.isNumber('123'));// => false
     * console.log($.isNumber(true));// => false
     * console.log($.isNumber(123));// => true
     */
    /**
     * @name $.isDate
     * @grammar $.isDate(val)  ⇒ Boolean
     * @desc 判断变量类型是否为***Date***
     * @example console.log($.isDate('123'));// => false
     * console.log($.isDate('2012-12-12'));// => false
     * console.log($.isDate(new Date()));// => true
     */
    /**
     * @name $.isObject
     * @grammar $.isObject(val)  ⇒ Boolean
     * @desc 判断变量类型是否为***Object***
     * @example console.log($.isObject('123'));// => false
     * console.log($.isObject(true));// => false
     * console.log($.isObject({}));// => true
     */
    /**
     * @name $.isNull
     * @grammar $.isNull(val)  ⇒ Boolean
     * @desc 判断变量类型是否为***null***
     * @example console.log($.isNull(false));// => false
     * console.log($.isNull(0));// => false
     * console.log($.isNull(null));// => true
     */
    /**
     * @name $.isUndefined
     * @grammar $.isUndefined(val)  ⇒ Boolean
     * @desc 判断变量类型是否为***undefined***
     * @example
     * console.log($.isUndefined(false));// => false
     * console.log($.isUndefined(0));// => false
     * console.log($.isUndefined(a));// => true
     */
    $.each("String Boolean RegExp Number Date Object Null Undefined".split(" "), function(i, name) {
        var fnbody = '';
        switch (name) {
            case 'Null':
                fnbody = 'obj === null';
                break;
            case 'Undefined':
                fnbody = 'obj === undefined';
                break;
            default:
                //fnbody = "new RegExp('" + name + "]', 'i').test($.toString(obj))";
                fnbody = "new RegExp('" + name + "]', 'i').test(Object.prototype.toString.call(obj))";//解决zepto与jQuery共存时报错的问题，$被jQuery占用了。
        }
        $['is' + name] = new Function('obj', "return " + fnbody);
    });

})(Zepto);

//Support.js
(function($, undefined) {
    var ua = navigator.userAgent,
        na = navigator.appVersion,
        br = $.browser;

    /**
     * @name $.browser
     * @desc 扩展zepto中对browser的检测
     *
     * **可用属性**
     * - ***qq*** 检测qq浏览器
     * - ***chrome*** 检测chrome浏览器
     * - ***uc*** 检测uc浏览器
     * - ***version*** 检测浏览器版本
     *
     * @example
     * if ($.browser.qq) {      //在qq浏览器上打出此log
     *     console.log('this is qq browser');
     * }
     */
    $.extend($.browser, {
        qq: /qq/i.test(ua),
        chrome: /chrome/i.test(ua) || /CriOS/i.test(ua),
        uc: /UC/i.test(ua) || /UC/i.test(na)
    });

    $.browser.uc = $.browser.uc || !$.browser.qq && !$.browser.chrome && !/safari/i.test(ua);

    try {
        $.browser.version = br.uc ? na.match(/UC(?:Browser)?\/([\d.]+)/)[1] : br.qq ? ua.match(/MQQBrowser\/([\d.]+)/)[1] : br.chrome ? ua.match(/(?:CriOS|Chrome)\/([\d.]+)/)[1] : br.version;
    } catch (e) {}


    /**
     * @name $.support
     * @desc 检测设备对某些属性或方法的支持情况
     *
     * **可用属性**
     * - ***orientation*** 检测是否支持转屏事件，UC中存在orientaion，但转屏不会触发该事件，故UC属于不支持转屏事件(iOS 4上qq, chrome都有这个现象)
     * - ***touch*** 检测是否支持touch相关事件
     * - ***cssTransitions*** 检测是否支持css3的transition
     * - ***has3d*** 检测是否支持translate3d的硬件加速
     *
     * @example
     * if ($.support.has3d) {      //在支持3d的设备上使用
     *     console.log('you can use transtion3d');
     * }
     */
    $.support = $.extend($.support || {}, {
        orientation: !($.browser.uc || (parseFloat($.os.version)<5 && ($.browser.qq || $.browser.chrome))) && "orientation" in window && "onorientationchange" in window,
        touch: "ontouchend" in document,
        cssTransitions: "WebKitTransitionEvent" in window,
        has3d: 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()

    });

})(Zepto);

//Event.js
(function($) {
    /** detect orientation change */
    $(document).ready(function () {
        var getOrt = "matchMedia" in window ? function(){
                return window.matchMedia("(orientation: portrait)").matches?'portrait':'landscape';
            }:function(){
                var elem = document.documentElement;
                return elem.clientWidth / Math.max(elem.clientHeight, 320) < 1.1 ? "portrait" : "landscape";
            },
            lastOrt = getOrt(),
            handler = function(e) {
                if(e.type == 'orientationchange'){
                    return $(window).trigger('ortchange');
                }
                maxTry = 20;
                clearInterval(timer);
                timer = $.later(function() {
                    var curOrt = getOrt();
                    if (lastOrt !== curOrt) {
                        lastOrt = curOrt;
                        clearInterval(timer);
                        $(window).trigger('ortchange');
                    } else if(--maxTry){//最多尝试20次
                        clearInterval(timer);
                    }
                }, 50, true);
            },
            timer, maxTry;
        $(window).bind($.support.orientation ? 'orientationchange' : 'resize', $.debounce(handler));
    });

    /**
     * @name Trigger Events
     * @theme event
     * @desc 扩展的事件
     * - ***scrollStop*** : scroll停下来时触发, 考虑前进或者后退后scroll事件不触发情况。
     * - ***ortchange*** : 当转屏的时候触发，兼容uc和其他不支持orientationchange的设备
     * @example $(document).on('scrollStop', function () {        //scroll停下来时显示scrollStop
     *     console.log('scrollStop');
     * });
     *
     * $(document).on('ortchange', function () {        //当转屏的时候触发
     *     console.log('ortchange');
     * });
     */
    /** dispatch scrollStop */
    function _registerScrollStop(){
        $(window).on('scroll', $.debounce(80, function() {
            $(document).trigger('scrollStop');
        }, false));
    }
    //在离开页面，前进或后退回到页面后，重新绑定scroll, 需要off掉所有的scroll，否则scroll时间不触发
    function _touchstartHander() {
        $(window).off('scroll');
        _registerScrollStop();
    }
    _registerScrollStop();
    $(window).on('pageshow', function(e){
        if(e.persisted) {//如果是从bfcache中加载页面
            $(document).off('touchstart', _touchstartHander).one('touchstart', _touchstartHander);
        }
    });
})(Zepto);

/*!
 * iScroll v4.2.2 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
(function(window, doc){
    var m = Math,_bindArr = [],
        dummyStyle = doc.createElement('div').style,
        vendor = (function () {
            var vendors = 't,webkitT,MozT,msT,OT'.split(','),
                t,
                i = 0,
                l = vendors.length;

            for ( ; i < l; i++ ) {
                t = vendors[i] + 'ransform';
                if ( t in dummyStyle ) {
                    return vendors[i].substr(0, vendors[i].length - 1);
                }
            }

            return false;
        })(),
        cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',


    // Style properties
        transform = prefixStyle('transform'),
        transitionProperty = prefixStyle('transitionProperty'),
        transitionDuration = prefixStyle('transitionDuration'),
        transformOrigin = prefixStyle('transformOrigin'),
        transitionTimingFunction = prefixStyle('transitionTimingFunction'),
        transitionDelay = prefixStyle('transitionDelay'),

    // Browser capabilities
        isAndroid = (/android/gi).test(navigator.appVersion),
        isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),

        has3d = prefixStyle('perspective') in dummyStyle,
        hasTouch = 'ontouchstart' in window && !isTouchPad,
        hasTransform = !!vendor,
        hasTransitionEnd = prefixStyle('transition') in dummyStyle,

        RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
        START_EV = hasTouch ? 'touchstart' : 'mousedown',
        MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
        END_EV = hasTouch ? 'touchend' : 'mouseup',
        CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
        TRNEND_EV = (function () {
            if ( vendor === false ) return false;

            var transitionEnd = {
                ''			: 'transitionend',
                'webkit'	: 'webkitTransitionEnd',
                'Moz'		: 'transitionend',
                'O'			: 'otransitionend',
                'ms'		: 'MSTransitionEnd'
            };

            return transitionEnd[vendor];
        })(),

        nextFrame = (function() {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback) { return setTimeout(callback, 1); };
        })(),
        cancelFrame = (function () {
            return window.cancelRequestAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.webkitCancelRequestAnimationFrame ||
                window.mozCancelRequestAnimationFrame ||
                window.oCancelRequestAnimationFrame ||
                window.msCancelRequestAnimationFrame ||
                clearTimeout;
        })(),

    // Helpers
        translateZ = has3d ? ' translateZ(0)' : '',

    // Constructor
        iScroll = function (el, options) {
            var that = this,
                i;

            that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
            that.wrapper.style.overflow = 'hidden';
            that.scroller = that.wrapper.children[0];

            that.translateZ = translateZ;
            // Default options
            that.options = {
                hScroll: true,
                vScroll: true,
                x: 0,
                y: 0,
                bounce: true,
                bounceLock: false,
                momentum: true,
                lockDirection: true,
                useTransform: true,
                useTransition: false,
                topOffset: 0,
                checkDOMChanges: false,		// Experimental
                handleClick: true,


                // Events
                onRefresh: null,
                onBeforeScrollStart: function (e) { e.preventDefault(); },
                onScrollStart: null,
                onBeforeScrollMove: null,
                onScrollMove: null,
                onBeforeScrollEnd: null,
                onScrollEnd: null,
                onTouchEnd: null,
                onDestroy: null

            };

            // User defined options
            for (i in options) that.options[i] = options[i];

            // Set starting position
            that.x = that.options.x;
            that.y = that.options.y;

            // Normalize options
            that.options.useTransform = hasTransform && that.options.useTransform;

            that.options.useTransition = hasTransitionEnd && that.options.useTransition;



            // Set some default styles
            that.scroller.style[transitionProperty] = that.options.useTransform ? cssVendor + 'transform' : 'top left';
            that.scroller.style[transitionDuration] = '0';
            that.scroller.style[transformOrigin] = '0 0';
            if (that.options.useTransition) that.scroller.style[transitionTimingFunction] = 'cubic-bezier(0.33,0.66,0.66,1)';

            if (that.options.useTransform) that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px)' + translateZ;
            else that.scroller.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';



            that.refresh();

            that._bind(RESIZE_EV, window);
            that._bind(START_EV);


            if (that.options.checkDOMChanges) that.checkDOMTime = setInterval(function () {
                that._checkDOMChanges();
            }, 500);
        };

// Prototype
    iScroll.prototype = {
        enabled: true,
        x: 0,
        y: 0,
        steps: [],
        scale: 1,
        currPageX: 0, currPageY: 0,
        pagesX: [], pagesY: [],
        aniTime: null,
        isStopScrollAction:false,

        handleEvent: function (e) {
            var that = this;
            switch(e.type) {
                case START_EV:
                    if (!hasTouch && e.button !== 0) return;
                    that._start(e);
                    break;
                case MOVE_EV: that._move(e); break;
                case END_EV:
                case CANCEL_EV: that._end(e); break;
                case RESIZE_EV: that._resize(); break;
                case TRNEND_EV: that._transitionEnd(e); break;
            }
        },

        _checkDOMChanges: function () {
            if (this.moved ||  this.animating ||
                (this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) return;

            this.refresh();
        },

        _resize: function () {
            var that = this;
            setTimeout(function () { that.refresh(); }, isAndroid ? 200 : 0);
        },

        _pos: function (x, y) {
            x = this.hScroll ? x : 0;
            y = this.vScroll ? y : 0;

            if (this.options.useTransform) {
                this.scroller.style[transform] = 'translate(' + x + 'px,' + y + 'px) scale(' + this.scale + ')' + translateZ;
            } else {
                x = m.round(x);
                y = m.round(y);
                this.scroller.style.left = x + 'px';
                this.scroller.style.top = y + 'px';
            }

            this.x = x;
            this.y = y;

        },



        _start: function (e) {
            var that = this,
                point = hasTouch ? e.touches[0] : e,
                matrix, x, y,
                c1, c2;

            if (!that.enabled) return;

            if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);

            if (that.options.useTransition ) that._transitionTime(0);

            that.moved = false;
            that.animating = false;

            that.distX = 0;
            that.distY = 0;
            that.absDistX = 0;
            that.absDistY = 0;
            that.dirX = 0;
            that.dirY = 0;
            that.isStopScrollAction = false;

            if (that.options.momentum) {
                if (that.options.useTransform) {
                    // Very lame general purpose alternative to CSSMatrix
                    matrix = getComputedStyle(that.scroller, null)[transform].replace(/[^0-9\-.,]/g, '').split(',');
                    x = +matrix[4];
                    y = +matrix[5];
                } else {
                    x = +getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, '');
                    y = +getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, '');
                }

                if (x != that.x || y != that.y) {
                    that.isStopScrollAction = true;
                    if (that.options.useTransition) that._unbind(TRNEND_EV);
                    else cancelFrame(that.aniTime);
                    that.steps = [];
                    that._pos(x, y);
                    if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);
                }
            }



            that.startX = that.x;
            that.startY = that.y;
            that.pointX = point.pageX;
            that.pointY = point.pageY;

            that.startTime = e.timeStamp || Date.now();

            if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);

            that._bind(MOVE_EV, window);
            that._bind(END_EV, window);
            that._bind(CANCEL_EV, window);
        },

        _move: function (e) {
            var that = this,
                point = hasTouch ? e.touches[0] : e,
                deltaX = point.pageX - that.pointX,
                deltaY = point.pageY - that.pointY,
                newX = that.x + deltaX,
                newY = that.y + deltaY,

                timestamp = e.timeStamp || Date.now();

            if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);

            that.pointX = point.pageX;
            that.pointY = point.pageY;

            // Slow down if outside of the boundaries
            if (newX > 0 || newX < that.maxScrollX) {
                newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
            }
            if (newY > that.minScrollY || newY < that.maxScrollY) {
                newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
            }

            that.distX += deltaX;
            that.distY += deltaY;
            that.absDistX = m.abs(that.distX);
            that.absDistY = m.abs(that.distY);

            if (that.absDistX < 6 && that.absDistY < 6) {
                return;
            }

            // Lock direction
            if (that.options.lockDirection) {
                if (that.absDistX > that.absDistY + 5) {
                    newY = that.y;
                    deltaY = 0;
                } else if (that.absDistY > that.absDistX + 5) {
                    newX = that.x;
                    deltaX = 0;
                }
            }

            that.moved = true;

            // internal for header scroll

            that._beforePos ? that._beforePos(newY, deltaY) && that._pos(newX, newY) : that._pos(newX, newY);

            that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
            that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

            if (timestamp - that.startTime > 300) {
                that.startTime = timestamp;
                that.startX = that.x;
                that.startY = that.y;
            }

            if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
        },

        _end: function (e) {
            if (hasTouch && e.touches.length !== 0) return;

            var that = this,
                point = hasTouch ? e.changedTouches[0] : e,
                target, ev,
                momentumX = { dist:0, time:0 },
                momentumY = { dist:0, time:0 },
                duration = (e.timeStamp || Date.now()) - that.startTime,
                newPosX = that.x,
                newPosY = that.y,
                newDuration;


            that._unbind(MOVE_EV, window);
            that._unbind(END_EV, window);
            that._unbind(CANCEL_EV, window);

            if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);


            if (!that.moved) {

                if (hasTouch && this.options.handleClick && !that.isStopScrollAction) {
                    that.doubleTapTimer = setTimeout(function () {
                        that.doubleTapTimer = null;

                        // Find the last touched element
                        target = point.target;
                        while (target.nodeType != 1) target = target.parentNode;

                        if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
                            ev = doc.createEvent('MouseEvents');
                            ev.initMouseEvent('click', true, true, e.view, 1,
                                point.screenX, point.screenY, point.clientX, point.clientY,
                                e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                                0, null);
                            ev._fake = true;
                            target.dispatchEvent(ev);
                        }
                    },  0);
                }


                that._resetPos(400);

                if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                return;
            }

            if (duration < 300 && that.options.momentum) {
                momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
                momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;

                newPosX = that.x + momentumX.dist;
                newPosY = that.y + momentumY.dist;

                if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 };
                if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };
            }

            if (momentumX.dist || momentumY.dist) {
                newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);



                that.scrollTo(m.round(newPosX), m.round(newPosY), newDuration);

                if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                return;
            }



            that._resetPos(200);
            if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
        },

        _resetPos: function (time) {
            var that = this,
                resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
                resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

            if (resetX == that.x && resetY == that.y) {
                if (that.moved) {
                    that.moved = false;
                    if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);		// Execute custom code on scroll end
                    if (that._afterPos) that._afterPos();
                }

                return;
            }

            that.scrollTo(resetX, resetY, time || 0);
        },



        _transitionEnd: function (e) {
            var that = this;

            if (e.target != that.scroller) return;

            that._unbind(TRNEND_EV);

            that._startAni();
        },


        /**
         *
         * Utilities
         *
         */
        _startAni: function () {
            var that = this,
                startX = that.x, startY = that.y,
                startTime = Date.now(),
                step, easeOut,
                animate;

            if (that.animating) return;

            if (!that.steps.length) {
                that._resetPos(400);
                return;
            }

            step = that.steps.shift();

            if (step.x == startX && step.y == startY) step.time = 0;

            that.animating = true;
            that.moved = true;

            if (that.options.useTransition) {
                that._transitionTime(step.time);
                that._pos(step.x, step.y);
                that.animating = false;
                if (step.time) that._bind(TRNEND_EV);
                else that._resetPos(0);
                return;
            }

            animate = function () {
                var now = Date.now(),
                    newX, newY;

                if (now >= startTime + step.time) {
                    that._pos(step.x, step.y);
                    that.animating = false;
                    if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);			// Execute custom code on animation end
                    that._startAni();
                    return;
                }

                now = (now - startTime) / step.time - 1;
                easeOut = m.sqrt(1 - now * now);
                newX = (step.x - startX) * easeOut + startX;
                newY = (step.y - startY) * easeOut + startY;
                that._pos(newX, newY);
                if (that.animating) that.aniTime = nextFrame(animate);
            };

            animate();
        },

        _transitionTime: function (time) {
            time += 'ms';
            this.scroller.style[transitionDuration] = time;

        },

        _momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
            var deceleration = 0.0006,
                speed = m.abs(dist) * (this.options.speedScale||1) / time,
                newDist = (speed * speed) / (2 * deceleration),
                newTime = 0, outsideDist = 0;

            // Proportinally reduce speed if we are outside of the boundaries
            if (dist > 0 && newDist > maxDistUpper) {
                outsideDist = size / (6 / (newDist / speed * deceleration));
                maxDistUpper = maxDistUpper + outsideDist;
                speed = speed * maxDistUpper / newDist;
                newDist = maxDistUpper;
            } else if (dist < 0 && newDist > maxDistLower) {
                outsideDist = size / (6 / (newDist / speed * deceleration));
                maxDistLower = maxDistLower + outsideDist;
                speed = speed * maxDistLower / newDist;
                newDist = maxDistLower;
            }

            newDist = newDist * (dist < 0 ? -1 : 1);
            newTime = speed / deceleration;

            return { dist: newDist, time: m.round(newTime) };
        },

        _offset: function (el) {
            var left = -el.offsetLeft,
                top = -el.offsetTop;

            while (el = el.offsetParent) {
                left -= el.offsetLeft;
                top -= el.offsetTop;
            }

            if (el != this.wrapper) {
                left *= this.scale;
                top *= this.scale;
            }

            return { left: left, top: top };
        },



        _bind: function (type, el, bubble) {
            _bindArr.concat([el || this.scroller, type, this]);
            (el || this.scroller).addEventListener(type, this, !!bubble);
        },

        _unbind: function (type, el, bubble) {
            (el || this.scroller).removeEventListener(type, this, !!bubble);
        },


        /**
         *
         * Public methods
         *
         */
        destroy: function () {
            var that = this;

            that.scroller.style[transform] = '';



            // Remove the event listeners
            that._unbind(RESIZE_EV, window);
            that._unbind(START_EV);
            that._unbind(MOVE_EV, window);
            that._unbind(END_EV, window);
            that._unbind(CANCEL_EV, window);



            if (that.options.useTransition) that._unbind(TRNEND_EV);

            if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);

            if (that.options.onDestroy) that.options.onDestroy.call(that);

            //清除所有绑定的事件
            for (var i = 0, l = _bindArr.length; i < l;) {
                _bindArr[i].removeEventListener(_bindArr[i + 1], _bindArr[i + 2]);
                _bindArr[i] = null;
                i = i + 3
            }
            _bindArr = [];

            //干掉外边的容器内容
            var div = doc.createElement('div');
            div.appendChild(this.wrapper);
            div.innerHTML = '';
            that.wrapper = that.scroller = div = null;
        },

        refresh: function () {
            var that = this,
                offset;



            that.wrapperW = that.wrapper.clientWidth || 1;
            that.wrapperH = that.wrapper.clientHeight || 1;

            that.minScrollY = -that.options.topOffset || 0;
            that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
            that.scrollerH = m.round((that.scroller.offsetHeight + that.minScrollY) * that.scale);
            that.maxScrollX = that.wrapperW - that.scrollerW;
            that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
            that.dirX = 0;
            that.dirY = 0;

            if (that.options.onRefresh) that.options.onRefresh.call(that);

            that.hScroll = that.options.hScroll && that.maxScrollX < 0;
            that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);


            offset = that._offset(that.wrapper);
            that.wrapperOffsetLeft = -offset.left;
            that.wrapperOffsetTop = -offset.top;


            that.scroller.style[transitionDuration] = '0';
            that._resetPos(400);
        },

        scrollTo: function (x, y, time, relative) {
            var that = this,
                step = x,
                i, l;

            that.stop();

            if (!step.length) step = [{ x: x, y: y, time: time, relative: relative }];

            for (i=0, l=step.length; i<l; i++) {
                if (step[i].relative) { step[i].x = that.x - step[i].x; step[i].y = that.y - step[i].y; }
                that.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });
            }

            that._startAni();
        },

        scrollToElement: function (el, time) {
            var that = this, pos;
            el = el.nodeType ? el : that.scroller.querySelector(el);
            if (!el) return;

            pos = that._offset(el);
            pos.left += that.wrapperOffsetLeft;
            pos.top += that.wrapperOffsetTop;

            pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
            pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;
            time = time === undefined ? m.max(m.abs(pos.left)*2, m.abs(pos.top)*2) : time;

            that.scrollTo(pos.left, pos.top, time);
        },

        scrollToPage: function (pageX, pageY, time) {
            var that = this, x, y;

            time = time === undefined ? 400 : time;

            if (that.options.onScrollStart) that.options.onScrollStart.call(that);


            x = -that.wrapperW * pageX;
            y = -that.wrapperH * pageY;
            if (x < that.maxScrollX) x = that.maxScrollX;
            if (y < that.maxScrollY) y = that.maxScrollY;


            that.scrollTo(x, y, time);
        },

        disable: function () {
            this.stop();
            this._resetPos(0);
            this.enabled = false;

            // If disabled after touchstart we make sure that there are no left over events
            this._unbind(MOVE_EV, window);
            this._unbind(END_EV, window);
            this._unbind(CANCEL_EV, window);
        },

        enable: function () {
            this.enabled = true;
        },

        stop: function () {
            if (this.options.useTransition) this._unbind(TRNEND_EV);
            else cancelFrame(this.aniTime);
            this.steps = [];
            this.moved = false;
            this.animating = false;
        },

        isReady: function () {
            return !this.moved &&  !this.animating;
        }
    };

    function prefixStyle (style) {
        if ( vendor === '' ) return style;

        style = style.charAt(0).toUpperCase() + style.substr(1);
        return vendor + style;
    }

    dummyStyle = null;	// for the sake of it

    if (typeof exports !== 'undefined') exports.iScroll = iScroll;
    else window.iScroll = iScroll;

    (function($){
        if(!$)return;
        var orgiScroll = iScroll,
            id = 0,
            cacheInstance = {};
        function createInstance(el,options){
            var uqid = 'iscroll' + id++;
            el.data('_iscroll_',uqid);
            return cacheInstance[uqid] = new orgiScroll(el[0],options)
        }
        window.iScroll = function(el,options){
            return createInstance($(typeof el == 'string' ? '#' + el : el),options)
        };
        $.fn.iScroll = function(method){
            var resultArr = [];
            this.each(function(i,el){
                if(typeof method == 'string'){
                    var instance = cacheInstance[$(el).data('_iscroll_')],pro;
                    if(instance && (pro = instance[method])){
                        var result = $.isFunction(pro) ? pro.apply(instance, Array.prototype.slice.call(arguments,1)) : pro;
                        if(result !== instance && result !== undefined){
                            resultArr.push(result);
                        }
                    }
                }else{
                    if(!$(el).data('_iscroll_'))
                        createInstance($(el),method)
                }
            });

            return resultArr.length ? resultArr : this;
        }
    })(window.Zepto || null)



})(window, document);
/**
 * Change list
 * 修改记录
 *
 * 1. 2012-08-14 解决滑动中按住停止滚动，松开后被点元素触发点击事件。
 *
 * 具体修改:
 * a. 202行 添加isStopScrollAction: false 给iScroll的原型上添加变量
 * b. 365行 _start方法里面添加that.isStopScrollAction = false; 默认让这个值为false
 * c. 390行 if (x != that.x || y != that.y)条件语句里面 添加了  that.isStopScrollAction = true; 当目标值与实际值不一致，说明还在滚动动画中
 * d. 554行 that.isStopScrollAction || (that.doubleTapTimer = setTimeout(function () {
 *          ......
 *          ......
 *          }, that.options.zoom ? 250 : 0));
 *   如果isStopScrollAction为true就不派送click事件
 *
 *
 * 2. 2012-08-14 给options里面添加speedScale属性，提供外部控制冲量滚动速度
 *
 * 具体修改
 * a. 108行 添加speedScale: 1, 给options里面添加speedScale属性，默认为1
 * b. 798行 speed = m.abs(dist) * this.options.speedScale / time, 在原来速度的基础上*speedScale来改变速度
 *
 * 3. 2012-08-21 修改部分代码，给iscroll_plugin墙用的
 *
 * 具体修改
 * a. 517行  在_pos之前，调用_beforePos,如果里面不返回true,  将不会调用_pos
 *  // internal for header scroll
 *  if (that._beforePos)
 *      that._beforePos(newY, deltaY) && that._pos(newX, newY);
 *  else
 *      that._pos(newX, newY);
 *
 * b. 680行 在滚动结束后调用 _afterPos.
 * // internal for header scroll
 * if (that._afterPos) that._afterPos();
 *
 * c. 106行构造器里面添加以下代码
 * // add var to this for header scroll
 * that.translateZ = translateZ;
 *
 * 为处理溢出
 * _bind 方法
 * destroy 方法
 * 最开头的 _bindArr = []
 *
 */
/**
 * @file GMU定制版iscroll，基于[iScroll 4.2.2](http://cubiq.org/iscroll-4), 去除zoom, pc兼容，snap, scrollbar等功能。同时把iscroll扩展到了Zepto的原型中。
 * @name iScroll
 * @import core/zepto.js
 * @desc GMU定制版iscroll，基于{@link[http://cubiq.org/iscroll-4] iScroll 4.2.2}, 去除zoom, pc兼容，snap, scrollbar等功能。同时把iscroll扩展到了***Zepto***的原型中。
 */

/**
 * @name iScroll
 * @grammar new iScroll(el,[options])  ⇒ self
 * @grammar $('selecotr').iScroll([options])  ⇒ zepto实例
 * @desc 将iScroll加入到了***$.fn***中，方便用Zepto的方式调用iScroll。
 * **el**
 * - ***el {String/ElementNode}*** iscroll容器节点
 *
 * **Options**
 * - ***hScroll*** {Boolean}: (可选, 默认: true)横向是否可以滚动
 * - ***vScroll*** {Boolean}: (可选, 默认: true)竖向是否可以滚动
 * - ***momentum*** {Boolean}: (可选, 默认: true)是否带有滚动效果
 * - ***checkDOMChanges*** {Boolean, 默认: false}: (可选)每个500毫秒判断一下滚动区域的容器是否有新追加的内容，如果有就调用refresh重新渲染一次
 * - ***useTransition*** {Boolean, 默认: false}: (可选)是否使用css3来来实现动画，默认是false,建议开启
 * - ***topOffset*** {Number}: (可选, 默认: 0)可滚动区域头部缩紧多少高度，默认是0， ***主要用于头部下拉加载更多时，收起头部的提示按钮***
 * @example
 * $('div').iscroll().find('selector').atrr({'name':'aaa'}) //保持链式调用
 * $('div').iScroll('refresh');//调用iScroll的方法
 * $('div').iScroll('scrollTo', 0, 0, 200);//调用iScroll的方法, 200ms内滚动到顶部
 */


/**
 * @name destroy
 * @desc 销毁iScroll实例，在原iScroll的destroy的基础上对创建的dom元素进行了销毁
 * @grammar destroy()  ⇒ undefined
 */

/**
 * @name refresh
 * @desc 更新iScroll实例，在滚动的内容增减时，或者可滚动区域发生变化时需要调用***refresh***方法来纠正。
 * @grammar refresh()  ⇒ undefined
 */

/**
 * @name scrollTo
 * @desc 使iScroll实例，在指定时间内滚动到指定的位置， 如果relative为true, 说明x, y的值是相对与当前位置的。
 * @grammar scrollTo(x, y, time, relative)  ⇒ undefined
 */
/**
 * @name scrollToElement
 * @desc 滚动到指定内部元素
 * @grammar scrollToElement(element, time)  ⇒ undefined
 * @grammar scrollToElement(selector, time)  ⇒ undefined
 */
/**
 * @name scrollToPage
 * @desc 跟scrollTo很像，这里传入的是百分比。
 * @grammar scrollToPage(pageX, pageY, time)  ⇒ undefined
 */
/**
 * @name disable
 * @desc 禁用iScroll
 * @grammar disable()  ⇒ undefined
 */
/**
 * @name enable
 * @desc 启用iScroll
 * @grammar enable()  ⇒ undefined
 */
/**
 * @name stop
 * @desc 定制iscroll滚动
 * @grammar stop()  ⇒ undefined
 */


/**
 *  @file 基于Zepto的位置设置获取组件
 *  @name position
 *  @desc 定位插件
 *  @import core/zepto.extend.js
 */
//offset
(function($, undefined){
    var _offset = $.fn.offset, offset ={};

    /**
     * @name offset
     * @grammar offset()  ⇒ array
     * @grammar offset(coordinates)  ⇒ self
     * @grammar offset(function(index, oldOffset){ ... })  ⇒ self
     * @desc 扩展offset方法，让它支持设置制定坐标。
     * @example $('p').offset({top: 50, left: 50});//将p设置到坐标点（50， 50）位置。
     *
     * $('p').offset(function(index, oldOffset){//将p的位置向做移动50px
     *     oldOffset.left -=50;
     *     return oldOffset;
     * });
     */
    $.fn.offset = function(options){
        //如果传入的不是object，则直接调用老的offset.
        if(!$.isPlainObject(options))return _offset.apply(this, arguments);
        //遍历调用offsets.setOffset。
        return this.each(function(i){
            offset.setOffset( this, options, i );
        });
    }

    //设置offset值
    offset.setOffset = function ( elem, options, i ) {
        var $el = $(elem),
            position = $el.css( "position"),
            curOffset = $el.offset(),
            curCSSTop = $el.css( "top" ),
            curCSSLeft = $el.css( "left" ),
            calculatePosition = ( position === "absolute" || position === "fixed" ) && ~$.inArray("auto", [curCSSTop, curCSSLeft]),
            props = {}, curPosition = {}, curTop, curLeft;

        //如果是static定位，则需要把定位设置成relative，否则top，left值无效。
        position === "static" && $el.css("position", "relative");

        //如果定位是absolute或者fixed，同时top或者left中存在auto定位。
        curPosition = calculatePosition?$el.position():curPosition;
        curTop = curPosition.top || parseFloat( curCSSTop ) || 0;
        curLeft = curPosition.left || parseFloat( curCSSLeft ) || 0;

        //如果options是一个方法，则调用此方法来获取options，同时传入当前offset
        options = $.isFunction( options )?options.call( elem, i, curOffset ):options;

        options.top != null && (props.top = options.top - curOffset.top + curTop);
        options.left != null && (props.left = options.left - curOffset.left + curLeft);

        "using" in options ? options.using.call( elem, props ): $el.css( props );
    }
})(Zepto);

//position
(function ($, undefined) {
    var _position = $.fn.position || function(){
            if (!this.length) return null;
            var offsetParent = this.offsetParent(),
                offset       = this.offset(),
                parentOffset = /^(?:body|html)$/i.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

            parentOffset.top  += parseFloat( offsetParent.css('border-top-width') ) || 0
            parentOffset.left += parseFloat( offsetParent.css('border-left-width') ) || 0

            return {
                top:  offset.top  - parentOffset.top,
                left: offset.left - parentOffset.left
            }
        },
        round = Math.round,
        rhorizontal = /left|center|right/,
        rvertical = /top|center|bottom/,
        roffset = /([\+\-]\d+%?)/,
        rposition = /^\w+/,
        rpercent = /%$/;

    function getOffsets( offsets, width, height ) {
        return [
            parseInt( offsets[ 0 ], 10 ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
            parseInt( offsets[ 1 ], 10 ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
        ];
    }

    function parseCss( elem, prop ) {
        return parseInt( elem.css( prop ), 10 ) || 0;
    }

    function getDimensions( elem ) {
        var raw = elem[0];
        return raw.nodeType === 9?{//如果是document
            width: elem.width(),
            height: elem.height(),
            top: 0,
            left: 0
        }: raw == window ? {//如果是window
            width: elem.width(),
            height: elem.height(),
            top: raw.pageYOffset,
            left: raw.pageXOffset
        }: raw.preventDefault && (raw = raw.touches?raw.touches[0]:raw) ? {//如果是event对象
            width: 0,
            height: 0,
            offset: { top: raw.pageY, left: raw.pageX }
        }: elem.offset();
    }

    function getWithinInfo(elem){
        var withinElem = $( elem = (elem || window) ),
            _isWindow = elem == window,
            offset = _isWindow? { left: 0, top: 0 } : withinElem.offset();
        return {
            element: withinElem,
            isWindow: _isWindow,
            offset: offset,
            width: offset.width || withinElem.width(),
            height: offset.height || withinElem.height(),
            scrollLeft: _isWindow?elem.pageXOffset:elem.scrollLeft,
            scrollTop: _isWindow?elem.pageYOffset:elem.scrollTop
        };
    }

    /**
     * @name position
     * @grammar position()  ⇒ array
     * @grammar position(opts)  ⇒ self
     * @desc 获取元素相对于相对父级元素（父级最近为position为relative｜abosolute｜fixed的元素）的坐标位置。
     *
     * 如果传入了opts，则把所选元素设置成制定位置。参数格式如下。
     * - ''my'' //默认为'center'// 设置中心点。可以为'left top', 'center bottom', 'right center'...
     *   同时还可以设置偏移量。如 'left+5 center-20%'。
     * - ''at'' //默认为'center'// 设置定位到目标元素的什么位置。参数格式同my参数一致。
     * - ''of'' //默认为null// 设置目标元素
     * - ''collision'' //默认为null// 碰撞检测回调方法。传入function.
     * - ''within'' //默认为window，碰撞检测对象。
     * - ''using''  传入function，如果没有传入position将通过css方法设置，可以传入一个function在方法中，通过animate方法来设置，这样就有了动画效果，而不是瞬间变化。
     */
    $.fn.position = function (opts) {
        if (!opts || !opts.of) {
            return _position.call(this);
        }
        opts = $.extend({}, opts);//弄个副本

        var atOffset, targetWidth, targetHeight, basePosition, dimensions,
            target = $( opts.of ), tmp, collision,
            within = getWithinInfo( opts.within ),
            offsets = {};

        dimensions = getDimensions( target );
        target[0].preventDefault && (opts.at = "left top");
        targetWidth = dimensions.width;
        targetHeight = dimensions.height;
        basePosition = {
            left: dimensions.left,
            top: dimensions.top
        };

        $.each( [ "my", "at" ], function() {
            var pos = ( opts[ this ] || "" ).split( " " );

            pos.length ===1 && pos[rhorizontal.test( pos[ 0 ] )?"push":"unshift"]("center");
            pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
            pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

            offsets[ this ] = [
                roffset.test(pos[ 0 ]) ? RegExp.$1 : 0,
                roffset.test(pos[ 1 ]) ? RegExp.$1 : 0
            ];
            opts[ this ] = [
                rposition.exec( pos[ 0 ] )[ 0 ],
                rposition.exec( pos[ 1 ] )[ 0 ]
            ];
        });

        basePosition.left += (tmp = opts.at[ 0 ]) === "right"?targetWidth:tmp == "center"?targetWidth / 2:0;
        basePosition.top += (tmp = opts.at[ 1 ]) === "bottom"?targetHeight:tmp == "center"?targetHeight / 2:0;

        atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
        basePosition.left += atOffset[ 0 ];
        basePosition.top += atOffset[ 1 ];

        return this.each(function() {
            var collisionPosition,
                elem = $( this ),
                offset = elem.offset(),
                tmp,
                elemWidth = offset.width,
                elemHeight = offset.height,
                marginLeft = parseCss( elem, "marginLeft" ),
                marginTop = parseCss( elem, "marginTop" ),
                collisionWidth = elemWidth + marginLeft + parseCss( elem, "marginRight" ),
                collisionHeight = elemHeight + marginTop + parseCss( elem, "marginBottom" ),
                position = $.extend( {}, basePosition ),
                myOffset = getOffsets( offsets.my, elemWidth, elemHeight );

            position.left -= (tmp = opts.my[ 0 ]) === "right"?elemWidth:tmp==="center"?elemWidth/2:0;
            position.top -= (tmp = opts.my[ 1 ]) === "bottom"?elemHeight:tmp==="center"?elemHeight/2:0;
            position.left += myOffset[ 0 ];
            position.top += myOffset[ 1 ];

            position.left = round(position.left);
            position.top = round(position.top);

            collisionPosition = {
                marginLeft: marginLeft,
                marginTop: marginTop
            };

            $.isFunction(collision = opts.collision) && collision.call(this, position, {
                targetWidth: targetWidth,
                targetHeight: targetHeight,
                elemWidth: elemWidth,
                elemHeight: elemHeight,
                collisionPosition: collisionPosition,
                collisionWidth: collisionWidth,
                collisionHeight: collisionHeight,
                offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
                my: opts.my,
                at: opts.at,
                within: within,
                elem : elem
            });
            elem.offset( $.extend( position, { using: opts.using } ) );
        });
    }
})(Zepto);
/**
 * @file 所有UI组件的基类，通过它可以简单的快速的创建新的组件。
 * @name UI 基类
 * @short Zepto UI
 * @desc 所有UI组件的基类，通过它可以简单的快速的创建新的组件。
 * @import core/zepto.js, core/zepto.extend.js
 */
(function($, undefined) {
    $.ui = $.ui || {
        version: '2.0.3',

        guid: _guid,

        /**
         * @name $.ui.define
         * @grammar $.ui.define(name, data[, superClass]) ⇒ undefined
         * @desc 定义组件,
         * - ''name'' 组件名称
         * - ''data'' 对象，设置此组件的prototype。可以添加属性或方法
         * - ''superClass'' 基类，指定此组件基于哪个现有组件，默认为Widget基类
         * **示例:**
         * <code type="javascript">
         * $.ui.define('helloworld', {
         *     _data: {
         *         opt1: null
         *     },
         *     enable: function(){
         *         //...
         *     }
         * });
         * </code>
         *
         * **定义完后，就可以通过以下方式使用了**
         *<code type="javascript">
         * var instance = $.ui.helloworld({opt1: true});
         * instance.enable();
         *
         * //或者
         * $('#id').helloworld({opt1:true});
         * //...later
         * $('#id').helloworld('enable');
         * </code>
         *
         * **Tips**
         * 1. 通过Zepto对象上的组件方法，可以直接实例话组件, 如: $('#btn').button({label: 'abc'});
         * 2. 通过Zepto对象上的组件方法，传入字符串this, 可以获得组件实例，如：var btn = $('#btn').button('this');
         * 3. 通过Zepto对象上的组件方法，可以直接调用组件方法，第一个参数用来指定方法名，之后的参数作为方法参数，如: $('#btn').button('setIcon', 'home');
         * 4. 在子类中，如覆写了某个方法，可以在方法中通过this.$super()方法调用父级方法。如：this.$super('enable');
         */
        define: function(name, data, superClass) {
            if(superClass) data.inherit = superClass;
            var Class = $.ui[name] = _createClass(function(el, options) {
                var obj = _createObject(Class.prototype, {
                    _id: $.parseTpl(tpl, {
                        name: name,
                        id: _guid()
                    })
                });
                obj._createWidget.call(obj, el, options,Class.plugins);
                return obj;
            }, data);
            return _zeptoLize(name, Class);
        },

        /**
         * @name $.ui.isWidget()
         * @grammar $.ui.isWidget(obj) ⇒ boolean
         * @grammar $.ui.isWidget(obj, name) ⇒ boolean
         * @desc 判断obj是不是widget实例
         *
         * **参数**
         * - ''obj'' 用于检测的对象
         * - ''name'' 可选，默认监测是不是''widget''(基类)的实例，可以传入组件名字如''button''。作用将变为obj是不是button组件实例。
         * @param obj
         * @param name
         * @example
         *
         * var btn = $.ui.button(),
         *     dialog = $.ui.dialog();
         *
         * console.log($.isWidget(btn)); // => true
         * console.log($.isWidget(dialog)); // => true
         * console.log($.isWidget(btn, 'button')); // => true
         * console.log($.isWidget(dialog, 'button')); // => false
         * console.log($.isWidget(btn, 'noexist')); // => false
         */
        isWidget: function(obj, name){
            return obj instanceof (name===undefined ? _widget: $.ui[name] || _blankFn);
        }
    };

    var id = 1,
        _blankFn = function(){},
        tpl = '<%=name%>-<%=id%>',
        uikey = 'gmu-widget';
        
    /**
     * generate guid
     */
    function _guid() {
        return id++;
    };

    function _createObject(proto, data) {
        var obj = {};
        Object.create ? obj = Object.create(proto) : obj.__proto__ = proto;
        return $.extend(obj, data || {});
    }

    function _createClass(Class, data) {
        if (data) {
            _process(Class, data);
            $.extend(Class.prototype, data);
        }
        return $.extend(Class, {
            plugins: [],
            register: function(fn) {
                if ($.isObject(fn)) {
                    $.extend(this.prototype,fn);
                    return;
                }
                this.plugins.push(fn);
            }
        });
    }

    /**
     * handle inherit & _data
     */
    function _process(Class, data) {
        var superClass = data.inherit || _widget,
            proto = superClass.prototype,
            obj;
        obj = Class.prototype = _createObject(proto, {
            $factory: Class,
            $super: function(key) {
                var fn = proto[key];
                return $.isFunction(fn) ? fn.apply(this, $.slice(arguments, 1)) : fn;
            }
        });
        obj._data = $.extend({}, proto._data, data._data);
        delete data._data;
        return Class;
    }

    /**
     * 强制setup模式
     * @grammar $(selector).dialog(opts);
     */
    function _zeptoLize(name) {
        $.fn[name] = function(opts) {

            var ret, obj,args = $.slice(arguments, 1);
            $.each(this,function(i,el){
                obj = $(el).data(uikey + name) ||  $.ui[name](el, $.extend($.isPlainObject(opts) ?  opts : {},{
                    setup: true
                }));
                if ($.isString(opts)) {
                    ret = $.isFunction(obj[opts]) && obj[opts].apply(obj, args);
                    if (opts == 'this' || ret !== obj && ret !== undefined) {
                        return false;
                    }
                    ret = null;
                }
            });
            //ret 为真就是要返回ui实例之外的内容
            //obj 'this'时返回
            //其他都是返回zepto实例
            return ret || (opts == 'this' ? obj : this);
        };
    }
    /**
     * @name widget基类
     * @desc GMU所有的组件都是此类的子类，即以下此类里面的方法都可在其他组建中调用。
     */
    var _widget = function() {};
    $.extend(_widget.prototype, {
        _data: {
            status: true
        },

        /**
         * @name data
         * @grammar data(key) ⇒ value
         * @grammar data(key, value) ⇒ value
         * @desc 设置或者获取options, 所有组件中的配置项都可以通过此方法得到。
         * @example
         * $('a#btn').button({label: '按钮'});
         * console.log($('a#btn').button('data', 'label'));// => 按钮
         */
        data: function(key, val) {
            var _data = this._data;
            if ($.isObject(key)) return $.extend(_data, key);
            else return !$.isUndefined(val) ? _data[key] = val : _data[key];
        },

        /**
         * common constructor
         */
        _createWidget: function(el, opts,plugins) {

            if ($.isObject(el)) {
                opts = el || {};
                el = undefined;
            }

            var data = $.extend({}, this._data, opts);
            $.extend(this, {
                _el: el ? $(el) : undefined,
                _data: data
            });

            //触发plugins
            var me = this;
            $.each(plugins,function(i,fn){
                var result = fn.apply(me);
                if(result && $.isPlainObject(result)){
                    var plugins = me._data.disablePlugin;
                    if(!plugins || $.isString(plugins) && plugins.indexOf(result.pluginName) == -1){
                        delete result.pluginName
                        $.each(result,function(key,val){
                            var orgFn;
                            if((orgFn = me[key]) && $.isFunction(val)){
                                me[key] = function(){
                                    me[key + 'Org'] = orgFn;
                                    return val.apply(me,arguments);
                                }
                            }else
                                me[key] = val;
                        })
                    }
                }
            });
            // use setup or render
            if(data.setup) this._setup(el && el.getAttribute('data-mode'));
            else this._create();
            this._init();
            

            var me = this,
                $el = this.trigger('init').root();
            $el.on('tap', function(e) {
                (e['bubblesList'] || (e['bubblesList'] = [])).push(me);
            });
            // record this
            $el.data(uikey + this._id.split('-')[0],this);
        },

        /**
         * @interface: use in render mod
         * @name _create
         * @desc 接口定义，子类中需要重新实现此方法，此方法在render模式时被调用。
         *
         * 所谓的render方式，即，通过以下方式初始化组件
         * <code>
         * $.ui.widgetName(options);
         * </code>
         */
        _create: function() {},

        /**
         * @interface: use in setup mod
         * @param {Boolean} data-mode use tpl mode
         * @name _setup
         * @desc 接口定义，子类中需要重新实现此方法，此方法在setup模式时被调用。第一个行参用来分辨时fullsetup，还是setup
         *
         * <code>
         * $.ui.define('helloworld', {
         *     _setup: function(mode){
         *          if(mode){
         *              //为fullsetup模式
         *          } else {
         *              //为setup模式
         *          }
         *     }
         * });
         * </code>
         *
         * 所谓的setup方式，即，先有dom，然后通过选择器，初始化Zepto后，在Zepto对象直接调用组件名方法实例化组件，如
         * <code>
         * //<div id="widget"></div>
         * $('#widget').widgetName(options);
         * </code>
         *
         * 如果用来初始化的element，设置了data-mode="true"，组件将以fullsetup模式初始化
         */
        _setup: function(mode) {},

        /**
         * @name root
         * @grammar root() ⇒ value
         * @grammar root(el) ⇒ value
         * @desc 设置或者获取根节点
         * @example
         * $('a#btn').button({label: '按钮'});
         * console.log($('a#btn').button('root'));// => a#btn
         */
        root: function(el) {
            return this._el = el || this._el;
        },

        /**
         * @name id
         * @grammar id() ⇒ value
         * @grammar id(id) ⇒ value
         * @desc 设置或者获取组件id
         */
        id: function(id) {
            return this._id = id || this._id;
        },

        /**
         * @name destroy
         * @grammar destroy() ⇒ undefined
         * @desc 注销组件
         */
        destroy: function() {
            var That = this,
                $el;
            $.each(this.data('components') || [], function(id, obj) {
                obj.destroy();
            });
            $el = this.trigger('destroy').off().root();
            $el.find('*').off();
            $el.removeData(uikey).off();
            this.__proto__ = null;
            $.each(this, function(key, val) {
                delete That[key];
            });
        },

        /**
         * @name component
         * @grammar component() ⇒ array
         * @grammar component(subInstance) ⇒ instance
         * @grammar component(createFn) ⇒ instance
         * @desc 获取或者设置子组件, createFn为组件构造器，必须返回组件的实例。
         */
        component: function(createFn) {
            var list = this.data('components') || this.data('components', []);
            try {
                list.push($.isFunction(createFn) ? createFn.apply(this) : createFn);
            } catch(e) {}
            return this;
        },

        /**
         * @name on
         * @grammar on(type, handler) ⇒ instance
         * @desc 绑定事件，此事件绑定不同于zepto上绑定事件，此On的this只想组件实例，而非zepto实例
         */
        on: function(ev, callback) {
            this.root().on(ev, $.proxy(callback, this));
            return this;
        },

        /**
         * @name off
         * @grammar off(type) ⇒ instance
         * @grammar off(type, handler) ⇒ instance
         * @desc 解绑事件
         */
        off: function(ev, callback) {
            this.root().off(ev, callback);
            return this;
        },

        /**
         * @name trigger
         * @grammar trigger(type[, data]) ⇒ instance
         * @desc 触发事件, 此trigger会优先把options上的事件回调函数先执行，然后给根DOM派送事件。
         * options上回调函数可以通过e.preventDefaualt()来组织事件派发。
         */
        trigger: function(event, data) {
            event = $.isString(event) ? $.Event(event) : event;
            var onEvent = this.data(event.type),result;
            if( onEvent && $.isFunction(onEvent) ){
                event.data = data;
                result = onEvent.apply(this, [event].concat(data));
                if(result === false || event.defaultPrevented){
                    return this;
                }
            }
            this.root().trigger(event, data);
            return this;
        }
    });
})(Zepto);
~ function(a) {
    var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p = [];
    b = {
        email: function(a) {
            return /^(?:[a-z0-9]+[_\-+.]+)*[a-z0-9]+@(?:([a-z0-9]+-?)*[a-z0-9]+.)+([a-z]{2,})+$/i.test(a)
        },
        date: function(a) {
            var b, c, d, e, f, g = /^([1-2]\d{3})([-/.])?(1[0-2]|0?[1-9])([-/.])?([1-2]\d|3[01]|0?[1-9])$/;
            return g.test(a) ? (b = g.exec(a), d = +b[1], e = +b[3] - 1, f = +b[5], c = new Date(d, e, f), d === c.getFullYear() && e === c.getMonth() && f === c.getDate()) : !1
        },
        mobile: function(a) {
            return /^1[3-9]\d{9}$/.test(a)
        },
        tel: function(a) {
            return /^(?:(?:0\d{2,3}[- ]?[1-9]\d{6,7})|(?:[48]00[- ]?[1-9]\d{6}))$/.test(a)
        },
        number: function(b) {
            var c = a.trim(this.$item.attr("min")),
                d = a.trim(this.$item.attr("max")),
                e = /^\-?(?:[1-9]\d*|0)(?:[.]\d+)?$/.test(b),
                f = +b,
                g = a.trim(this.$item.attr("step"));
            return c = "" === c || isNaN(c) ? f - 1 : +c, d = "" === d || isNaN(d) ? f + 1 : +d, g = "" === g || isNaN(g) ? 0 : +g, e && (0 >= g ? f >= c && d >= f : 0 === (f + c) % g && f >= c && d >= f)
        },
        range: function(a) {
            return this.number(a)
        },
        url: function() {
            var a = "((https?|s?ftp|irc[6s]?|git|afp|telnet|smb):\\/\\/)?",
                b = "([a-z0-9]\\w*(\\:[\\S]+)?\\@)?",
                c = "(?:localhost|(?:[a-z0-9]+(?:[-\\w]*[a-z0-9])?(?:\\.[a-z0-9][-\\w]*[a-z0-9])*)*\\.[a-z]{2,})",
                d = "(:\\d{1,5})?",
                e = "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}",
                f = "(\\/\\S*)?",
                g = [a, b, c, d, f],
                h = [a, b, e, d, f],
                i = new RegExp("^" + g.join("") + "$", "i"),
                j = new RegExp("^" + h.join("") + "$", "i");
            return function(a) {
                return i.test(a) || j.test(a)
            }
        }(),
        password: function(a) {
            return this.text(a)
        },
        checkbox: function() {
            return b._checker("checkbox")
        },
        radio: function() {
            return b._checker("radio")
        },
        _checker: function(b) {
            var c = this.$item.parents("form").eq(0),
                d = "input[type=" + b + '][name="' + this.$item.attr("name") + '"]',
                e = !1,
                f = a(d, c);
            return f.each(function(a, b) {
                return b.checked && !e ? e = !0 : void 0
            }), e
        },
        text: function(b) {
            if ((b = a.trim(b)).length) {
                var c, d = parseInt(this.$item.attr("maxlength"), 10),
                    e = parseInt(this.$item.attr("minlength"), 10);
                return (c = function() {
                    var a = !0,
                        c = b.length;
                    return e && (a = c >= e), d && (a = a && d >= c), a
                })()
            }
        }
    }, l = function(b, c, d) {
        var e = b.data(),
            f = e.url,
            g = e.method || "get",
            h = e.key || "key",
            i = m(b),
            j = {};
        j[h] = i, a[g](f, j).success(function(a) {
            var e = a ? "IM VALIDED" : "unvalid";
            return o.call(this, b, c, d, e)
        }).error(function() {})
    }, n = function(b, c, d) {
        var e = "a" === b.data("aorb") ? "b" : "a",
            g = a("[data-aorb=" + e + "]", b.parents("form").eq(0)),
            h = [b, c, d],
            i = [g, c, d],
            j = 0;
        return j += o.apply(this, h) ? 0 : 1, j += o.apply(this, i) ? 0 : 1, j = j > 0 ? (f.apply(this, h), f.apply(this, i), !1) : o.apply(this, h.concat("unvalid"))
    }, o = function(c, d, g, h) {
        if (!c) return "DONT VALIDATE UNEXIST ELEMENT";
        var i, j, k, l, n;
        return i = c.attr("pattern"), i && i.replace("\\", "\\\\"), j = c.attr("type") || "text", j = b[j] ? j : "text", k = a.trim(m(c)), n = c.data("event"), h = h ? h : i ? new RegExp(i).test(k) || "unvalid" : b[j](k) || "unvalid", "unvalid" === h && f(c, d, g), /^(?:unvalid|empty)$/.test(h) ? (l = {
            $el: e.call(this, c, d, g, h),
            type: j,
            error: h
        }, c.trigger("after:" + n, c), l) : (f.call(this, c, d, g), c.trigger("after:" + n, c), !1)
    }, c = function(b, c) {
        return a(b, c)
    }, m = function(a) {
        return a.val() || (a.is("[contenteditable]") ? a.text() : "")
    }, i = function(a, c, d) {
        var e, f, g, h, i, j;
        return b.$item = a, g = a.attr("type"), h = m(a), e = a.data("url"), f = a.data("aorb"), j = a.data("event"), i = [a, c, d], j && a.trigger("before:" + j, a), /^(?:radio|checkbox)$/.test(g) || f || b.text(h) ? f ? n.apply(this, i) : e ? l.apply(this, i) : o.call(this, a, c, d) : o.call(this, a, c, d, h.length ? "unvalid" : "empty")
    }, j = function(b, c, d, e) {
        var f, g = /^radio|checkbox/;
        a.each(b, function(b, h) {
            a(h).on(g.test(h.type) || "SELECT" === h.tagName ? "change blur" : c, function() {
                var b = a(this);
                g.test(this.type) && (b = a("input[type=" + this.type + "][name=" + this.name + "]", b.closest("form"))), b.each(function() {
                    (f = i.call(this, a(this), d, e)) && p.push(f)
                })
            })
        })
    }, h = function(b, c, d, e) {
        return c && !j.length ? !0 : (p = a.map(b, function(b) {
            var c = i.call(null, a(b), d, e);
            return c ? c : void 0
        }), j.length ? p : !1)
    }, k = function(b) {
        var c, d;
        return (c = a.grep(p, function(a) {
            return a.$el = b
        })[0]) ? (d = a.inArray(c, p), p.splice(d, 1), p) : void 0
    }, d = function(a, b) {
        return a.data("parent") ? a.closest(a.data("parent")) : b ? a.parent() : a
    }, e = function(a, b, c, e) {
        return d(a, c).addClass(b + " " + e)
    }, f = function(a, b, c) {
        return k.call(this, a), d(a, c).removeClass(b + " empty unvalid")
    }, g = function(a) {
        return a.attr("novalidate") || a.attr("novalidate", "true")
    }, a.fn.validator = function(b) {
        var d = this,
            e = b || {},
            i = e.identifie || "[required]",
            k = e.error || "error",
            l = e.isErrorOnParent || !1,
            m = e.method || "blur",
            n = e.before || function() {
                return !0
            },
            o = e.after || function() {
                return !0
            },
            q = e.errorCallback || function() {},
            r = c(i, d);
        g(d), m && j.call(this, r, m, k, l), d.on("focusin", i, function() {
            f.call(this, a(this), "error unvalid empty", l)
        }), d.on("submit", function(a) {
            return n.call(this, r), h.call(this, r, m, k, l), p.length ? (a.preventDefault(), q.call(this, p)) : o.call(this, a, r)
        })
    }
}(window.jQuery || window.Zepto);
//# sourceMappingURL=validator.min.js.map

//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [lofter-Yates shuffle](http://en.wikipedia.org/wiki/lofter–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

function FastClick(b){var c,a=this;this.trackingClick=false;this.trackingClickStart=0;this.targetElement=null;this.touchStartX=0;this.touchStartY=0;this.lastTouchIdentifier=0;this.touchBoundary=10;this.layer=b;if(!b||!b.nodeType){throw new TypeError("Layer must be a document node")}this.onClick=function(){return FastClick.prototype.onClick.apply(a,arguments)};this.onMouse=function(){return FastClick.prototype.onMouse.apply(a,arguments)};this.onTouchStart=function(){return FastClick.prototype.onTouchStart.apply(a,arguments)};this.onTouchMove=function(){return FastClick.prototype.onTouchMove.apply(a,arguments)};this.onTouchEnd=function(){return FastClick.prototype.onTouchEnd.apply(a,arguments)};this.onTouchCancel=function(){return FastClick.prototype.onTouchCancel.apply(a,arguments)};if(FastClick.notNeeded(b)){return}if(this.deviceIsAndroid){b.addEventListener("mouseover",this.onMouse,true);b.addEventListener("mousedown",this.onMouse,true);b.addEventListener("mouseup",this.onMouse,true)}b.addEventListener("click",this.onClick,true);b.addEventListener("touchstart",this.onTouchStart,false);b.addEventListener("touchmove",this.onTouchMove,false);b.addEventListener("touchend",this.onTouchEnd,false);b.addEventListener("touchcancel",this.onTouchCancel,false);if(!Event.prototype.stopImmediatePropagation){b.removeEventListener=function(e,g,d){var f=Node.prototype.removeEventListener;if(e==="click"){f.call(b,e,g.hijacked||g,d)}else{f.call(b,e,g,d)}};b.addEventListener=function(f,g,e){var d=Node.prototype.addEventListener;if(f==="click"){d.call(b,f,g.hijacked||(g.hijacked=function(h){if(!h.propagationStopped){g(h)}}),e)}else{d.call(b,f,g,e)}}}if(typeof b.onclick==="function"){c=b.onclick;b.addEventListener("click",function(d){c(d)},false);b.onclick=null}}FastClick.prototype.deviceIsAndroid=navigator.userAgent.indexOf("Android")>0;FastClick.prototype.deviceIsIOS=/iP(ad|hone|od)/.test(navigator.userAgent);FastClick.prototype.deviceIsIOS4=FastClick.prototype.deviceIsIOS&&(/OS 4_\d(_\d)?/).test(navigator.userAgent);FastClick.prototype.deviceIsIOSWithBadTarget=FastClick.prototype.deviceIsIOS&&(/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);FastClick.prototype.needsClick=function(a){switch(a.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(a.disabled){return true}break;case"input":if((this.deviceIsIOS&&a.type==="file")||a.disabled){return true}break;case"label":case"video":return true}return(/\bneedsclick\b/).test(a.className)};FastClick.prototype.needsFocus=function(a){switch(a.nodeName.toLowerCase()){case"textarea":case"select":return true;case"input":switch(a.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return false}return !a.disabled&&!a.readOnly;default:return(/\bneedsfocus\b/).test(a.className)}};FastClick.prototype.sendClick=function(b,c){var a,d;if(document.activeElement&&document.activeElement!==b){document.activeElement.blur()}d=c.changedTouches[0];a=document.createEvent("MouseEvents");a.initMouseEvent("click",true,true,window,1,d.screenX,d.screenY,d.clientX,d.clientY,false,false,false,false,0,null);a.forwardedTouchEvent=true;b.dispatchEvent(a)};FastClick.prototype.focus=function(a){var b;if(this.deviceIsIOS&&a.setSelectionRange){b=a.value.length;a.setSelectionRange(b,b)}else{a.focus()}};FastClick.prototype.updateScrollParent=function(b){var c,a;c=b.fastClickScrollParent;if(!c||!c.contains(b)){a=b;do{if(a.scrollHeight>a.offsetHeight){c=a;b.fastClickScrollParent=a;break}a=a.parentElement}while(a)}if(c){c.fastClickLastScrollTop=c.scrollTop}};FastClick.prototype.getTargetElementFromEventTarget=function(a){if(a.nodeType===Node.TEXT_NODE){return a.parentNode}return a};FastClick.prototype.onTouchStart=function(c){var a,d,b;if(c.targetTouches.length>1){return true}a=this.getTargetElementFromEventTarget(c.target);d=c.targetTouches[0];if(this.deviceIsIOS){b=window.getSelection();if(b.rangeCount&&!b.isCollapsed){return true}if(!this.deviceIsIOS4){if(d.identifier===this.lastTouchIdentifier){c.preventDefault();return false}this.lastTouchIdentifier=d.identifier;this.updateScrollParent(a)}}this.trackingClick=true;this.trackingClickStart=c.timeStamp;this.targetElement=a;this.touchStartX=d.pageX;this.touchStartY=d.pageY;if((c.timeStamp-this.lastClickTime)<200){c.preventDefault()}return true};FastClick.prototype.touchHasMoved=function(a){var c=a.changedTouches[0],b=this.touchBoundary;if(Math.abs(c.pageX-this.touchStartX)>b||Math.abs(c.pageY-this.touchStartY)>b){return true}return false};FastClick.prototype.onTouchMove=function(a){if(!this.trackingClick){return true}if(this.targetElement!==this.getTargetElementFromEventTarget(a.target)||this.touchHasMoved(a)){this.trackingClick=false;this.targetElement=null}return true};FastClick.prototype.findControl=function(a){if(a.control!==undefined){return a.control}if(a.htmlFor){return document.getElementById(a.htmlFor)}return a.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")};FastClick.prototype.onTouchEnd=function(c){var e,d,b,g,f,a=this.targetElement;
    if(!this.trackingClick){return true}if((c.timeStamp-this.lastClickTime)<200){this.cancelNextClick=true;return true}this.lastClickTime=c.timeStamp;d=this.trackingClickStart;this.trackingClick=false;this.trackingClickStart=0;if(this.deviceIsIOSWithBadTarget){f=c.changedTouches[0];a=document.elementFromPoint(f.pageX-window.pageXOffset,f.pageY-window.pageYOffset)||a;a.fastClickScrollParent=this.targetElement.fastClickScrollParent}b=a.tagName.toLowerCase();if(b==="label"){e=this.findControl(a);if(e){this.focus(a);if(this.deviceIsAndroid){return false}a=e}}else{if(this.needsFocus(a)){if((c.timeStamp-d)>100||(this.deviceIsIOS&&window.top!==window&&b==="input")){this.targetElement=null;return false}this.focus(a);if(!this.deviceIsIOS4||b!=="select"){this.targetElement=null;c.preventDefault()}return false}}if(this.deviceIsIOS&&!this.deviceIsIOS4){g=a.fastClickScrollParent;if(g&&g.fastClickLastScrollTop!==g.scrollTop){return true}}if(!this.needsClick(a)){c.preventDefault();this.sendClick(a,c)}return false};FastClick.prototype.onTouchCancel=function(){this.trackingClick=false;this.targetElement=null};FastClick.prototype.onMouse=function(a){if(!this.targetElement){return true}if(a.forwardedTouchEvent){return true}if(!a.cancelable){return true}if(!this.needsClick(this.targetElement)||this.cancelNextClick){if(a.stopImmediatePropagation){a.stopImmediatePropagation()}else{a.propagationStopped=true}a.stopPropagation();a.preventDefault();return false}return true};FastClick.prototype.onClick=function(a){var b;if(this.trackingClick){this.targetElement=null;this.trackingClick=false;return true}if(a.target.type==="submit"&&a.detail===0){return true}b=this.onMouse(a);if(!b){this.targetElement=null}return b};FastClick.prototype.destroy=function(){var a=this.layer;if(this.deviceIsAndroid){a.removeEventListener("mouseover",this.onMouse,true);a.removeEventListener("mousedown",this.onMouse,true);a.removeEventListener("mouseup",this.onMouse,true)}a.removeEventListener("click",this.onClick,true);a.removeEventListener("touchstart",this.onTouchStart,false);a.removeEventListener("touchmove",this.onTouchMove,false);a.removeEventListener("touchend",this.onTouchEnd,false);a.removeEventListener("touchcancel",this.onTouchCancel,false)};FastClick.notNeeded=function(b){var a;if(typeof window.ontouchstart==="undefined"){return true}if((/Chrome\/[0-9]+/).test(navigator.userAgent)){if(FastClick.prototype.deviceIsAndroid){a=document.querySelector("meta[name=viewport]");if(a&&a.content.indexOf("user-scalable=no")!==-1){return true}}else{return true}}if(b.style.msTouchAction==="none"){return true}return false};FastClick.attach=function(a){return new FastClick(a)};if(typeof define!=="undefined"&&define.amd){define(function(){return FastClick})}else{if(typeof module!=="undefined"&&module.exports){module.exports=FastClick.attach;module.exports.FastClick=FastClick}else{window.FastClick=FastClick}};
!function(a,b){"function"==typeof define&&(define.amd||define.cmd)?define(function(){return b(a)}):b(a,!0)}(this,function(a,b){function c(b,c,d){a.WeixinJSBridge?WeixinJSBridge.invoke(b,e(c),function(a){g(b,a,d)}):j(b,d)}function d(b,c,d){a.WeixinJSBridge?WeixinJSBridge.on(b,function(a){d&&d.trigger&&d.trigger(a),g(b,a,c)}):d?j(b,d):j(b,c)}function e(a){return a=a||{},a.appId=z.appId,a.verifyAppId=z.appId,a.verifySignType="sha1",a.verifyTimestamp=z.timestamp+"",a.verifyNonceStr=z.nonceStr,a.verifySignature=z.signature,a}function f(a){return{timeStamp:a.timestamp+"",nonceStr:a.nonceStr,"package":a.package,paySign:a.paySign,signType:a.signType||"SHA1"}}function g(a,b,c){var d,e,f;switch(delete b.err_code,delete b.err_desc,delete b.err_detail,d=b.errMsg,d||(d=b.err_msg,delete b.err_msg,d=h(a,d),b.errMsg=d),c=c||{},c._complete&&(c._complete(b),delete c._complete),d=b.errMsg||"",z.debug&&!c.isInnerInvoke&&alert(JSON.stringify(b)),e=d.indexOf(":"),f=d.substring(e+1)){case"ok":c.success&&c.success(b);break;case"cancel":c.cancel&&c.cancel(b);break;default:c.fail&&c.fail(b)}c.complete&&c.complete(b)}function h(a,b){var e,f,c=a,d=p[c];return d&&(c=d),e="ok",b&&(f=b.indexOf(":"),e=b.substring(f+1),"confirm"==e&&(e="ok"),"failed"==e&&(e="fail"),-1!=e.indexOf("failed_")&&(e=e.substring(7)),-1!=e.indexOf("fail_")&&(e=e.substring(5)),e=e.replace(/_/g," "),e=e.toLowerCase(),("access denied"==e||"no permission to execute"==e)&&(e="permission denied"),"config"==c&&"function not exist"==e&&(e="ok"),""==e&&(e="fail")),b=c+":"+e}function i(a){var b,c,d,e;if(a){for(b=0,c=a.length;c>b;++b)d=a[b],e=o[d],e&&(a[b]=e);return a}}function j(a,b){if(!(!z.debug||b&&b.isInnerInvoke)){var c=p[a];c&&(a=c),b&&b._complete&&delete b._complete,console.log('"'+a+'",',b||"")}}function k(){if(!("6.0.2">w||y.systemType<0)){var b=new Image;y.appId=z.appId,y.initTime=x.initEndTime-x.initStartTime,y.preVerifyTime=x.preVerifyEndTime-x.preVerifyStartTime,C.getNetworkType({isInnerInvoke:!0,success:function(a){y.networkType=a.networkType;var c="https://open.weixin.qq.com/sdk/report?v="+y.version+"&o="+y.isPreVerifyOk+"&s="+y.systemType+"&c="+y.clientVersion+"&a="+y.appId+"&n="+y.networkType+"&i="+y.initTime+"&p="+y.preVerifyTime+"&u="+y.url;b.src=c}})}}function l(){return(new Date).getTime()}function m(b){t&&(a.WeixinJSBridge?b():q.addEventListener&&q.addEventListener("WeixinJSBridgeReady",b,!1))}function n(){C.invoke||(C.invoke=function(b,c,d){a.WeixinJSBridge&&WeixinJSBridge.invoke(b,e(c),d)},C.on=function(b,c){a.WeixinJSBridge&&WeixinJSBridge.on(b,c)})}var o,p,q,r,s,t,u,v,w,x,y,z,A,B,C;if(!a.jWeixin)return o={config:"preVerifyJSAPI",onMenuShareTimeline:"menu:share:timeline",onMenuShareAppMessage:"menu:share:appmessage",onMenuShareQQ:"menu:share:qq",onMenuShareWeibo:"menu:share:weiboApp",onMenuShareQZone:"menu:share:QZone",previewImage:"imagePreview",getLocation:"geoLocation",openProductSpecificView:"openProductViewWithPid",addCard:"batchAddCard",openCard:"batchViewCard",chooseWXPay:"getBrandWCPayRequest"},p=function(){var b,a={};for(b in o)a[o[b]]=b;return a}(),q=a.document,r=q.title,s=navigator.userAgent.toLowerCase(),t=-1!=s.indexOf("micromessenger"),u=-1!=s.indexOf("android"),v=-1!=s.indexOf("iphone")||-1!=s.indexOf("ipad"),w=function(){var a=s.match(/micromessenger\/(\d+\.\d+\.\d+)/)||s.match(/micromessenger\/(\d+\.\d+)/);return a?a[1]:""}(),x={initStartTime:l(),initEndTime:0,preVerifyStartTime:0,preVerifyEndTime:0},y={version:1,appId:"",initTime:0,preVerifyTime:0,networkType:"",isPreVerifyOk:1,systemType:v?1:u?2:-1,clientVersion:w,url:encodeURIComponent(location.href)},z={},A={_completes:[]},B={state:0,res:{}},m(function(){x.initEndTime=l()}),C={config:function(a){z=a,j("config",a);var b=z.check===!1?!1:!0;m(function(){var a,d,e;if(b)c(o.config,{verifyJsApiList:i(z.jsApiList)},function(){A._complete=function(a){x.preVerifyEndTime=l(),B.state=1,B.res=a},A.success=function(){y.isPreVerifyOk=0},A.fail=function(a){A._fail?A._fail(a):B.state=-1};var a=A._completes;return a.push(function(){z.debug||k()}),A.complete=function(){for(var c=0,d=a.length;d>c;++c)a[c]();A._completes=[]},A}()),x.preVerifyStartTime=l();else{for(B.state=1,a=A._completes,d=0,e=a.length;e>d;++d)a[d]();A._completes=[]}}),z.beta&&n()},ready:function(a){0!=B.state?a():(A._completes.push(a),!t&&z.debug&&a())},error:function(a){"6.0.2">w||(-1==B.state?a(B.res):A._fail=a)},checkJsApi:function(a){var b=function(a){var c,d,b=a.checkResult;for(c in b)d=p[c],d&&(b[d]=b[c],delete b[c]);return a};c("checkJsApi",{jsApiList:i(a.jsApiList)},function(){return a._complete=function(a){if(u){var c=a.checkResult;c&&(a.checkResult=JSON.parse(c))}a=b(a)},a}())},onMenuShareTimeline:function(a){d(o.onMenuShareTimeline,{complete:function(){c("shareTimeline",{title:a.title||r,desc:a.title||r,img_url:a.imgUrl||"",link:a.link||location.href,type:a.type||"link",data_url:a.dataUrl||""},a)}},a)},onMenuShareAppMessage:function(a){d(o.onMenuShareAppMessage,{complete:function(){c("sendAppMessage",{title:a.title||r,desc:a.desc||"",link:a.link||location.href,img_url:a.imgUrl||"",type:a.type||"link",data_url:a.dataUrl||""},a)}},a)},onMenuShareQQ:function(a){d(o.onMenuShareQQ,{complete:function(){c("shareQQ",{title:a.title||r,desc:a.desc||"",img_url:a.imgUrl||"",link:a.link||location.href},a)}},a)},onMenuShareWeibo:function(a){d(o.onMenuShareWeibo,{complete:function(){c("shareWeiboApp",{title:a.title||r,desc:a.desc||"",img_url:a.imgUrl||"",link:a.link||location.href},a)}},a)},onMenuShareQZone:function(a){d(o.onMenuShareQZone,{complete:function(){c("shareQZone",{title:a.title||r,desc:a.desc||"",img_url:a.imgUrl||"",link:a.link||location.href},a)}},a)},startRecord:function(a){c("startRecord",{},a)},stopRecord:function(a){c("stopRecord",{},a)},onVoiceRecordEnd:function(a){d("onVoiceRecordEnd",a)},playVoice:function(a){c("playVoice",{localId:a.localId},a)},pauseVoice:function(a){c("pauseVoice",{localId:a.localId},a)},stopVoice:function(a){c("stopVoice",{localId:a.localId},a)},onVoicePlayEnd:function(a){d("onVoicePlayEnd",a)},uploadVoice:function(a){c("uploadVoice",{localId:a.localId,isShowProgressTips:0==a.isShowProgressTips?0:1},a)},downloadVoice:function(a){c("downloadVoice",{serverId:a.serverId,isShowProgressTips:0==a.isShowProgressTips?0:1},a)},translateVoice:function(a){c("translateVoice",{localId:a.localId,isShowProgressTips:0==a.isShowProgressTips?0:1},a)},chooseImage:function(a){c("chooseImage",{scene:"1|2",count:a.count||9,sizeType:a.sizeType||["original","compressed"],sourceType:a.sourceType||["album","camera"]},function(){return a._complete=function(a){if(u){var b=a.localIds;b&&(a.localIds=JSON.parse(b))}},a}())},previewImage:function(a){c(o.previewImage,{current:a.current,urls:a.urls},a)},uploadImage:function(a){c("uploadImage",{localId:a.localId,isShowProgressTips:0==a.isShowProgressTips?0:1},a)},downloadImage:function(a){c("downloadImage",{serverId:a.serverId,isShowProgressTips:0==a.isShowProgressTips?0:1},a)},getNetworkType:function(a){var b=function(a){var c,d,e,b=a.errMsg;if(a.errMsg="getNetworkType:ok",c=a.subtype,delete a.subtype,c)a.networkType=c;else switch(d=b.indexOf(":"),e=b.substring(d+1)){case"wifi":case"edge":case"wwan":a.networkType=e;break;default:a.errMsg="getNetworkType:fail"}return a};c("getNetworkType",{},function(){return a._complete=function(a){a=b(a)},a}())},openLocation:function(a){c("openLocation",{latitude:a.latitude,longitude:a.longitude,name:a.name||"",address:a.address||"",scale:a.scale||28,infoUrl:a.infoUrl||""},a)},getLocation:function(a){a=a||{},c(o.getLocation,{type:a.type||"wgs84"},function(){return a._complete=function(a){delete a.type},a}())},hideOptionMenu:function(a){c("hideOptionMenu",{},a)},showOptionMenu:function(a){c("showOptionMenu",{},a)},closeWindow:function(a){a=a||{},c("closeWindow",{immediate_close:a.immediateClose||0},a)},hideMenuItems:function(a){c("hideMenuItems",{menuList:a.menuList},a)},showMenuItems:function(a){c("showMenuItems",{menuList:a.menuList},a)},hideAllNonBaseMenuItem:function(a){c("hideAllNonBaseMenuItem",{},a)},showAllNonBaseMenuItem:function(a){c("showAllNonBaseMenuItem",{},a)},scanQRCode:function(a){a=a||{},c("scanQRCode",{needResult:a.needResult||0,scanType:a.scanType||["qrCode","barCode"]},function(){return a._complete=function(a){var b,c;v&&(b=a.resultStr,b&&(c=JSON.parse(b),a.resultStr=c&&c.scan_code&&c.scan_code.scan_result))},a}())},openProductSpecificView:function(a){c(o.openProductSpecificView,{pid:a.productId,view_type:a.viewType||0,ext_info:a.extInfo},a)},addCard:function(a){var e,f,g,h,b=a.cardList,d=[];for(e=0,f=b.length;f>e;++e)g=b[e],h={card_id:g.cardId,card_ext:g.cardExt},d.push(h);c(o.addCard,{card_list:d},function(){return a._complete=function(a){var c,d,e,b=a.card_list;if(b){for(b=JSON.parse(b),c=0,d=b.length;d>c;++c)e=b[c],e.cardId=e.card_id,e.cardExt=e.card_ext,e.isSuccess=e.is_succ?!0:!1,delete e.card_id,delete e.card_ext,delete e.is_succ;a.cardList=b,delete a.card_list}},a}())},chooseCard:function(a){c("chooseCard",{app_id:z.appId,location_id:a.shopId||"",sign_type:a.signType||"SHA1",card_id:a.cardId||"",card_type:a.cardType||"",card_sign:a.cardSign,time_stamp:a.timestamp+"",nonce_str:a.nonceStr},function(){return a._complete=function(a){a.cardList=a.choose_card_info,delete a.choose_card_info},a}())},openCard:function(a){var e,f,g,h,b=a.cardList,d=[];for(e=0,f=b.length;f>e;++e)g=b[e],h={card_id:g.cardId,code:g.code},d.push(h);c(o.openCard,{card_list:d},a)},chooseWXPay:function(a){c(o.chooseWXPay,f(a),a)}},b&&(a.wx=a.jWeixin=C),C});
/*
 * Title: loft.js
 * Description: loft.js
 * Author: huang.jc
 * Created Date: 14-2-24 下午3:05
 * Copyright: Copyright 2015 linkage, Inc.
 */
/**
 * 全局静态对象，很多工具类挂在此对象下。
 * @singleton
 * @class loft.mobile.loft
 */
! function() {

    var loft = window.loft = {
        'version': '1.0.1',
        'language': 'zh',
        'locale': {}, //国际化资源会在此文件后面加载
        /**
         * 获取资源文件
         * @method getResource
         * @param {String} key key
         * @return {String} 如果没有找到则返回'UNKNOWN_KEY_' + key
         */
        getResource: function(key) {
            if (!key) return '';
            var result = this.locale[this.language];
            var keys = key.split('.');
            for (var i = 0, n = keys.length; i < n; i++) {
                if (!result) {
                    result = 'UNKNOWN_KEY_' + key;
                    break;
                }
                result = result[keys[i]];
            }
            return result;
        },
        setLanguage: function(language) {
            this.language = language;
            $(document).trigger("languageChanged.loft");
        }
    };

    var startTimer;

    loft.createCallback = function(fn, args) {
        return function() {
            fn.call(window, args);
        }
    }

    /**
     * 提供获取url参数操作
     * @method getQueryString
     * @param  {String} name 要获取值的参数名称
     * @return {String}    返回值
     */
    loft.getQueryString = function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }

    /**
     * 动态加载css
     * @method loadcss
     * @param  {String} url css地址
     */
    loft.loadcss = function(url) {
        var head = document.getElementsByTagName('head')[0],
            link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url;
        head.appendChild(link);
        return link;
    }

    // loft.loadScript = function(xyUrl, callback) {
    //     var head = document.getElementsByTagName('head')[0];
    //     var script = document.createElement('script');
    //     script.type = 'text/javascript';
    //     script.src = xyUrl;
    //     //借鉴了jQuery的script跨域方法
    //     script.onload = script.onreadystatechange = function() {
    //         if ((!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
    //             callback && callback();
    //             // Handle memory leak in IE
    //             script.onload = script.onreadystatechange = null;
    //             if (head && script.parentNode) {
    //                 head.removeChild(script);
    //             }
    //         }
    //     };
    //     // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
    //     head.insertBefore(script, head.firstChild);
    // }

    return loft;
}();

/**
 * @class loft.mobile.loft
 */

!function (loft, _) {
    _.extend(loft, _);

    /**
     * 遍历obj，按顺序遍历输出每个值。Aliased as `forEach`。如果存在原生的forEach方法，Underscore就使用它代替。
     * The cornerstone, an `each` implementation, aka `forEach`.
     * Handles objects with the built-in `forEach`, arrays, and raw objects.
     * Delegates to **ECMAScript 5**'s native `forEach` if available.
     * @method each
     * <pre>
     _.each([1, 2, 3], alert);
     => alerts each number in turn...
     _.each({one: 1, two: 2, three: 3}, alert);
     => alerts each number value in turn...
     * </pre>
     * @param obj 可以是数组也可以是对象
     * @param {Function} iterator 用来处理每个元素.如果obj是数组,参数为(element, index, obj);如果obj是个对象,iterator的参数是 (value, key, obj)
     * @param context (optional) 如果传递了context参数,则把iterator绑定到context对象上
     */

    /**
     * 遍历obj，按顺序映射每个值到一个新的数组中。Aliased as `collect`.如果存在原生的map方法，就用原生map方法来代替。
     * Return the results of applying the iterator to each element.
     * Delegates to **ECMAScript 5**'s native `map` if available.
     * @method map
     * <pre>
     _.map([1, 2, 3], function(num){ return num * 3; });
     => [3, 6, 9]
     _.map({one: 1, two: 2, three: 3}, function(num, key){ return num * 3; });
     => [3, 6, 9]
     * </pre>
     * @param obj 可以是数组也可以是对象
     * @param {Function} iterator 用来处理每个元素并返回。如果obj是数组，参数为(element, index, obj);如果obj是个对象，iterator的参数是 (value, key, obj)
     * @param context (optional)  如果传递了context参数，则把iterator绑定到context对象上
     * @return {Array} 返回一个新的数组
     */

    /**
     * 遍历obj，按顺序将每个值归结为一个单独的值。Aliased as `foldl/inject`。
     * **Reduce** builds up a single result from a list of values, aka `inject`,
     * or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
     * @method reduce
     * <pre>
     var sum = _.reduce([1, 2, 3], function(memo, num){ return memo + num; }, 0);
     => 6
     * </pre>
     * @param obj 可以是数组也可以是对象
     * @param {Function} iterator 用来处理每个元素并返回。如果obj是数组，参数为(memo, element, index, obj);如果obj是个对象，iterator的参数是 (memo, value, key, obj)
     * @param memo 函数的初始值，后续每一步值都需要由iterator返回
     * @param context (optional) 如果传递了context参数，则把iterator绑定到context对象上
     * @return 返回一个新的值
     */

    /**
     * 遍历obj，按倒顺将每个值归结为一个单独的值。Aliased as `foldr`。
     * The right-associative version of reduce, also known as `foldr`.
     * Delegates to **ECMAScript 5**'s native `reduceRight` if available.
     * @method reduceRight
     * <pre>
     var list = [[0, 1], [2, 3], [4, 5]];
     var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
     => [4, 5, 2, 3, 0, 1]
     * </pre>
     * @param  {Object} obj 可以是数组也可以是对象
     * @param  {Function} iterator 用来处理每个元素并返回。如果obj是数组，参数为(memo, element, index, obj);如果obj是个对象，iterator的参数是 (memo, value, key, obj)
     * @param  {Object} memo 函数的初始值，后续每一步值都需要由iterator返回
     * @param  {Object} context (optional) 如果传递了context参数，则把iterator绑定到context对象上
     * @return {Object} 返回一个新的值
     */

    /**
     * 遍历obj，返回第一个通过predicate迭代器真值检测的元素值。Aliased as `detect`。如果找到匹配的元素，函数将立即返回，不会遍历整个obj。
     * Return the first value which passes a truth test. Aliased as `detect`.
     * @method find
     * <pre>
     var even = _.find([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
     => 2
     * </pre>
     * @param  {Object} obj 一般为数组
     * @param  {Function} predicate 参数为(memo, element, index, obj)，用来匹配符合条件的值
     * @param  {Object} context (optional) 如果传递了context参数，则把iterator绑定到context对象上
     * @return {Object} 返回第一个匹配的值
     */

    /**
     * 遍历list中的每个值，返回包含所有通过iterator真值检测的元素值。Aliased as `select`。如果存在原生filter方法，则用原生的filter方法。
     * Return all the elements that pass a truth test.
     * Delegates to **ECMAScript 5**'s native `filter` if available.
     * Aliased as `select`.
     * @method filter
     * <pre>
     var evens = _.filter([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
     => [2, 4, 6]
     * </pre>
     * @param  {Object} obj 一般为数组
     * @param  {Function} predicate 参数为(memo, element, index, obj)，用来匹配符合条件的值
     * @param  {Object} context (optional) 如果传递了context参数，则把iterator绑定到context对象上
     * @return {Array} 返回符合条件的数据集合
     */

    /**
     * 返回list中没有通过iterator真值检测的元素集合，与filter相反。
     * Return all the elements for which a truth test fails.
     * @method reject
     * <pre>
     var odds = _.reject([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
     => [1, 3, 5]
     * </pre>
     * @param  {Object} obj 一般为数组
     * @param  {Function} predicate 参数为(memo, element, index, obj)，用来过滤掉符合条件的值
     * @param  {Object} context (optional) 如果传递了context参数，则把iterator绑定到context对象上
     * @return {Array} 返回不符合条件的数据集合
     */

    /**
     * 如果list中的所有元素都通过iterator的真值检测就返回true。Aliased as `all`。如果存在原生的every方法，就使用原生的every。
     * Determine whether all of the elements match a truth test.
     * Delegates to **ECMAScript 5**'s native `every` if available.
     * Aliased as `all`.
     * @method every
     * <pre>
     _.every([true, 1, null, 'yes']);
     => false
     * </pre>
     * @param  {Object} obj 一般为数组
     * @param  {Function} predicate (optional)  可为空，参数为(memo, element, index, obj)，用来匹配符合条件的值,为空的话就默认为**{@link loft.desktop.loft#identity identity}**方法
     * @param  {Object} context (optional)  如果传递了context参数，则把iterator绑定到context对象上
     * @return {Boolean} 如果数据都匹配返回true，否则返回fasle
     */

    /**
     * 如果list中有任何一个元素通过 iterator 的真值检测就返回true。Aliased as `some`。一旦找到了符合条件的元素, 就直接中断对list的遍历. 如果存在原生的some方法，就使用原生的some。
     * Determine if at least one element in the object matches a truth test.
     * Delegates to **ECMAScript 5**'s native `some` if available.
     * Aliased as `any`.
     * @method some
     * <pre>
     _.some([null, 0, 'yes', false]);
     => true
     * </pre>
     * @param  {Object} obj 一般为数组
     * @param  {Function} predicate (optional) 可为空，参数为(memo, element, index, obj)，用来匹配符合条件的值,为空的话就默认为**{@link loft.desktop.loft#identity identity}**方法
     * @param  {Object} context (optional) 如果传递了context参数，则把iterator绑定到context对象上
     * @return {Boolean} 如果有任一数据匹配返回true，否则返回fasle
     */

    /**
     * 如果obj包含指定的value则返回true。Aliased as `include`。如果list 是数组，内部使用indexOf判断
     * Determine if the array or object contains a given value (using `===`).
     * Aliased as `include`.
     * @method contains
     * <pre>
     _.contains([1, 2, 3], 3);
     => true
     * </pre>
     * @param  {Object} obj 一般为数组
     * @param  {Object} target 需要判断的指定值
     * @return {Boolean} 如果对象内包含指定值返回true，否则返回fasle
     */

    /**
     * 在list的每个元素上执行methodName方法。任何传递给invoke的额外参数，invoke都会在调用methodName方法的时候传递给它。
     * Invoke a method (with arguments) on every item in a collection.
     * @method invoke
     * <pre>
     _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
     => [[1, 5, 7], [1, 2, 3]]
     * </pre>
     * @param  {Object} obj 一般为数组
     * @param  {Function} method 每一个元素要执行的方法,也可以是方法名称
     * @return {Array} 返回一个新的数组
     */

    /**
     * map最常使用的用例模型的版本，即萃取对象数组中某属性值，返回一个数组。
     * Convenience version of a common use case of `map`: fetching a property.
     * @method pluck
     * <pre>
     var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
     _.pluck(stooges, 'name');
     => ["moe", "larry", "curly"]
     * </pre>
     * @param  {Object} obj 一般为对象数组
     * @param  {Object} key 要萃取的对象的属性名称
     * @return {Array} 返回一个新的数组
     */

    /**
     * 遍历list中的每一个值，返回一个数组，这个数组包含包含properties所列出的属性的所有的键 - 值对。
     * Convenience version of a common use case of `filter`: selecting only objects
     * containing specific `key:value` pairs.
     * @method where
     * <pre>
     _.where(listOfPlays, {author: "Shakespeare", year: 1611});
     => [{title: "Cymbeline", author: "Shakespeare", year: 1611},
     {title: "The Tempest", author: "Shakespeare", year: 1611}]
     * </pre>
     * @param obj 一般为对象数组
     * @param attrs 需要过滤的属性集合
     * @return {Array} 返回一个新的数组
     */

    /**
     * 遍历list中的每一个值，返回匹配properties所列出的属性的所有的键 - 值对的第一个值。
     * Convenience version of a common use case of `find`: getting the first object
     * containing specific `key:value` pairs.
     * @method findWhere
     * <pre>
     _.findWhere(publicServicePulitzers, {newsroom: "The New York Times"});
     => {year: 1918, newsroom: "The New York Times",
      reason: "For its public service in publishing in full so many official reports,
      documents and speeches by European statesmen relating to the progress and
      conduct of the war."}
     * </pre>
     * @param obj 一般为对象数组
     * @param attrs 需要过滤的属性集合
     * @return {Array} 返回第一个符合条件的对象
     */

    /**
     * 返回list中的最大值。如果传递iterator参数，iterator将作为list排序的依据。如果是数字数组(不超过65535个)，直接调用Math.max方法。
     * Return the maximum element or (element-based computation).
     * Can't optimize arrays of integers longer than 65,535 elements.
     * See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
     * @method max
     * <pre>
     var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
     _.max(stooges, function(stooge){ return stooge.age; });
     => {name: 'curly', age: 60};
     * </pre>
     * @param  obj 一般为数组
     * @param  {Function} iterator (optional) 返回每一个数据中用来比较的值，如果未定义，默认为其本身。
     * @param  {Object} context (optional) 如果传递了context参数，则把iterator绑定到context对象上
     * @return {Object} 返回经比较后最大的数据
     */

    /**
     * 返回list中的最小值。如果传递iterator参数，iterator将作为list排序的依据。
     * Return the minimum element (or element-based computation).
     * @method min
     * <pre>
     var numbers = [10, 5, 100, 2, 1000];
     _.min(numbers);
     => 2
     * </pre>
     * @param  obj 一般为数组
     * @param  {Function} iterator (optional) 返回每一个数据中用来比较的值，如果未定义，默认为其本身。
     * @param  {Object} context (optional) 如果传递了context参数，则把iterator绑定到context对象上
     * @return {Object} 返回经比较后最小的数据
     */

    /**
     * 返回一个随机乱序的 obj 副本, 使用[lofter-Yates shuffle](http://en.wikipedia.org/wiki/lofter–Yates_shuffle)来进行随机乱序.
     * Shuffle an array, using the modern version of the
     * [lofter-Yates shuffle](http://en.wikipedia.org/wiki/lofter–Yates_shuffle).
     * @method shuffle
     * <pre>
     _.shuffle([1, 2, 3, 4, 5, 6]);
     => [4, 1, 6, 3, 5, 2]
     * </pre>
     * @param  {Array} obj 一般为数组
     * @return {Array} 返回乱序的数组
     */

    /**
     * 从 obj中产生一个随机样本。传递一个数字表示从obj中返回n个随机元素。否则将返回一个单一的随机项。
     * Sample **n** random values from a collection.
     * If **n** is not specified, returns a single random element.
     * The internal `guard` argument allows it to work with `map`.
     * @method sample
     * <pre>
     _.sample([1, 2, 3, 4, 5, 6]);
     => 4
     _.sample([1, 2, 3, 4, 5, 6], 3);
     => [1, 6, 2]
     * </pre>
     * @param  {Array} obj 一般为数组
     * @param  {Number} n (optional) 随机返回的元素个数
     * @param  {Object} guard (optional) 设置为true会返回单一的随机项
     * @return {Object} 如果第二参数未定义或者定义了第三个参数，则返回随机一项，其他适合则返回n个随机元素的集合
     */

    /**
     * 返回一个排序后的obj拷贝副本。
     * Sort the object's values by a criterion produced by an iterator.
     * @method sortBy
     * <pre>
     _.sortBy([1, 2, 3, 4, 5, 6], function(num){ return Math.sin(num); });
     => [5, 4, 6, 3, 1, 2]
     * </pre>
     * @param  {Array} obj 一般为数组
     * @param  {Function} iterator (optional) 如果有iterator参数，iterator将作为obj排序的依据。迭代器也可以是字符串的属性的名称进行排序的
     * @param  {Object} context (optional) 如果传递了context参数，则把iterator绑定到context对象上
     * @return {Array} 返回乱序的数组
     */

    /**
     * 把一个集合分组为多个集合，通过 iterator 返回的结果进行分组.
     * Groups the object's values by a criterion. Pass either a string attribute to group by, or a function that returns the criterion.
     * @method groupBy
     * <pre>
     _.groupBy([1.3, 2.1, 2.4], function(num){ return Math.floor(num); });
     => {1: [1.3], 2: [2.1, 2.4]}
     _.groupBy(['one', 'two', 'three'], 'length');
     => {3: ["one", "two"], 5: ["three"]}
     * </pre>
     * @param  {Array} obj 一般为数组
     * @param  {Function} iterator (optional) 用来返回一个在列表中的每个元素键的函数或属性名，返回的值作为key。
     * @param  {Object} context (optional) 如果传递了context参数，则把iterator绑定到context对象上
     * @return {Object} 返回分组的对象
     */

    /**
     * 给定一个集合，和一个， 返回一个每一项索引的对象。
     * Indexes the object's values by a criterion, similar to `groupBy`, but for when you know that your index values will be unique.
     * @method indexBy
     * <pre>
     var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
     _.indexBy(stooges, 'age');
     => {
          "40": {name: 'moe', age: 40},
          "50": {name: 'larry', age: 50},
          "60": {name: 'curly', age: 60}
        }
     * </pre>
     * @param  {Array} obj 一般为数组
     * @param  {Function} iterator (optional) 用来返回一个在列表中的每个元素键的函数或属性名，返回的值作为key，key值要求唯一。
     * @param  {Object} context (optional) 如果传递了context参数，则把iterator绑定到context对象上
     * @return {Object} 返回一个指定了key的map
     */

    /**
     * 排序一个列表组成一个组，并且返回各组中的对象的数量的计数。
     * Counts instances of an object that group by a certain criterion. Pass either a string attribute to count by, or a function that returns the criterion.
     * @method countBy
     * <pre>
     _.countBy([1, 2, 3, 4, 5], function(num) {
          return num % 2 == 0 ? 'even': 'odd';
        });
     => {odd: 3, even: 2}
     * </pre>
     * @param  {Array} obj 一般为数组
     * @param  {Function} iterator (optional) 用来返回一个在列表中的每个元素键的函数或属性名，返回的值作为key。
     * @param  {Object} context (optional) 如果传递了context参数，则把iterator绑定到context对象上
     * @return {Object} 返回只有key值和对应key的数据总数的分组对象
     */

    /**
     * 使用二分查找确定value在list中的位置序号。
     * Use a comparator function to figure out the smallest index at which an object should be inserted so as to maintain order. Uses binary search.
     * @method sortedIndex
     * <pre>
     _.sortedIndex([10, 20, 30, 40, 50], 35);
     => 3
     var stooges = [{name: 'moe', age: 40}, {name: 'curly', age: 60}];
     _.sortedIndex(stooges, {name: 'larry', age: 50}, 'age');
     => 1
     * </pre>
     * @param  {Array} array 一般为数组
     * @param  {Object} obj  array排序后，定位obj插入的位置,使之能保持list原有的排序
     * @param  {Function} iterator (optional) 作为list排序的依据，也可以是字符串的属性名用来排序(比如length)
     * @param  {Object} context (optional) 如果传递了context参数，则把iterator绑定到context对象上
     * @return {Number} 返回obj所在的最终排序位置的下标。
     */
    /**
     * 把obj(任何可以迭代的对象)转换成一个数组，在转换 arguments 对象时非常有用。
     * Safely create a real, live array from anything iterable.
     * @method toArray
     * <pre>
     (function(){ return _.toArray(arguments).slice(1); })(1, 2, 3, 4);
     => [2, 3, 4]
     * </pre>
     * @param  obj 可以迭代的对象
     * @return {Array} 返回数组
     */
    /**
     * 返回对象的长度。如果对象没有length属性，返回属性的数量
     * Return the number of elements in an object.
     * @method size
     * <pre>
     _.size({one: 1, two: 2, three: 3});
     => 3
     * </pre>
     * @param  obj 可以迭代的对象
     * @return {Number} 返回对象的长度
     */
    /**
     * 返回数组的前n个元素。Aliased as `head` or `take`。
     * Get the first element of an array. Passing **n** will return the first N values in the array. Aliased as `head` and `take`. The **guard** check allows it to work with `_.map`.
     * @method first
     * <pre>
     _.first([5, 4, 3, 2, 1]);
     => 5
     * </pre>
     * @param  {Array} array 对象数组
     * @param  {Number} n (optional) 返回的前几个元素数量，为空默认为1.
     * @param  {Object} guard (optional) 设置为true会返回第一个元素
     * @return {Array} 如果第二参数未定义或者定义了第三个参数，则返回第一个元素，其他情况则返回n个随机元素的集合
     */
    /**
     * 排除数组的后n个元素。
     * Returns everything but the last entry of the array. Especially useful on the arguments object. Passing **n** will return all the values in the array, excluding the last N. The **guard** check allows it to work with `_.map`.
     * @method initial
     * <pre>
     _.initial([5, 4, 3, 2, 1]);
     => [5, 4, 3, 2]
     * </pre>
     * @param  {Array} array 对象数组
     * @param  {Number} n (optional) 排除的后几个元素数量，为空默认为1.
     * @param  {Object} guard (optional) 设置为true会返回第一个元素
     * @return {Array} 返回排除过的数据集合
     */
    /**
     * 返回数组里的后面的n个元素。
     * Get the last element of an array. Passing **n** will return the last N values in the array. The **guard** check allows it to work with `_.map`.
     * @method last
     * <pre>
     _.last([5, 4, 3, 2, 1]);
     => 1
     * </pre>
     * @param  {Array} array 对象数组
     * @param  {Number} n (optional) 返回的后几个元素数量，为空默认为1.
     * @param  {Object} guard (optional) 设置为true会返回最后一个元素
     * @return {Array} 如果第二参数未定义或者定义了第三个参数，则返回最后一个元素，其他情况则返回n个随机元素的集合
     */
    /**
     * 返回数组中除了第n个元素外的其他全部元素。Aliased as `tail` or `drop`。
     * Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
     * Especially useful on the arguments object. Passing an **n** will return the rest N values in the array. The **guard** check allows it to work with `_.map`.
     * @method rest
     * <pre>
     _.rest([5, 4, 3, 2, 1]);
     => [4, 3, 2, 1]
     * </pre>
     * @param  {Array} array 对象数组
     * @param  {Number} n (optional) 从第几个元素后开始返回，为空默认为1.
     * @param  {Object} guard (optional) 设置为true会排除第一个元素
     * @return {Array} 返回排除了前几个元素的数据集合
     */
    /**
     * 返回一个除去所有false值的 array副本。在javascript中, false, null, 0, "", undefined 和 NaN 都是false值.
     * Trim out all falsy values from an array.
     * @method compact
     * <pre>
     _.compact([0, 1, false, 2, '', 3]);
     => [1, 2, 3]
     * </pre>
     * @param  {Array} array 对象数组
     * @return {Array} 返回排除了值为false的数据集合
     */
    /**
     * 将一个嵌套多层的数组array(嵌套可以是任何层数)转换为只有一层的数组。
     * Flatten out an array, either recursively (by default), or just one level.
     * @method flatten
     * <pre>
     _.flatten([1, [2], [3, [[4]]]]);
     => [1, 2, 3, 4];
     _.flatten([1, [2], [3, [[4]]]], true);
     => [1, 2, 3, [[4]]];
     * </pre>
     * @param  {Array} array 对象数组
     * @param  {Object} shallow (optional) 如果传递shallow参数，数组将只减少一维的嵌套。
     * @return {Array} 返回嵌套只有一层的对象，或者减少一维嵌套。
     */
    /**
     * 返回一个删除了指定数据的array副本。剔除的数据为目标数组后面的参数，全等条件。
     * Return a version of the array that does not contain the specified value(s).
     * @method without
     * <pre>
     _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
     => [2, 3, 4]
     * </pre>
     * @param  {Array} array 目标数组
     * @return {Array} 返回剔除掉指定数据的数组
     */
    /**
     * 将一个数组按照一定的条件拆分成两个。
     * Split an array into two arrays: one whose elements all satisfy the given predicate, and one whose elements all do not satisfy the predicate.
     * @method partition
     * <pre>
     _.partition([1,2,3,4,5],function(item){return item >3 ;});
     => [[4,5],[1,2,3]]
     * </pre>
     * @param  {Array} array
     * @param  {Function} predicate 判断每一个元素，返回true还是false，根据返回值会将元素分到不同的数组里面
     * @param  {Object} context (optional) 如果传递了context参数，则把iterator绑定到context对象上
     * @return {Array} 返回一个长度为2的二维数组，一个数组内符合条件的数据，一个数组内为不符合条件的数据。
     */
    /**
     * 返回array去重后的副本, 使用全等条件.Aliased as `unique`。
     * Produce a duplicate-free version of the array. If the array has already been sorted, you have the option of using a faster algorithm.
     * Aliased as `unique`.
     * @method unique
     * <pre>
     _.uniq([1, 2, 1, 3, 1, 4]);
     => [1, 2, 3, 4]
     * </pre>
     * @param  {Array} array 对象数组
     * @param  {Boolean} isSorted (optional) 如果确定array已经排序, 那么给isSorted参数传递 true值, 此函数将运行的更快的算法。
     * @param  {Function} iterator (optional) 如果要处理对象元素, 传参iterator来获取要对比的属性.
     * @param  {Object} context (optional) 如果传递了context参数，则把iterator绑定到context对象上
     * @return {Array} 返回排过重的数组
     */
    /**
     * 返回传入的arrays（数组）并集：按顺序返回，数组的元素是唯一的，可以传入一个或多个 arrays（数组）
     * Produce an array that contains the union: each distinct element from all of the passed-in arrays.
     * @method union
     * <pre>
     _.union([1, 2, 3], [101, 2, 1, 10], [2, 1]);
     => [1, 2, 3, 101, 10]
     * </pre>
     * @return {Array} 合并了所有参数值的数组
     */
    /**
     * 返回传入arrays（数组）交集。结果中的每个值是存在于传入的每个arrays（数组）里。
     * Produce an array that contains every item shared between all the passed-in arrays.
     * @method intersection
     * <pre>
     _.intersection([1, 2, 3], [101, 2, 1, 10], [2, 1]);
     => [1, 2]
     * </pre>
     * @param  {Array} array 目标数组
     * @return {Array} 返回所有参数数组里面都包含的数值的集合
     */
    /**
     * 返回一个删除了指定数据的array副本。剔除的数据为参数数组中任一数组里面出现的元素。
     * Take the difference between one array and a number of other arrays.
     * Only the elements present in just the first array will remain.
     * @method difference
     * <pre>
     _.difference([1, 2, 3, 4, 5], [5, 2, 10]);
     => [1, 3, 4]
     * </pre>
     * @param  {Array} array 目标数组
     * @return {Array} 返回剔除掉指定数据的数组
     */
    /**
     * 将每个相应位置的arrays的值合并在一起。
     * Zip together multiple lists into a single array -- elements that share an index go together.
     * @method zip
     * <pre>
     _.zip(['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]);
     => [["moe", 30, true], ["larry", 40, false], ["curly", 50, false]]
     _.zip.apply(_, arrayOfRowsOfData);
     => arrayOfColumnsOfData
     * </pre>
     * @return {Array} 行转列之后的数组
     */
    /**
     * 将数组转换为对象。
     * Converts lists into objects. Pass either a single array of `[key, value]` pairs, or two parallel arrays of the same length -- one of keys, and one of the corresponding values.
     * @method object
     * <pre>
     _.object(['moe', 'larry', 'curly'], [30, 40, 50]);
     => {moe: 30, larry: 40, curly: 50}
     _.object([['moe', 30], ['larry', 40], ['curly', 50]]);
     => {moe: 30, larry: 40, curly: 50}
     * </pre>
     * @param  {Array} list 目标数组，可以是每一个元素为[key, value]格式的
     * @param  {Array} values (optional) 如果list参数是key的列表，此参数则为值的列表，长度和list一样
     * @return {Object}        返回一个对象
     */
    /**
     * 返回item在该 array 中的索引值，如果item不存在 array中就返回-1。使用原生的indexOf 函数，除非它失效。
     * If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),we need this function. Return the position of the first occurrence of an item in an array, or -1 if the item is not included in the array.
     * Delegates to **ECMAScript 5**'s native `indexOf` if available.
     * If the array is large and already in sort order, pass `true` for **isSorted** to use binary search.
     * @method indexOf
     * <pre>
     _.indexOf([1, 2, 3], 2);
     => 1
     * </pre>
     * @param  {Array}  array     目标数组
     * @param  {Object}  item     数组内要寻找的目标元素
     * @param  {Boolean} isSorted (optional) 知道数组已经排序，传递true给isSorted将更快的用二进制搜索；也可以传入数字，表示将从你给定的索性值开始搜索。
     * @return {Number}           返回目标元素在数组中的索引值
     */
    /**
     * 返回item在该 array 中的从最后开始的索引值，如果item不存在 array中就返回-1。如果支持原生的lastIndexOf，将使用原生的lastIndexOf函数。
     * Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
     * @method lastIndexOf
     * <pre>
     _.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
     => 4
     * </pre>
     * @param  {Array}  array     目标数组
     * @param  {Object}  item     数组内要寻找的目标元素
     * @param  {Number} from (optional) 将从你给定的索性值开始搜索。
     * @return {Number}           返回目标元素在数组中的索引值
     */
    /**
     * 一个用来创建整数灵活编号的列表的函数，便于each 和 map循环。
     * Generate an integer Array containing an arithmetic progression. A port of the native Python `range()` function. See [the Python documentation](http://docs.python.org/library/functions.html#range).
     * @method range
     * <pre>
     _.range(10);
     => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
     _.range(1, 11);
     => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
     _.range(0, 30, 5);
     => [0, 5, 10, 15, 20, 25]
     _.range(0, -10, -1);
     => [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
     _.range(0);
     => []
     * </pre>
     * @param  {Number} start (optional) 默认为 0
     * @param  {Number} stop (optional)  决定返回的数据数量
     * @param  {Number} step (optional) 默认为 1,可设置为负数表示负增长
     * @return {Array}       返回一个从start 到stop的整数的列表
     */
    /**
     * 绑定函数 function 到对象 object 上
     * Create a function bound to a given object (assigning `this`, and arguments, optionally).
     * Delegates to **ECMAScript 5**'s native `Function.bind` if available.
     * @method bind
     * <pre>
     var func = function(greeting){ return greeting + ': ' + this.name };
     func = _.bind(func, {name: 'moe'}, 'hi');
     func();
     => 'hi: moe'
     * </pre>
     * @param  {Function} func  要执行的方法
     * @param  {Object} context 方法的执行者，对应func函数内的this
     * @param {Object} arguments (optional) 任意可选参数arguments 可以绑定到函数 function , 可以填充函数所需要的参数
     * @return {Object}         func执行的返回值
     */
    /**
     * 局部应用一个函数填充在任意数值的参数， 不改变其动态this值
     * Partially apply a function by creating a version that has had some of its arguments pre-filled, without changing its dynamic `this` context. _ acts as a placeholder, allowing any combination of arguments to be pre-filled.
     * @method partial
     * <pre>
     var add = function(a, b) { return a + b; };
     add5 = _.partial(add, 5);
     add5(10);
     => 15
     * </pre>
     * @param  {Function} func  要执行的方法
     * @param {Object} arguments (optional) 任意可选参数arguments可以绑定到函数function,可以填充函数所需要的参数
     * @return {Object}         func执行的返回值
     */
    /**
     * 把methodNames参数指定的方法绑定到object上，这些方法就会在对象的上下文环境中执行。绑定函数用作事件处理函数时非常便利，否则函数被调用时this一点用也没有。
     * Bind a number of an object's methods to that object. Remaining arguments are the method names to be bound. Useful for ensuring that all callbacks defined on an object belong to it.
     * @method bindAll
     * <pre>
     var buttonView = {
          label  : 'underscore',
          onClick: function(){ alert('clicked: ' + this.label); },
          onHover: function(){ console.log('hovering: ' + this.label); }
        };
     _.bindAll(buttonView, 'onClick', 'onHover');
     // When the button is clicked, this.label will have the correct value.
     jQuery('#underscore_button').bind('click', buttonView.onClick);
     * </pre>
     * @param  {Object} obj 目标对象
     * @param  {String} methodNames (optional) 如果不设置methodNames参数，对象上的所有方法都会被绑定。
     * @return {Object}     绑定后的目标对象
     */
    /**
     * Memoizes方法可以缓存某函数的计算结果。对于耗时较长的计算是很有帮助的。默认使用function的第一个参数作为key
     * Memoize an expensive function by storing its results.
     * @method memoize
     * <pre>
     var fibonacci = _.memoize(function(n) {
          return n < 2 ? n: fibonacci(n - 1) + fibonacci(n - 2);
        });
     * </pre>
     * @param  {Function} func  要执行的方法
     * @param  {Function} hasher (optional) 的返回值作为key存储函数的计算结果。
     * @return {Object}        返回缓存的结果
     */
    /**
     * 类似setTimeout，等待wait毫秒后调用function。
     * Delays a function for the given number of milliseconds, and then calls it with the arguments supplied.
     * @method delay
     * <pre>
     var log = _.bind(console.log, console);
     _.delay(log, 1000, 'logged later');
     => 'logged later' // Appears after one second.
     * </pre>
     * @param  {Function} func  要执行的方法
     * @param  {Number} wait 延迟执行的时间
     * @param  {Object} arguments (optional) 如果传递可选的参数arguments，当函数func执行时， arguments 会作为参数传入。
     * @return {Object}      返回执行的结果
     */
    /**
     * 延迟调用function直到当前调用栈清空为止，类似使用延时为1的setTimeout方法。对于执行开销大的计算和无阻塞UI线程的HTML渲染时候非常有用。
     * Defers a function, scheduling it to run after the current call stack has cleared.
     * @method defer
     * <pre>
     _.defer(function(){ alert('deferred'); });
     // Returns from the function before the alert runs.
     * </pre>
     * @param  {Function} func  要执行的方法
     * @param  {Object} arguments (optional) 如果传递可选的参数arguments，当函数func执行时，arguments 会作为参数传入。
     * @return {Object}      返回执行的结果
     */
    /**
     * 创建并返回一个像节流阀一样的函数，当重复调用函数的时候，最多每隔 wait毫秒调用一次该函数。 对于想控制一些触发频率较高的事件有帮助。
     * Returns a function, that, when invoked, will only be triggered at most once during a given window of time. Normally, the throttled function will run as much as it can, without ever going more than once per `wait` duration;
     * but if you'd like to disable the execution on the leading edge, pass `{leading: false}`. To disable execution on the trailing edge, ditto.
     * @method throttle
     * <pre>
     var throttled = _.throttle(updatePosition, 100);
     $(window).scroll(throttled);
     * </pre>
     * @param  {Function} func  要执行的方法
     * @param  {Number} wait    函数调用的间隔时间
     * @param  {Object} options (optional) 禁用第一次首先执行的话，传递{leading: false}，禁用最后一次执行的话，传递{trailing: false}。
     * @return {Object}      返回执行的结果
     */
    /**
     * 返回 function 函数的防反跳版本, 将延迟函数的执行(真正的执行)在函数最后一次调用时刻的 wait 毫秒之后. 对于必须在一些输入（多是一些用户操作）停止到达之后执行的行为有帮助。
     * Returns a function, that, as long as it continues to be invoked, will not be triggered. The function will be called after it stops being called for N milliseconds. If `immediate` is passed, trigger the function on the leading edge, instead of the trailing.
     * @method debounce
     * <pre>
     var lazyLayout = _.debounce(calculateLayout, 300);
     $(window).resize(lazyLayout);
     * </pre>
     * @param  {Function} func  要执行的方法
     * @param  {Number} wait    函数调用的延时时间
     * @param  {Boolean} immediate (optional) 传参 immediate 为 true 会让 debounce 在 wait 间隔之后 触发最后的函数调用而不是最先的函数调用. 在类似不小心点了提交按钮两下而提交了两次的情况下很有用.
     * @return {Object}      返回执行的结果
     */
    /**
     * 创建一个只能调用一次的函数。重复调用改进的方法也没有效果，只会返回第一次执行时的结果。 作为初始化函数使用时非常有用, 不用再设一个boolean值来检查是否已经初始化完成.
     * Returns a function that will be executed at most one time, no matter how often you call it. Useful for lazy initialization.
     * @method once
     * <pre>
     var initialize = _.once(createApplication);
     initialize();
     initialize();
     // Application is only created once.
     * </pre>
     * @param  {Function} func  要执行的方法
     * @return {Object}      返回执行的结果
     */
    /**
     * 将第一个函数 function 封装到函数 wrapper 里面, 并把函数 function 作为第一个参数传给 wrapper. 这样可以让 wrapper 在 function 运行之前和之后 执行代码, 调整参数然后附有条件地执行.
     * Returns the first function passed as an argument to the second,allowing you to adjust arguments, run code before and after, and conditionally execute the original function.
     * @method wrap
     * <pre>
     var hello = function(name) { return "hello: " + name; };
     hello = _.wrap(hello, function(func) {
          return "before, " + func("moe") + ", after";
        });
     hello();
     => 'before, hello: moe, after'
     * </pre>
     * @param  {Function} func  要执行的方法
     * @param  {Function} wrapper 外围方法，func将会作为此方法的第一个参数，可以在这个方法里面有条件的调用func
     * @return {Object}      返回执行的结果
     */
    /**
     * 返回函数集 functions 组合后的复合函数, 也就是一个函数执行完之后把返回的结果再作为参数赋给下一个函数来执行. 以此类推. 在数学里, 把函数 f(), g(), 和 h() 组合起来可以得到复合函数 f(g(h())).
     * Returns a function that is the composition of a list of functions, each consuming the return value of the function that follows.
     * @method compose
     * <pre>
     var greet    = function(name){ return "hi: " + name; };
     var exclaim  = function(statement){ return statement.toUpperCase() + "!"; };
     var welcome = _.compose(greet, exclaim);
     welcome('moe');
     => 'hi: MOE!
     * </pre>
     * @param  {Function} func (optional) 任何个参数func将会被嵌套进来执行，后一个func的返回值作为前一个func的参数
     * @return {Object}      返回执行的结果
     */
    /**
     * 创建一个函数, 只有在运行了times次之后才有效果. 在处理同组异步请求返回结果时, 如果你要确保同组里所有异步请求完成之后才 执行这个函数, 这将非常有用.
     * Returns a function that will only be executed after being called N times.
     * @method after
     * <pre>
     var renderNotes = _.after(notes.length, render);
     _.each(notes, function(note) {
          note.asyncSave({success: renderNotes});
        });
     // renderNotes is run once, after all notes have saved.
     * </pre>
     * @param  {Number} times 函数执行的次数
     * @param  {Function} func  函数执行次数到达之后真正触发的事件
     * @return {Object}      返回执行的结果
     */
    /**
     * 获取object对象所有的属性名称。
     * Retrieve the names of an object's properties.
     * Delegates to **ECMAScript 5**'s native `Object.keys`
     * @method keys
     * <pre>
     _.keys({one: 1, two: 2, three: 3});
     => ["one", "two", "three"]
     * </pre>
     * @param  {Object} obj 目标对象
     * @return {Array}     目标对象的属性名称
     */
    /**
     * 返回object对象所有的属性值。
     * Retrieve the values of an object's properties.
     * @method values
     * <pre>
     _.values({one: 1, two: 2, three: 3});
     => [1, 2, 3]
     * </pre>
     * @param  {Object} obj 目标对象
     * @return {Array}     目标对象的属性值
     */
    /**
     * 把一个对象转变为一个[key, value]形式的数组。
     * Convert an object into a list of `[key, value]` pairs.
     * @method pairs
     * <pre>
     _.pairs({one: 1, two: 2, three: 3});
     => [["one", 1], ["two", 2], ["three", 3]]
     * </pre>
     * @param  {Object} obj 目标对象
     * @return {Array}      返回数组，每个元素都是属性名和属性值组成。
     */
    /**
     * 返回一个object副本，使其键（keys）和值（values）对换。对于这个操作，必须确保object里所有的值都是唯一的且可以序列号成字符串.
     * Invert the keys and values of an object. The values must be serializable.
     * @method invert
     * <pre>
     _.invert({Moe: "Moses", Larry: "Louis", Curly: "Jerome"});
     => {Moses: "Moe", Louis: "Larry", Jerome: "Curly"};
     * </pre>
     * @param  {Object} obj 目标对象
     * @return {Object}      转换过属性名和属性值的对象。
     */

    /**
     * 返回一个对象里所有的方法名, 而且是已经排序的 。Aliased as `methods`。
     * Return a sorted list of the function names available on the object.
     * Aliased as `methods`
     * @method functions
     * <pre>
     _.functions(_);
     => ["all", "any", "bind", "bindAll", "clone", "compact", "compose" ...
     * </pre>
     * @param  {Object} obj 目标对象
     * @return {Array}      返回数组，每个元素是属性值为函数的属性名称。
     */

    /**
     * 复制source对象中的所有属性覆盖到destination对象上，并且返回 destination 对象. 复制是按顺序的, 所以后面的对象属性会把前面的对象属性覆盖掉(如果有重复).
     * Extend a given object with all the properties in passed-in object(s).
     * @method extend
     * <pre>
     _.extend({name: 'moe'}, {age: 50});
     => {name: 'moe', age: 50}
     * </pre>
     * @param  {Object} obj 目标参数
     * @param  {Object} objs (optional) 一些列的复制对象，最终这些对象的属性都附加到第一个对象上
     * @return {Object}     返回第一个对象(目标对象)
     */

    /**
     * 返回一个object副本，只过滤出keys(有效的键组成的数组)参数指定的属性值。
     * Return a copy of the object only containing the whitelisted properties.
     * @method pick
     * <pre>
     _.pick({name: 'moe', age: 50, userid: 'moe1'}, 'name', 'age');
     => {name: 'moe', age: 50}
     * </pre>
     * @param  {Object} obj 目标对象
     * @param  {Object} keys (optional) 一些列的属性key，最终obj对象的这些属性都会被提炼到返回副本里面
     * @return {Object}     从目标对象中返回指定keys的副本对象
     */

    /**
     * 返回一个object副本，只过滤出除去keys(有效的键组成的数组)参数指定的属性值。
     * Return a copy of the object without the blacklisted properties.
     * @method omit
     * <pre>
     _.omit({name: 'moe', age: 50, userid: 'moe1'}, 'userid');
     => {name: 'moe', age: 50}
     * </pre>
     * @param  {Object} obj 目标对象
     * @param  {Object} keys (optional) 一些列的属性key，最终obj对象的这些属性都会在返回的副本对象里面剔除
     * @return {Object}     从目标对象中返回不含指定keys的副本对象
     */

    /**
     * 用defaults对象填充object中undefined属性。并且返回这个object。一旦这个属性被填充，再使用defaults方法将不会有任何效果。
     * Fill in a given object with default properties.
     * @method defaults
     * <pre>
     var iceCream = {flavor: "chocolate"};
     _.defaults(iceCream, {flavor: "vanilla", sprinkles: "lots"});
     => {flavor: "chocolate", sprinkles: "lots"}
     * </pre>
     * @param  {Object} obj 目标对象
     * @param  {Object} defaults (optional) 一些列的复制对象，会按顺序将obj中没有的属性加上
     * @return {Object}     返回一个被填充后的对象
     */

    /**
     * 创建 一个浅复制（浅拷贝）的克隆object。任何嵌套的对象或数组都通过引用拷贝，不会复制。
     * Create a (shallow-cloned) duplicate of an object.
     * @method clone
     * <pre>
     _.clone({name: 'moe'});
     => {name: 'moe'};
     * </pre>
     * @param  {Object} obj 目标对象
     * @return {Object}     目标对象的副本
     */

    /**
     * 用 object作为参数来调用函数interceptor，然后返回object。这种方法的主要意图是作为函数链式调用 的一环, 为了对此对象执行操作并返回对象本身。
     * Invokes interceptor with the obj, and then returns obj.
     * The primary purpose of this method is to "tap into" a method chain, in order to perform operations on intermediate results within the chain.
     * @method tap
     * <pre>
     _.chain([1,2,3,200])
     .filter(function(num) { return num % 2 == 0; })
     .tap(alert)
     .map(function(num) { return num * num })
     .value();
     => // [2, 200] (alerted)
     => [4, 40000]
     * </pre>
     * @param  {Object} obj
     * @param  {Function} interceptor
     * @return {Object}  obj
     */

    /**
     * 执行两个对象之间的优化深度比较，确定他们是否应被视为相等。
     * Perform a deep comparison to check if two objects are equal.
     * @method isEqual
     * <pre>
     var moe   = {name: 'moe', luckyNumbers: [13, 27, 34]};
     var clone = {name: 'moe', luckyNumbers: [13, 27, 34]};
     moe == clone;
     => false
     _.isEqual(moe, clone);
     => true
     * </pre>
     * @param  {Object}  a 源对象
     * @param  {Object}  b 目标对象
     * @return {Boolean}   两对象值是否相等
     */
    /**
     * 如果object 不包含任何值(没有可枚举的属性)，返回true。也可以判断字符串或者数组的长度为0
     * Is a given array, string, or object empty?
     * An "empty" object has no enumerable own-properties.
     * @method isEmpty
     * <pre>
     _.isEmpty([1, 2, 3]);
     => false
     _.isEmpty({});
     => true
     * </pre>
     * @param  {Object}  obj 目标对象
     * @return {Boolean}    目标对象是否为空值
     */
    /**
     * 如果object是一个DOM元素，返回true。属性nodeType为1表示为element对象
     * Is a given value a DOM element?
     * @method isElement
     * <pre>
     _.isElement(jQuery('body')[0]);
     => true
     * </pre>
     * @param  {Object}  obj 目标对象
     * @return {Boolean} 是否为dom对象
     */
    /**
     * 如果object是一个数组，返回true。如果存在原生的Array.isArray方法，就用原生方法来代替。
     * Is a given value an array?
     * Delegates to ECMA5's native Array.isArray
     * @method isArray
     * <pre>
     (function(){ return _.isArray(arguments); })();
     => false
     _.isArray([1,2,3]);
     => true
     * </pre>
     * @param  {Object}  obj 目标对象
     * @return {Boolean} 目标对象是否为数组
     */
    /**
     * 如果object是一个对象，返回true。需要注意的是JavaScript数组和函数是对象，字符串和数字不是。
     * Is a given variable an object?
     * @method isObject
     * <pre>
     _.isObject({});
     => true
     _.isObject(1);
     => false
     * </pre>
     * @param  {Object}  obj 目标对象
     * @return {Boolean}     true or false
     */
    /**
     * 如果object是一个参数对象，返回true
     * Is a given variable an arguments?
     * @method isArguments
     * <pre>
     (function(){ return _.isArguments(arguments); })(1, 2, 3);
     => true
     _.isArguments([1,2,3]);
     => false
     * </pre>
     * @param {Object}  obj 目标对象
     * @return {Boolean}    true or false
     */
    /**
     * 如果object是一个函数对象，返回true
     * Is a given variable a function?
     * @method isFunction
     * <pre>
     _.isFunction(alert);
     => true
     * </pre>
     * @param {Object}  obj 目标对象
     * @return {Boolean}    true or false
     */
    /**
     * 如果object是一个字符串，返回true
     * Is a given variable a String?
     * @method isString
     * <pre>
     _.isString("moe");
     => true
     * </pre>
     * @param {Object}  obj 目标对象
     * @return {Boolean}    true or false
     */
    /**
     * 如果object是一个数值，返回true, 包括 NaN
     * Is a given variable a number?
     * @method isNumber
     * <pre>
     _.isNumber(8.4 * 5);
     => true
     * </pre>
     * @param {Object}  obj 目标对象
     * @return {Boolean}    true or false
     */
    /**
     * 如果object是一个日期时间，返回true
     * Is a given variable a date?
     * @method isDate
     * <pre>
     _.isDate(new Date());
     => true
     * </pre>
     * @param {Object}  obj 目标对象
     * @return {Boolean}    true or false
     */
    /**
     * 如果object是一个正则表达式，返回true
     * Is a given variable a regExp?
     * @method isRegExp
     * <pre>
     _.isRegExp(/moe/);
     => true
     * </pre>
     * @param {Object}  obj 目标对象
     * @return {Boolean}    true or false
     */
    /**
     * 如果object是一个有限的数字，返回true。
     * Is a given object a finite number?
     * @method isFinite
     * <pre>
     _.isFinite(-101);
     => true
     _.isFinite(-Infinity);
     => false
     * </pre>
     * @param  {Object}  obj 目标对象
     * @return {Boolean}     true or false
     */
    /**
     * 如果object是数组或者NaN，返回true。和原生的isNaN 函数不一样，如果变量是undefined，原生的isNaN 函数也会返回 true
     * Is the given value `NaN`? (NaN is the only number which does not equal itself).
     * @method isNaN
     * <pre>
     _.isNaN(NaN);
     => true
     isNaN(undefined);
     => true
     _.isNaN(undefined);
     => false
     * </pre>
     * @param  {Object}  obj 目标对象
     * @return {Boolean}     true or false
     */
    /**
     * 如果object是一个布尔值，返回true。
     * Is a given value a boolean?
     * @method isBoolean
     * <pre>
     _.isBoolean(null);
     => false
     * </pre>
     * @param  {Object}  obj 目标对象
     * @return {Boolean}     true or false
     */
    /**
     * 如果object的值是 null，返回true。
     * Is a given value equal to null?
     * @method isNull
     * <pre>
     _.isNull(null);
     => true
     _.isNull(undefined);
     => false
     * </pre>
     * @param  {Object}  obj 目标对象
     * @return {Boolean}     true or false
     */

    /**
     * 如果value是undefined，返回true。
     * Is a given variable undefined?
     * @method isUndefined
     * <pre>
     _.isUndefined(window.missingVariable);
     => true
     * </pre>
     * @param  {Object}  obj 目标对象
     * @return {Boolean}     true or false
     */

    /**
     * 对象是否包含给定的键吗？等同于object.hasOwnProperty(key)，但是使用hasOwnProperty 函数的一个安全引用，以防意外覆盖。
     * Shortcut function for checking if an object has a given property directly on itself (in other words, not on a prototype).
     * @method has
     * <pre>
     _.has({a: 1, b: 2, c: 3}, "b");
     => true
     * </pre>
     * @param  {Object} obj 目标对象
     * @param  {String}  key 目标的属性名称
     * @return {Boolean}     对象是否拥有属性true or false
     */

    /**
     * 返回与传入参数相等的值. 相当于数学里的: f(x) = x, 在Underscore里被用作默认的迭代器iterator.
     * Keep the identity function around for default iterators.
     * @method identity
     * <pre>
     var moe = {name: 'moe'};
     moe === _.identity(moe);
     => true
     * </pre>
     * @param  {Object} value 传入的值
     * @return {Object} 返回传入的值
     */

    /**
     * 返回一个函数，函数的返回值就是传入的参数。 相当于x=f(x)();
     * @method constant
     * <pre>
     var obj={a:11};
     var func=_.constant(a);
     func().a
     => 11
     * </pre>
     * @param  {Object} value 传入的值
     * @return {Function}     返回无参函数，函数返回值为传入的值。
     */

    /**
     * 返回一个函数，在函数的参数对象里面取key对应的值
     * Returns a function that will itself return the key property of any passed-in object.
     * @method property
     * <pre>
     var moe = {name: 'moe'};
     'moe' === _.property('name')(moe);
     => true
     * </pre>
     * @param  {String} key 属性名称
     * @return {Function}   返回函数，函数内会取参数对象的属性名用来返回属性值
     */

    /**
     * 返回一个函数，若函数的参数如果都具有attr中一样的属性，则返回true。
     * Returns a predicate function that will tell you if a passed in object contains all of the key/value properties present in attrs.
     * @method mathes
     * <pre>
     var ready = _.matches({selected: true, visible: true});
     var readyToGoList = _.filter(list, ready);
     * </pre>
     * @param  {Object} attrs 需要判断的属性对象
     * @return {Function}      返回函数，函数内会判断参数对象是否都包含attr的属性值，返回true or false
     */

    /**
     * 调用给定的迭代函数n次,每一次传递index参数，调用迭代函数。 注意: 本例使用 链式语法。
     * Run a function **n** times.
     * @method times
     * <pre>
     _(3).times(function(n){ genie.grantWishNumber(n); });
     => alert(n) 分别打印出为0,1,2
     * </pre>
     * @param  {Number} n        函数调用的次数，每调用一次，index加1，index从0开始
     * @param  {Function} iterator 执行函数
     * @param  {Object} context (optional) 如果传递了context参数，则把iterator绑定到context对象上
     * @return {Array}          返回一个长度为n的数组，每个值为每次调用函数的返回值
     */

    /**
     * 返回一个min 和 max之间的随机整数。
     * Return a random integer between min and max (inclusive).
     * @method random
     * <pre>
     _.random(0, 100);
     => 42
     * </pre>
     * @param  {Number} min (optional) 返回的随机整数的最小范围，此参数不传，默认为0，
     * @param  {Number} max (optional) 返回的随机整数的最大范围
     * @return {Number}     返回一个范围内的整数
     */

    /**
     * 返回当前时间的时间戳
     * A (possibly faster) way to get the current timestamp as an integer.
     * @method now
     * <pre>
     _.now();
     => 1393573920327
     * </pre>
     * @return {Number}     返回时间戳
     */

    /**
     * 转义HTML字符串，替换&, <, >, ", ', and /字符。
     * Functions for escaping strings from HTML interpolation.
     * @method escape
     * <pre>
     _.escape('Curly, Larry & Moe');
     => "Curly, Larry &amp; Moe"
     * </pre>
     * @param {String}  string 目标字符串
     * @return {String}        转义后的字符串
     */
    /**
     * 和**{@link loft.desktop.loft#escape escape}**相反。转义HTML字符串，替换&, &lt;, &gt;, &quot;, &#x27;, and &#x2F;字符。
     * Functions for unescaping strings to HTML interpolation.
     * @method unescape
     * <pre>
     _.unescape('Curly, Larry &amp; Moe');
     => "Curly, Larry & Moe"
     * </pre>
     * @param {String}  string 目标字符串
     * @return {String}        还原转义后的字符串，
     */
    /**
     * 如果对象 object 中的属性 property 是函数, 则调用它, 否则, 返回它。
     * If the value of the named `property` is a function then invoke it with the `object` as context; otherwise, return it.
     * @method result
     * <pre>
     var object = {cheese: 'crumpets', stuff: function(){ return 'nonsense'; }};
     _.result(object, 'cheese');
     => "crumpets"
     _.result(object, 'stuff');
     => "nonsense"
     * </pre>
     * @param  {Object} object   目标对象
     * @param  {String} property 属性名
     * @return {Object}          返回属性对应的值，或者属性对应的方法执行的返回值
     */
    /**
     * 您可以用您自己的实用程序函数扩展Underscore。传递一个 {name: function}定义的哈希添加到Underscore对象，以及面向对象封装。
     * Add your own custom functions to the Underscore object.
     * @method mixin
     * <pre>
     _.mixin({
          capitalize: function(string) {
            return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
          }
        });
     _("fabio").capitalize();
     => "Fabio"
     * </pre>
     * @param  {Object} obj 定义为{name: function}的对象附加到Underscore原型链上，支持Underscore对象之间调用name()方法来执行function
     * @return {Object}     将方法定义到Underscore原型链上
     */
    /**
     * 为需要的客户端模型或DOM元素生成一个全局唯一的id。
     * Generate a unique integer id (unique within the entire client session).
     * Useful for temporary DOM ids.
     * @method uniqueId
     * <pre>
     _.uniqueId('contact_');
     => 'contact_104'
     * </pre>
     * @param  {String} prefix (optional) 如果prefix参数存在， id 将附加给它。
     * @return {String}        生成全局唯一的字符串
     */

    /**
     * 对一个对象使用 chain 方法, 会把这个对象封装并 让以后每次方法的调用结束后都返回这个封装的对象.支持链式语法
     * Add a "chain" function, which will delegate to the wrapper.
     * @method chain
     * <pre>
     var stooges = [{name: 'curly', age: 25}, {name: 'moe', age: 21}, {name: 'larry', age: 23}];
     var youngest = _.chain(stooges)
     .sortBy(function(stooge){ return stooge.age; })
     .map(function(stooge){ return stooge.name + ' is ' + stooge.age; })
     .first()
     .value();
     => "moe is 21"
     * </pre>
     * @param  {Object} obj 目标对象
     * @return {Object}     返回链式对象
     */
    /**
     * 获取封装对象的最终值.
     * Extracts the result from a wrapped and chained object.
     * @method value
     * <pre>
     _([1, 2, 3]).value();
     => [1, 2, 3]
     * </pre>
     * @return {Object} 返回封装对象的原始值
     */

}(loft, _);
/**
 * @class loft.mobile.util.Cookies
 * Cookie工具
 *
 * <pre>
 *   loft.cookies.put("username","test");
 *   loft.cookies.get("username");
 * </pre>
 */

!function () {
    "use strict";

    var lastCookies = {};
    var lastCookieString = '';
    var $base = $(document).find('base');

    function baseHref() {
        var href = $base.attr('href');
        return href ? href.replace(/^(https?\:)?\/\/[^\/]*/, '') : '';
    }

    function cookieReader() {
        var currentCookieString = document.cookie,
            cookieArray, cookie, i, index, name;

        if (currentCookieString !== lastCookieString) {
            lastCookieString = currentCookieString;
            cookieArray = lastCookieString.split('; ');
            lastCookies = {};

            for (i = 0; i < cookieArray.length; i++) {
                cookie = cookieArray[i];
                index = cookie.indexOf('=');
                if (index > 0) { //ignore nameless cookies
                    name = decodeURIComponent(cookie.substring(0, index));
                    // the first value that is seen for a cookie is the most
                    // specific one.  values for the same cookie name that
                    // follow are for less specific paths.
                    if (lastCookies[name] === undefined) {
                        lastCookies[name] = decodeURIComponent(cookie.substring(index + 1));
                    }
                }
            }
        }
        return lastCookies;
    }

    function cookieWriter() {
        var cookiePath = baseHref();

        function buildCookieString(name, value, options) {
            var path, expires;
            options = options || {};
            expires = options.expires;

            path = _.isUndefined(options.path) ? cookiePath : options.path;
            if (value === undefined) {
                expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
                value = '';
            }
            if (_.isString(expires)) {
                expires = new Date(expires);
            }

            var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
            str += path ? ';path=' + path : '';
            str += options.domain ? ';domain=' + options.domain : '';
            str += expires ? ';expires=' + expires.toUTCString() : '';
            str += options.secure ? ';secure' : '';

            // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
            // - 300 cookies
            // - 20 cookies per unique domain
            // - 4096 bytes per cookie
            var cookieLength = str.length + 1;
            if (cookieLength > 4096) {
                log.warn("Cookie '" + name +
                "' possibly not set or overflowed because it was too large (" +
                cookieLength + " > 4096 bytes)!");
            }

            return str;
        }

        return function(name, value, options) {
            document.cookie = buildCookieString(name, value, options);
        };
    }

    loft.cookies = {
        /**
         * 获取cookie记录
         * @param {String} key
         * @return {Object} key对应的cookie记录
         */
        get: function (key) {
            var value = cookieReader()[key];
            return _.isString(value) ? JSON.parse(value) : value;
        },

        /**
         * 设置cookie记录
         * @param {String} key
         * @param {Object} value
         * @param {Object} options 设置cookie的参数，如失效时长
         */
        set: function (key, value, options) {
            cookieWriter()(key, JSON.stringify(value), options);
        },

        /**
         * 使cookie立即失效
         * @param  {String} key
         * @param  {Object} [options] 设置cookie的参数
         * @return {Boolean} 如果key值不在cookie内，返回false表示操作失败
         */
        remove: function (key) {
            this.set(key, undefined);
        }
    };
}();

/**
 * 日期格式化工具
 * @class loft.mobile.util.DateUtil
 * <pre>
 loft.dateutil.getDaysInMonth(2015,1);
 * </pre>
 */
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define('loft.dateutil', factory);
    } else {
        factory();
    }
})(function() {
    var MILLIS_PER_SECOND = 1000,
        MILLIS_PER_MINUTE = 60 * MILLIS_PER_SECOND,
        MILLIS_PER_HOUR = 60 * MILLIS_PER_MINUTE,
        MILLIS_PER_DAY = 24 * MILLIS_PER_HOUR,
        NON_PUNCTUATION_EXPRESSION = /[^ -\/:-@\[-`{-~\t\n\rTZ]+/g;


    function getStartOfDay(date){
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    }


    function getEndOfDay(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
    }

    function addYears(date, years) {
        var result = new Date(date.getTime());
        result.setYear(date.getFullYear() + years);
        return result;
    }

    function addMonths(date, months) {
        var result = new Date(date.getTime());
        result.setMonth(date.getMonth() + months);
        result = handleShorterMonth(date, result);
        return result;
    }

    function addDays(date, days) {
        return add(date, MILLIS_PER_DAY, days);
    }

    function addHours(date, hours) {
        return add(date, MILLIS_PER_HOUR, hours);
    }

    function addMinutes(date, minutes) {
        return add(date, MILLIS_PER_MINUTE, minutes);
    }

    function add(date, multiplier, num) {
        var resultTime = date.getTime() + multiplier * num;
        return new Date(resultTime);
    }

    function handleShorterMonth(originalDate, newDate) {
        var result = newDate;
        var originalDayOfMonth = originalDate.getDate();
        if (originalDayOfMonth > result.getDate()) {
            result = addDays(newDate, -(newDate.getDate()));
        }
        return result;
    }

    function formatDate(date, format) {
        if (date == null) {
            return '';
        }
        var meridian = loft.getResource('datetimepicker.meridiem'),
            monthsShort = loft.getResource('datetimepicker.monthsShort'),
            months = loft.getResource('datetimepicker.months'),
            daysShort = loft.getResource('datetimepicker.daysShort'),
            days = loft.getResource('datetimepicker.days'),
            val = {
                // year
                yy: date.getFullYear().toString().substring(2),
                yyyy: date.getFullYear(),
                // month
                m: date.getMonth() + 1,
                M: monthsShort[date.getMonth()],
                MM: months[date.getMonth()],
                // day
                d: date.getDate(),
                D: daysShort[date.getDay()],
                DD: days[date.getDay()],
                p: (meridian.length == 2 ? meridian[date.getHours() < 12 ? 0 : 1] : ''),
                // hour
                h: date.getHours(),
                // minute
                i: date.getMinutes(),
                // second
                s: date.getSeconds()
            };

        format = parseFormat(format);

        if (meridian.length == 2) {
            val.H = (val.h % 12 == 0 ? 12 : val.h % 12);
        } else {
            val.H = val.h;
        }
        val.HH = (val.H < 10 ? '0' : '') + val.H;
        val.P = val.p.toUpperCase();
        val.hh = (val.h < 10 ? '0' : '') + val.h;
        val.ii = (val.i < 10 ? '0' : '') + val.i;
        val.ss = (val.s < 10 ? '0' : '') + val.s;
        val.dd = (val.d < 10 ? '0' : '') + val.d;
        val.mm = (val.m < 10 ? '0' : '') + val.m;
        var date = [],
            seps = $.extend([], format.separators);
        for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
            if (seps.length) {
                date.push(seps.shift());
            }
            date.push(val[format.parts[i]]);
        }
        if (seps.length) {
            date.push(seps.shift());
        }
        return date.join('');
    }

    function parseFormat(format) {
        var pattern = /hh?|HH?|p|P|ii?|ss?|dd?|DD?|mm?|MM?|yy(?:yy)?/g,
            separators = format.replace(pattern, '\0').split('\0'),
            parts = format.match(pattern);
        if (!separators || !separators.length || !parts || parts.length == 0) {
            throw new Error("Invalid date format.");
        }
        return {
            separators: separators,
            parts: parts
        };
    }

    function parseDate(date, format) {
        if (date instanceof Date) {
            return date;
        }

        if (date == null || date.length != format.length)
            return null;

        if (/^[-+]\d+[dmwy]([\s,]+[-+]\d+[dmwy])*$/.test(date)) {
            var part_re = /([-+]\d+)([dmwy])/,
                parts = date.match(/([-+]\d+)([dmwy])/g),
                part, dir;
            date = new Date();
            for (var i = 0; i < parts.length; i++) {
                part = part_re.exec(parts[i]);
                dir = parseInt(part[1]);
                switch (part[2]) {
                    case 'd':
                        date.setDate(date.getDate() + dir);
                        break;
                    case 'm':
                        date = addMonths(date, dir);
                        break;
                    case 'w':
                        date.setDate(date.getDate() + dir * 7);
                        break;
                    case 'y':
                        date = addYears(date, dir);
                        break;
                }
            }
            return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0);
        }

        format = parseFormat(format);

        var parts = date && date.match(NON_PUNCTUATION_EXPRESSION) || [],
            date = new Date(0, 0, 0, 0, 0, 0, 0),
            months = loft.getResource('datetimepicker.months'),
            monthsShort = loft.getResource('datetimepicker.monthsShort'),
            meridian = loft.getResource('datetimepicker.meridian'),
            parsed = {},
            setters_order = ['hh', 'h', 'ii', 'i', 'ss', 's', 'yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'D', 'DD', 'd', 'dd', 'H', 'HH', 'p', 'P'],
            setters_map = {
                hh: function(d, v) {
                    return d.setHours(v);
                },
                h: function(d, v) {
                    return d.setHours(v);
                },
                HH: function(d, v) {
                    return d.setHours(v == 12 ? 0 : v);
                },
                H: function(d, v) {
                    return d.setHours(v == 12 ? 0 : v);
                },
                ii: function(d, v) {
                    return d.setMinutes(v);
                },
                i: function(d, v) {
                    return d.setMinutes(v);
                },
                ss: function(d, v) {
                    return d.setSeconds(v);
                },
                s: function(d, v) {
                    return d.setSeconds(v);
                },
                yyyy: function(d, v) {
                    return d.setFullYear(v);
                },
                yy: function(d, v) {
                    return d.setFullYear(2000 + v);
                },
                m: function(d, v) {
                    v -= 1;
                    while (v < 0) v += 12;
                    v %= 12;
                    d.setMonth(v);
                    while (d.getMonth() != v)
                        d.setDate(d.getDate() - 1);
                    return d;
                },
                d: function(d, v) {
                    return d.setDate(v);
                },
                p: function(d, v) {
                    return d.setHours(v == 1 ? d.getHours() + 12 : d.getHours());
                }
            },
            val, filtered, part;
        setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
        setters_map['dd'] = setters_map['d'];
        setters_map['P'] = setters_map['p'];
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
        if (parts.length == format.parts.length) {
            for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
                val = parseInt(parts[i], 10);
                part = format.parts[i];
                if (isNaN(val)) {
                    switch (part) {
                        case 'MM':
                            filtered = $(months).filter(function() {
                                var m = this.slice(0, parts[i].length),
                                    p = parts[i].slice(0, m.length);
                                return m == p;
                            });
                            val = $.inArray(filtered[0], months) + 1;
                            break;
                        case 'M':
                            filtered = $(monthsShort).filter(function() {
                                var m = this.slice(0, parts[i].length),
                                    p = parts[i].slice(0, m.length);
                                return m == p;
                            });
                            val = $.inArray(filtered[0], monthsShort) + 1;
                            break;
                        case 'p':
                        case 'P':
                            val = $.inArray(parts[i].toLowerCase(), meridian);
                            break;
                    }
                }
                parsed[part] = val;
            }
            for (var i = 0, s; i < setters_order.length; i++) {
                s = setters_order[i];
                if (s in parsed && !isNaN(parsed[s]))
                    setters_map[s](date, parsed[s])
            }
        }
        return date;
    }

    function isLeapYear(year) {
        return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
    }

    function getDaysInMonth(year, month) {
        return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    }

    return loft.dateutil = {
        addYears: addYears,
        addMonths: addMonths,
        addDays: addDays,
        addHours: addHours,
        addMinutes: addMinutes,
        format: formatDate,
        parse: parseDate,
        getDaysInMonth: getDaysInMonth,
        getStartOfDay: getStartOfDay,
        getEndOfDay: getEndOfDay
    };

    /**
     * 获取一天的起始时间点
     * @method getStartOfDay
     * @param  {Date} date
     * @return {Date}
     */
    
    /**
     * 获取一天的结束时间点
     * @method getEndOfDay
     * @param  {Date} date
     * @return {Date}
     */
    
    /**
     * 在指定的时间点上加上指定的年数
     * @method addYears
     * @param  {Date} date
     * @param  {number} years
     * @return {Date}
     */
    
    /**
     * 在指定的时间点上加上指定的月数
     * @method addMonths
     * @param  {Date} date
     * @param  {number} months
     * @return {Date}
     */
    
    /**
     * 在指定的时间点上加上指定的天数
     * @method addDays
     * @param  {Date} date
     * @param  {number} days
     * @return {Date}
     */
    
    /**
     * 在指定的时间点上加上指定的小时数
     * @method addHours
     * @param  {Date} date
     * @param  {number} days
     * @return {Date}
     */
    
    /**
     * 在指定的时间点上加上指定的分钟数
     * @method addMinutes
     * @param  {Date} date
     * @param  {number} days
     * @return {Date}
     */
    
    /**
     * 在指定的时间点上加上指定的时间
     * @method add
     * @param  {Date} date 时间
     * @param  {number} multiplier  乘数
     * @param  {number} num  毫秒
     * @return {Date}
     */
    
    /**
     * 处理缩略月份
     * @method handleShorterMonth
     * @param  {Date} originalDate 原来的时间
     * @param  {Date} newDate  新的时间
     * @return {Date}
     */
    
    /**
     * 日期字符串格式化
     * @method formatDate
     * @param  {Date} date 时间
     * @param  {String} format  格式化字符串
     * @return {String}
     */
    
    /**
     * 判断是否是闰年
     * @method isLeapYear
     * @param  {number} year 年份
     * @return {Boolean}
     */
    
    /**
     * 获取指定的月份有多少天
     * @method getDaysInMonth
     * @param  {number} year 年份
     * @param  {number} month 月份
     * @return {number}
     */
});
/**
 * @class loft.mobile.util.MD5
 * md5加密工具
 * <pre>
 *   loft.MD5(string, key)
 * </pre>
 */

!function () {
    'use strict';

    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
            msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    /*
     * These functions implement the four basic operations the algorithm uses.
     */
    function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }

    function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length.
     */
    function binl_md5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << (len % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var i, olda, oldb, oldc, oldd,
            a = 1732584193,
            b = -271733879,
            c = -1732584194,
            d = 271733878;

        for (i = 0; i < x.length; i += 16) {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;

            a = md5_ff(a, b, c, d, x[i], 7, -680876936);
            d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

            a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = md5_gg(b, c, d, a, x[i], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = md5_hh(d, a, b, c, x[i], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i], 6, -198630844);
            d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return [a, b, c, d];
    }

    /*
     * Convert an array of little-endian words to a string
     */
    function binl2rstr(input) {
        var i,
            output = '';
        for (i = 0; i < input.length * 32; i += 8) {
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        }
        return output;
    }

    /*
     * Convert a raw string to an array of little-endian words
     * Characters >255 have their high-byte silently ignored.
     */
    function rstr2binl(input) {
        var i,
            output = [];
        output[(input.length >> 2) - 1] = undefined;
        for (i = 0; i < output.length; i += 1) {
            output[i] = 0;
        }
        for (i = 0; i < input.length * 8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
        }
        return output;
    }

    /*
     * Calculate the MD5 of a raw string
     */
    function rstr_md5(s) {
        return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
    }

    /*
     * Calculate the HMAC-MD5, of a key and some data (raw strings)
     */
    function rstr_hmac_md5(key, data) {
        var i,
            bkey = rstr2binl(key),
            ipad = [],
            opad = [],
            hash;
        ipad[15] = opad[15] = undefined;
        if (bkey.length > 16) {
            bkey = binl_md5(bkey, key.length * 8);
        }
        for (i = 0; i < 16; i += 1) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
        return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
    }

    /*
     * Convert a raw string to a hex string
     */
    function rstr2hex(input) {
        var hex_tab = '0123456789abcdef',
            output = '',
            x,
            i;
        for (i = 0; i < input.length; i += 1) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F) +
            hex_tab.charAt(x & 0x0F);
        }
        return output;
    }

    /*
     * Encode a string as utf-8
     */
    function str2rstr_utf8(input) {
        return unescape(encodeURIComponent(input));
    }

    /*
     * Take string arguments and return either raw or hex encoded strings
     */
    function raw_md5(s) {
        return rstr_md5(str2rstr_utf8(s));
    }

    function hex_md5(s) {
        return rstr2hex(raw_md5(s));
    }

    function raw_hmac_md5(k, d) {
        return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
    }

    function hex_hmac_md5(k, d) {
        return rstr2hex(raw_hmac_md5(k, d));
    }

    /**
     * @method MD5
     * MD5是输入不定長度信息，輸出固定長度128-bits的演算法。经过程序流程，生成四个32位数据，最后联合起来成为一个128-bits散列。基本方式为，求余、取余、调整长度、与链接变量进行循环运算。得出结果。一般128位的MD5散列被表示为32位十六进制数字
     *   loft.MD5提供了两种形式的结果返回，一个是16进制形式，一种未经转换的128位散列值
     * @param {String} string 输入的信息
     * @param {String} key    密钥
     * @param {Boolean} [raw=false]    是否返回128bit的散列摘要
     * @return {String} 如果raw传入true，则返回128bit的散列摘要；否则返回32位16进制数字摘要
     */
    loft.MD5 = function (string, key, raw) {
        if (!key) {
            if (!raw) {
                return hex_md5(string);
            }
            return raw_md5(string);
        }
        if (!raw) {
            return hex_hmac_md5(key, string);
        }
        return raw_hmac_md5(key, string);
    }
}();

/*   
 *   A   JavaScript   implementation   of   the   Secure   Hash   Algorithm,   SHA-1,   as   defined   
 *   in   FIPS   PUB   180-1   
 *   Version   2.1-BETA   Copyright   Paul   Johnston   2000   -   2002.   
 *   Other   contributors:   Greg   Holt,   Andrew   Kepert,   Ydnar,   Lostinet   
 *   Distributed   under   the   BSD   License   
 *   See   http://pajhome.org.uk/crypt/md5   for   details.   
 */
/*   
 *   Configurable   variables.   You   may   need   to   tweak   these   to   be   compatible   with   
 *   the   server-side,   but   the   defaults   work   in   most   cases.   
 */
var hexcase = 0; /*   hex   output   format.   0   -   lowercase;   1   -   uppercase                 */
var b64pad = ""; /*   base-64   pad   character.   "="   for   strict   RFC   compliance       */
var chrsz = 8; /*   bits   per   input   character.   8   -   ASCII;   16   -   Unicode             */

/*   
 *   These   are   the   functions   you'll   usually   want   to   call   
 *   They   take   string   arguments   and   return   either   hex   or   base-64   encoded   strings   
 */
function hex_sha1(s) {
    return binb2hex(core_sha1(str2binb(s), s.length * chrsz));
}

function b64_sha1(s) {
    return binb2b64(core_sha1(str2binb(s), s.length * chrsz));
}

function str_sha1(s) {
    return binb2str(core_sha1(str2binb(s), s.length * chrsz));
}

function hex_hmac_sha1(key, data) {
    return binb2hex(core_hmac_sha1(key, data));
}

function b64_hmac_sha1(key, data) {
    return binb2b64(core_hmac_sha1(key, data));
}

function str_hmac_sha1(key, data) {
    return binb2str(core_hmac_sha1(key, data));
}

/*   
 *   Perform   a   simple   self-test   to   see   if   the   VM   is   working   
 */
function sha1_vm_test() {
    return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

/*   
 *   Calculate   the   SHA-1   of   an   array   of   big-endian   words,   and   a   bit   length   
 */
function core_sha1(x, len) {
    /*   append   padding   */
    x[len >> 5] |= 0x80 << (24 - len % 32);
    x[((len + 64 >> 9) << 4) + 15] = len;

    var w = Array(80);
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    var e = -1009589776;

    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        var olde = e;

        for (var j = 0; j < 80; j++) {
            if (j < 16) w[j] = x[i + j];
            else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
            e = d;
            d = c;
            c = rol(b, 30);
            b = a;
            a = t;
        }

        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
        e = safe_add(e, olde);
    }
    return Array(a, b, c, d, e);

}

/*   
 *   Perform   the   appropriate   triplet   combination   function   for   the   current   
 *   iteration   
 */
function sha1_ft(t, b, c, d) {
    if (t < 20) return (b & c) | ((~b) & d);
    if (t < 40) return b ^ c ^ d;
    if (t < 60) return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
}

/*   
 *   Determine   the   appropriate   additive   constant   for   the   current   iteration   
 */
function sha1_kt(t) {
    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
}

/*   
 *   Calculate   the   HMAC-SHA1   of   a   key   and   some   data   
 */
function core_hmac_sha1(key, data) {
    var bkey = str2binb(key);
    if (bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);

    var ipad = Array(16),
        opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }

    var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
    return core_sha1(opad.concat(hash), 512 + 160);
}

/*   
 *   Add   integers,   wrapping   at   2^32.   This   uses   16-bit   operations   internally   
 *   to   work   around   bugs   in   some   JS   interpreters.   
 */
function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}

/*   
 *   Bitwise   rotate   a   32-bit   number   to   the   left.   
 */
function rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
}

/*   
 *   Convert   an   8-bit   or   16-bit   string   to   an   array   of   big-endian   words   
 *   In   8-bit   function,   characters   >255   have   their   hi-byte   silently   ignored.   
 */
function str2binb(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
    return bin;
}

/*   
 *   Convert   an   array   of   big-endian   words   to   a   string   
 */
function binb2str(bin) {
    var str = "";
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i >> 5] >>> (24 - i % 32)) & mask);
    return str;
}

/*   
 *   Convert   an   array   of   big-endian   words   to   a   hex   string.   
 */
function binb2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
    }
    return str;
}

/*   
 *   Convert   an   array   of   big-endian   words   to   a   base-64   string   
 */
function binb2b64(binarray) {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i += 3) {
        var triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
            else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
        }
    }
    return str;
}
/**
 * @class loft.mobile.util.Store
 * 本地存储，localStorage适配层
 * <pre>
 *   loft.store.set(key, value)
 *   loft.store.get(key)
 * </pre>
 */
loft.store = {
    /**
     * 获取本地存储容量数量
     * @method length
     * @return {Number} 返回本地存储容量数量
     */
    length: function() {
        return localStorage.length;
    },
    /**
     * 存储
     * @method set
     * @param {Object} key 键名
     * @param {Object} value 存储内容
     */
    set: function(key, value) {
        localStorage.setItem(key, value);
    },
    /**
     * 获取对应key内容
     * @method get
     * @param {Object} key 键名
     * @return {Object}
     */
    get: function(key) {
        return localStorage.getItem(key);
    },
    /**
     * 删除对应key
     * @method remove
     * @param {Object} key 键名
     */
    remove: function(key) {
        localStorage.removeItem(key);
    },
    /**
     * 清空所有项
     * @method clear
     */
    clear: function() {
        localStorage.clear();
    },
    /**
     * 遍历
     * @method each
     * @param {Function} fn 回调函数
     * @param {Object} fn.key 键
     * @param {Object} fn.value 值
     */
    each: function(fn) {
        var n = localStorage.length,
            i = 0,
            fn = fn || function() {};
        for (; i < n; i++) {
            var key = localStorage.key(i);
            if (fn.call(this, key, this.get(key)) === false)
                break;
            //如果内容被删除，则总长度和索引都同步减少
            if (localStorage.length < n) {
                n--;
                i--;
            }
        }
    }
};

/**
 * @file 弹出框组件
 * @name Dialog
 * @desc 弹出框组件
 * @import core/zepto.ui.js, core/zepto.highlight.js
 */
(function($, undefined) {
    var tpl = {
        close: '<a class="ui-dialog-close" title="关闭"><span class="ui-icon ui-icon-delete"></span></a>',
        mask: '<div class="ui-mask"></div>',
        title: '<div class="ui-dialog-title">'+
                    '<h3><%=title%></h3>'+
                '</div>',
        wrap: '<div class="ui-dialog">'+
            '<div class="ui-dialog-content"></div>'+
            '<% if(btns){ %>'+
            '<div class="ui-dialog-btns">'+
            '<% for(var i=0, length=btns.length; i<length; i++){var item = btns[i]; %>'+
            '<a class="ui-btn ui-btn-<%=item.index%>" data-key="<%=item.key%>"><%=item.text%></a>'+
            '<% } %>'+
            '</div>'+
            '<% } %>' +
            '</div> '
    };

    /**
     * @name $.ui.dialog
     * @grammar $.ui.dialog(options) ⇒ instance
     * @grammar dialog(options) ⇒ self
     * @desc **Options**
     * - ''autoOpen'' {Boolean}: (可选，默认：true)初始化后是否自动弹出
     * - ''closeBtn'' {Boolean}: (可选，默认：true)是否显示关闭按钮
     * - ''mask'' {Boolean}: (可选，默认：true)是否有遮罩层
     * - ''scrollMove'' {Boolean}: (可选，默认：true)是否禁用掉scroll，在弹出的时候
     * - ''title'' {String}: (可选)弹出框标题
     * - ''content'' {String|Selector}: (render模式下必填)弹出框内容
     * - ''width'' {String|Number}: (可选，默认: 300)弹出框宽度
     * - ''height'' {String|Number}: (可选，默认: \'auto\')弹出框高度
     * - ''buttons'' {Object}: (可选) 用来设置弹出框底部按钮，传入的格式为{key1: fn1, key2, fn2}，key将作为按钮的文字，fn将作为按钮点击后的Handler
     * - ''events'' 所有[Trigger Events](#dialog_triggerevents)中提及的事件都可以在此设置Hander, 如init: function(e){}。
     *
     * **如果是setup模式，部分参数是直接从DOM上读取**
     * - ''title'' 从element的title属性中读取
     * - ''content'' 直接为element。
     *
     * **比如**
     * <code>//<div id="dialog" title="弹出框标题"></div>
     * console.log($('#dialog').dialog('data', 'title')); // => 弹出框标题
     * console.log($('#dialog').dialog('data', 'content')); // => #dialog(Zepto对象)
     * </code>
     *
     * **Demo**
     * <codepreview href="../gmu/_examples/widget/dialog/dialog.html">
     * ../gmu/_examples/widget/dialog/dialog.html
     * </codepreview>
     */
    $.ui.define('dialog', {
        _data: {
            autoOpen: true,
            buttons: null,
            closeBtn: true,
            mask: true,
            width: 300,
            height: 'auto',
            title: null,
            content: null,
            scrollMove: true,//是否禁用掉scroll，在弹出的时候
            container: null,
            maskClick: null,
            position: null //需要dialog.position插件才能用
        },

        /**
         * @name getWrap
         * @grammar getWrap() ⇒ Zepto instance
         * @desc 获取最外层的节点。
         */
        getWrap: function(){
            return this._data._wrap;
        },

        _setup: function(){
            var data = this._data;
            data.content = data.content || this._el.show();
            data.title = data.title || this._el.attr('title');
        },

        _init: function(){
            var me = this, data = me._data, btns,
                i= 0, eventHanlder = $.proxy(me._eventHandler, me), vars = {};

            data._container = $(data.container || document.body);
            (data._cIsBody = data._container.is('body')) || data._container.addClass('ui-dialog-container');
            vars.btns = btns= [];
            data.buttons && $.each(data.buttons, function(key){
                btns.push({
                    index: ++i,
                    text: key,
                    key: key
                });
            });
            data._mask = data.mask ? $(tpl.mask).appendTo(data._container) : null;
            data._wrap = $($.parseTpl(tpl.wrap, vars)).appendTo(data._container);
            data._content = $('.ui-dialog-content', data._wrap);

            data._title = $(tpl.title);
            data._close = data.closeBtn && $(tpl.close).highlight('ui-dialog-close-hover');
            me._el = me._el || data._content;//如果不需要支持render模式，此句要删除

            me.title(data.title);
            me.content(data.content);

            btns.length && $('.ui-dialog-btns .ui-btn', data._wrap).highlight('ui-state-hover');
            data._wrap.css({
                width: data.width,
                height: data.height
            });

            //bind events绑定事件
            $(window).on('ortchange', eventHanlder);
            data._wrap.on('click', eventHanlder);
            data._mask && data._mask.on('click', eventHanlder);
            data.autoOpen && me.root().one('init', function(){me.open();});
        },

        _eventHandler: function(e){
            var me = this, match, wrap, data = me._data, fn;
            switch(e.type){
                case 'ortchange':
                    this.refresh();
                    break;
                case 'touchmove':
                    data.scrollMove && e.preventDefault();
                    break;
                case 'click':
                    if(data._mask && ($.contains(data._mask[0], e.target) || data._mask[0] === e.target )){
                        return me.trigger('maskClick');
                    }
                    wrap = data._wrap.get(0);
                    if( (match = $(e.target).closest('.ui-dialog-close', wrap)) && match.length ){
                        me.close();
                    } else if( (match = $(e.target).closest('.ui-dialog-btns .ui-btn', wrap)) && match.length ) {
                        fn = data.buttons[match.attr('data-key')];
                        fn && fn.apply(me, arguments);
                    }
            }
        },

        _calculate: function(){
            var me = this, data = me._data, size, $win, root = document.body,
                ret = {}, isBody = data._cIsBody, round = Math.round;

            data.mask && (ret.mask = isBody ? {
                width:  root.clientWidth,
                height: Math.max(root.scrollHeight, root.clientHeight)-1//不减1的话uc浏览器再旋转的时候不触发resize.奇葩！
            }:{
                width: '100%',
                height: '100%'
            });

            size = data._wrap.offset();
            $win = $(window);
            ret.wrap = {
                left: '50%',
                marginLeft: -round(size.width/2) +'px',
                top: isBody?round($win.height() / 2) + window.pageYOffset:'50%',
                marginTop: -round(size.height/2) +'px'
            }
            return ret;
        },

        /**
         * @name refresh
         * @grammar refresh() ⇒ instance
         * @desc 用来更新弹出框位置和mask大小。如父容器大小发生变化时，可能弹出框位置不对，可以外部调用refresh来修正。
         */
        refresh: function(){
            var me = this, data = me._data, ret;
            if(data._isOpen) {
                ret = this._calculate();
                ret.mask && data._mask.css(ret.mask);
                data._wrap.css(ret.wrap);
            }
            return me;
        },

        /**
         * @name open
         * @grammar open() ⇒ instance
         * @grammar open(x, y) ⇒ instance
         * @desc 弹出弹出框，如果设置了位置，内部会数值转给[position](widget/dialog.js#position)来处理。
         */
        open: function(x, y){
            var data = this._data;
            data._isOpen = true;

            data._wrap.css('display', 'block');
            data._mask && data._mask.css('display', 'block');

            x !== undefined && this.position ? this.position(x, y) : this.refresh();

            $(document).on('touchmove', $.proxy(this._eventHandler, this));
            return this.trigger('open');
        },

        /**
         * @name close
         * @grammar close() ⇒ instance
         * @desc 关闭弹出框
         */
        close: function(){
            var eventData, data = this._data;

            eventData = $.Event('beforeClose');
            this.trigger(eventData);
            if(eventData.defaultPrevented)return this;

            data._isOpen = false;
            data._wrap.css('display', 'none');
            data._mask && data._mask.css('display', 'none');

            $(document).off('touchmove', this._eventHandler);
            return this.trigger('close');
        },

        /**
         * @name title
         * @grammar title([value]) ⇒ value
         * @desc 设置或者获取弹出框标题。value接受带html标签字符串
         * @example $('#dialog').dialog('title', '标题<span>xxx</span>');
         */
        title: function(value) {
            var data = this._data, setter = value !== undefined;
            if(setter){
                value = (data.title = value) ? '<h3>'+value+'</h3>' : value;
                data._title.html(value)[value?'prependTo':'remove'](data._wrap);
                data._close && data._close.prependTo(data.title? data._title : data._wrap);
            }
            return setter ? this : data.title;
        },

        /**
         * @name content
         * @grammar content([value]) ⇒ value
         * @desc 设置或者获取弹出框内容。value接受带html标签字符串和zepto对象。
         * @example
         * $('#dialog').dialog('content', '内容');
         * $('#dialog').dialog('content', '<div>内容</div>');
         * $('#dialog').dialog('content', $('#content'));
         */
        content: function(val) {
            var data = this._data, setter = val!==undefined;
            setter && data._content.empty().append(data.content = val);
            return setter ? this: data.content;
        },

        /**
         * @desc 销毁组件。
         * @name destroy
         * @grammar destroy()  ⇒ instance
         */
        destroy: function(){
            var data = this._data, _eventHander = this._eventHandler;
            $(window).off('ortchange', _eventHander);
            $(document).off('touchmove', _eventHander);
            data._wrap.off('click', _eventHander).remove();
            data._mask && data._mask.off('click', _eventHander).remove();
            data._close && data._close.highlight();
            return this.$super('destroy');
        }

        /**
         * @name Trigger Events
         * @theme event
         * @desc 组件内部触发的事件
         *
         * ^ 名称 ^ 处理函数参数 ^ 描述 ^
         * | init | event | 组件初始化的时候触发，不管是render模式还是setup模式都会触发 |
         * | open | event | 当弹出框弹出后触发 |
         * | beforeClose | event | 在弹出框关闭之前触发，可以通过e.preventDefault()来阻止 |
         * | close | event | 在弹出框关闭之后触发 |
         * | destory | event | 组件在销毁的时候触发 |
         */
    });
})(Zepto);
/**
 * @file Dialog － 父容器插件
 * @name Dialog － 父容器插件
 * @short Dialog.container
 * @import widget/dialog.js, core/zepto.position.js
 */
(function ($, undefined) {
    /**
     * @name Position插件
     * @desc 用
     *
     * **Demo**
     * <codepreview href="../gmu/_examples/widget/dialog/dialog_container.html">
     * ../gmu/_examples/widget/dialog/dialog_container.html
     * </codepreview>
     */
    $.ui.dialog.register(function () {
        return {
            pluginName: 'position',

            _init: function(){
                var data = this._data;
                this._initOrg();
                data.position = data.position || {of: data.container || window, at: 'center', my: 'center'};
            },

            /**
             * @name position
             * @grammar position(x, y) ⇒ instance
             * @desc 用来设置弹出框的位置，如果不另外设置，组件默认为上下左右居中对齐。位置参数接受，数值，百分比，带单位的数值，或者'center'。
             * 如: 100， 100px, 100em, 10%, center;
             * @notice 暂时不支持 left, right, top, bottom.
             */
            position: function(x, y){
                var data = this._data;
                if(!$.isPlainObject(x)){//兼容老格式！
                    data.position.at = 'left'+(x>0?'+'+x: x)+' top'+(y>0?'+'+y: y);
                } else $.extend(data.position, x);
                return this.refresh();
            },
            
            _calculate:function () {
                var me = this, data = me._data, position = data.position,
                    ret = this._calculateOrg();

                data._wrap.position($.extend(position, {
                    using: function(position){
                        ret.wrap = position;
                    }
                }));
                return ret;
            }
        }
    });
})(Zepto);

/**
 * @file 弹出框组件
 * @name Dialog
 * @desc 弹出框组件
 * @import core/zepto.ui.js, core/zepto.highlight.js
 */
(function($, undefined) {
    var tpl = {
        wrap: '<div class="ui-spinner"><button id="min" class="ui-spinner-button" name="" value="-" disabled="false">-</button>' +
            '<input id="text_box" name="" type="number">' +
            '<button class="ui-spinner-button" id="add" name="" value="+">+</button></div>'
    };

    $.ui.define('spinner', {
        _data: {
            max: 10,
            start: 1,
            onBtnClick: null
        },

        getValue: function() {
            return $('#text_box').val();
        },

        _setup: function() {
            $(tpl.wrap).appendTo(this.root());

        },

        _init: function() {
            var me = this,
                data = me._data;
            t = $('#text_box');
            $('#text_box').val(data.start);
            // //数量增加操作
            $("#add").click(function() {
                    t.val(parseInt(t.val()) + 1);
                    $(document).trigger('uispinner::btnClick', t.val());
                    if (parseInt(t.val()) !== 1) {
                        $('#min').removeAttr('disabled');
                    }

                    if (parseInt(t.val()) == data.max) {
                        $('#add').attr('disabled', false);
                    }
                })
                //数量减少操作
            $("#min").click(function() {
                t.val(parseInt(t.val()) - 1);
                $(document).trigger('uispinner::btnClick', t.val());
                if (parseInt(t.val()) === 1) {
                    $('#min').attr('disabled', false);
                }
                if (parseInt(t.val()) < data.max) {
                    $('#add').removeAttr('disabled');
                }
            })

            $('#text_box').on('keyup', function(e) {
                var key = e.which; //按键的值
                var $this = $(this);
                var textVal = $this.val();
                if (textVal !== '') {
                    if (!isNaN(parseInt(textVal, 10)) && parseInt(textVal, 10) < data.max && parseInt(textVal, 10) > 1) {
                        $(document).trigger('uispinner::btnClick', parseInt(textVal, 10));
                        $this.val(parseInt(textVal, 10));
                        $('#add').removeAttr('disabled');
                        $('#min').removeAttr('disabled');
                    } else if (parseInt(textVal, 10) === 1) {
                        $this.val(1);
                        $('#min').attr('disabled', false);
                        $(document).trigger('uispinner::btnClick', 1);
                    } else if (parseInt(textVal, 10) === data.max) {
                        $this.val(data.max);
                        $('#add').attr('disabled', false);
                        $('#min').removeAttr('disabled');
                        $(document).trigger('uispinner::btnClick', data.max);
                    } else {
                        $this.val(1);
                        $('#min').attr('disabled', false);
                        $('#add').removeAttr('disabled');
                        $(document).trigger('uispinner::btnClick', 1);
                    }
                }
                // }
            });

            $('#text_box').on('blur', function(e) {
                var $this = $(this);
                var textVal = $this.val();
                if (textVal === '') {
                    $this.val(1);
                    $('#min').attr('disabled', false);
                    $('#add').removeAttr('disabled');
                    $(document).trigger('uispinner::btnClick', 1);
                }
            })

        }
    });
})(Zepto);

(function($) {

    var win = $(window),
        doc = $(document),
        count = 1,
        isLock = false;

    var Loading = function(options) {
        this.settings = $.extend({}, Loading.defaults, options);
        this.init();
    }

    Loading.prototype = {

        /**
         * 初始化
         */
        init: function() {
            // this.settings.title = 'load'; 
            this.create();

            if (this.settings.lock) {
                this.lock();
            }

            if (!isNaN(this.settings.time) && this.settings.time != null) {
                this.time();
            }
        },

        /**
         * 创建
         */
        create: function() {
            var divHeader;
            // if (!isNaN(this.settings.time) && this.settings.time != null) {
            //     divHeader = '';
            // }else{
            divHeader = (this.settings.title == null) ? '' : '<div class="ui-loading-header-' + this.settings.title + '"></div>';
            // }

            // HTML模板
            var templates = '<div class="ui-loading-wrap">' +
                divHeader +
                '<div class="ui-loading-content">' + this.settings.content+'' + '</div>' +
                '<div class="ui-loading-footer"></div>' +
                '</div>';

            // 追回到body
            this.loading = $('<div>').addClass('ui-loading').css({
                zIndex: this.settings.zIndex + (count++)
            }).html(templates).prependTo('body');

            // 设置ok按钮
            if (!$.isFunction(this.settings.ok) && !$.isFunction(this.settings.cancel)) {
                $('.ui-loading-wrap').css({
                    'background': '#000',
                    'padding': '10px 20px',
                    'min-width': '100px'
                });
                $('.ui-loading').css({'opacity':'0.7'});
                $('.ui-loading-content').css({
                    'color': '#fff'
                });
                this.loading.find('.ui-loading-footer').remove();
            } else {
                $('.ui-loading-header-load').remove();
                $('.ui-loading-wrap').css({
                    'min-width': '200px'
                });
            }

            // 设置cancel按钮
            if ($.isFunction(this.settings.cancel)) {
                this.cancel();
            }

            // 设置ok按钮
            if ($.isFunction(this.settings.ok)) {
                this.ok();
            }

            if ($('.ui-loading-footer a').length === 1) {
                $('.ui-loading-footer a').css('width', '100%');
                $('.ui-loading-footer a').css('border', 'none');

            }

            // 设置大小
            this.size();

            // 设置位置
            this.position();

        },

        /**
         * ok
         */
        ok: function() {
            var _this = this,
                footer = this.loading.find('.ui-loading-footer');

            $('<a>', {
                href: 'javascript:;',
                text: this.settings.okText
            }).on("click", function() {
                var okCallback = _this.settings.ok();
                if (okCallback == undefined || okCallback) {
                    _this.close();
                }

            }).addClass('ui-loading-ok').prependTo(footer);

        },

        /**
         * cancel
         */
        cancel: function() {

            var _this = this,
                footer = this.loading.find('.ui-loading-footer');

            $('<a>', {
                href: 'javascript:;',
                text: this.settings.cancelText
            }).on("click", function() {
                var cancelCallback = _this.settings.cancel();
                if (cancelCallback == undefined || cancelCallback) {
                    _this.close();
                }
            }).addClass('ui-loading-cancel').appendTo(footer);

        },

        /**
         * 设置大小
         */
        size: function() {

            var content = this.loading.find('.ui-loading-content'),
                wrap = this.loading.find('.ui-loading-wrap');

            content.css({
                width: this.settings.width,
                height: this.settings.height
            });
            //wrap.width(content.width());
        },

        /**
         * 设置位置
         */
        position: function() {

            var _this = this,
                winWidth = win.width(),
                winHeight = win.height(),
                scrollTop = 0;

            this.loading.css({
                left: (winWidth - _this.loading.width()) / 2,
                top: (winHeight - _this.loading.height()) / 2 + scrollTop
            });

        },

        /**
         * 设置锁屏
         */
        lock: function() {

            if (isLock) return;

            this.lock = $('<div>').css({
                zIndex: this.settings.zIndex
            }).addClass('ui-loading-mask');
            this.lock.appendTo('body');

            isLock = true;

        },

        /**
         * 关闭锁屏
         */
        unLock: function() {
            if (this.settings.lock) {
                if (isLock) {
                    this.lock.remove();
                    isLock = false;
                }
            }
        },

        /**
         * 关闭方法
         */
        close: function() {
            this.loading.remove();
            this.unLock();
        },

        /**
         * 定时关闭
         */
        time: function() {

            var _this = this;

            this.closeTimer = setTimeout(function() {
                _this.close();
            }, this.settings.time);

        }

    }

    /**
     * 默认配置
     */
    Loading.defaults = {

        // 内容
        content: '加载中...',

        // 标题
        title: 'load',

        // 宽度
        width: 'auto',

        // 高度
        height: 'auto',

        // 确定按钮回调函数
        ok: null,

        // 取消按钮回调函数
        cancel: null,

        // 确定按钮文字
        okText: '确定',

        // 取消按钮文字
        cancelText: '取消',

        // 自动关闭时间(毫秒)
        time: null,

        // 是否锁屏
        lock: true,

        // z-index值
        zIndex: 9999

    }

    var uiLoading = function(options) {
        return new Loading(options);
    }

    window.uiLoading = $.uiLoading = $.loading = uiLoading;

})(Zepto);

/**
 * @file 实现了通用fix方法。
 * @name Fix
 * @import core/zepto.extend.js
 */

/**
 * @name fix
 * @grammar fix(options)   ⇒ self
 * @desc 固顶fix方法，对不支持position:fixed的设备上将元素position设为absolute，
 * 在每次scrollstop时根据opts参数设置当前显示的位置，类似fix效果。
 *
 * Options:
 * - ''top'' {Number}: 距离顶部的px值
 * - ''left'' {Number}: 距离左侧的px值
 * - ''bottom'' {Number}: 距离底部的px值
 * - ''right'' {Number}: 距离右侧的px值
 * @example
 * var div = $('div');
 * div.fix({top:0, left:0}); //将div固顶在左上角
 * div.fix({top:0, right:0}); //将div固顶在右上角
 * div.fix({bottom:0, left:0}); //将div固顶在左下角
 * div.fix({bottom:0, right:0}); //将div固顶在右下角
 *
 */

(function ($, undefined) {
    $.extend($.fn, {
        fix: function(opts) {
            var me = this;                      //如果一个集合中的第一元素已fix，则认为这个集合的所有元素已fix，
            if(me.attr('isFixed')) return me;   //这样在操作时就可以针对集合进行操作，不必单独绑事件去操作
            me.css(opts).css('position', 'fixed').attr('isFixed', true);
            setTimeout(function() {
                var buff = $('<div style="position:fixed;top:10px;"></div>').appendTo('body'),
                    top = buff.offset(true).top,
                    checkFixed = function() {
                        if(window.pageYOffset > 0) {
                            if(buff.offset(true).top !== top) {
                                me.css('position', 'absolute');
                                doFixed();
                                $(document).on('scrollStop', doFixed);
                                $(window).on('ortchange', doFixed);
                            }
                            $(document).off('scrollStop', checkFixed);
                            buff.remove();
                        }
                    },
                    doFixed = function() {
                        me.css({
                            top: window.pageYOffset + (opts.bottom !== undefined ? window.innerHeight - me.height() - opts.bottom : (opts.top ||0)),
                            left: opts.right !== undefined ? document.body.offsetWidth - me.width() - opts.right : (opts.left || 0)
                        });
                        opts.width == '100%' && me.css('width', document.body.offsetWidth);
                    };
                $(document).on('scrollStop', checkFixed);
            }, 300);
            return me;
        }
    });
}(Zepto));
/**
 *  @file 实现了通用highlight方法。
 *  @name Highlight
 *  @desc 点击高亮效果
 *  @import core/zepto.js, core/zepto.extend.js
 */
(function($) {
    var actElem, inited = false, timer, cls, removeCls = function(){
        clearTimeout(timer);
        if(actElem && (cls = actElem.attr('highlight-cls'))){
            actElem.removeClass(cls).attr('highlight-cls', '');
            actElem = null;
        }
    };
    $.extend($.fn, {
        /**
         * @name highlight
         * @desc 禁用掉系统的高亮，当手指移动到元素上时添加指定class，手指移开时，移除该class
         * @grammar  highlight(className)   ⇒ self
         * @example var div = $('div');
         * div.highlight('div-hover');
         *
         * $('a').highlight();// 把所有a的自带的高亮效果去掉。
         */
        highlight: function(className) {
            inited = inited || !!$(document).on('touchend.highlight touchmove.highlight touchcancel.highlight', removeCls);
            removeCls();
            return this.each(function() {
                var $el = $(this);
                $el.css('-webkit-tap-highlight-color', 'rgba(255,255,255,0)').off('touchstart.highlight');
                className && $el.on('touchstart.highlight', function() {
                    timer = $.later(function() {
                        actElem = $el.attr('highlight-cls', className).addClass(className);
                    }, 100);
                });
            });
        }
    });
})(Zepto);

/**
 *  @file 基于Zepto的图片延迟加载插件
 *  @name imglazyload
 *  @desc 图片延迟加载
 *  @import core/zepto.extend.js
 */
(function ($) {
    /**
     * @name imglazyload
     * @grammar  imglazyload(opts)   ⇒ self
     * @desc 图片延迟加载
     * **Options**
     * - ''placeHolder''     {String}:              (可选, 默认值:\'\')图片显示前的占位符
     * - ''container''       {Array|Selector}:      (可选, 默认值:window)图片延迟加载容器
     * - ''threshold''       {Array|Selector}:      (可选, 默认值:0)阀值，为正值则提前加载
     * - ''dataName''        {String}:              (可选, 默认值:data-url)图片url名称
     * - ''eventName''       {String}:              (可选, 默认值:scrollStop)绑定事件方式
     * - ''refresh''         {Boolean}              (可选, 默认值:false)是否是更新操作，若是页面追加图片，可以将该参数设为false
     * - ''startload''       {Function}             (可选, 默认值:null)开始加载前的事件，该事件作为参数，不是trigger的
     *
     *
     * **events**
     * - ''startload'' 开始加载图片
     * - ''loadcomplete'' 加载完成
     * - ''error'' 加载失败
     *
     * @example $('.lazy-load').imglazyload();
     * $('.lazy-load').imglazyload().on('error', function (e) {
     *     e.preventDefault();      //该图片不再加载
     * });
     */
    var pedding;
    $.fn.imglazyload = function (opts) {
        var splice = Array.prototype.splice,
            opts = $.extend({
                threshold:0,
                container:window,
                urlName:'data-url',
                placeHolder:'',
                eventName:'scrollStop',
                startload: null,
                refresh: false
            }, opts),
            $container = $(opts.container),
            cTop = $container.scrollTop(),
            cHeight = $container.height(),
            detect = {
                init:function (top, height) {    //初始条件
                    return cTop >= top - opts.threshold - cHeight && cTop <= top + height;
                },
                'default':function (top, height) {      //每次滚动时发生变化，滚动条件
                    var cTop = $container.scrollTop(),
                        cHeight = $container.height();
                    return cTop >= top - opts.threshold - cHeight && cTop <= top + height;
                }
            };

        pedding = $.slice(this).reverse();
        if (opts.refresh) return this;      //更新pedding值

        function _load(div) {
            var $div = $(div), $img;
            $.isFunction(opts.startload) && opts.startload.call($div);
            $img = $('<img />').on('load',function () {
                $div.trigger('loadcomplete').replaceWith($img);
                $img.off('load');
            }).on('error',function () {     //图片加载失败处理
                var errorEvent = $.Event('error');       //派生错误处理的事件
                $div.trigger(errorEvent);
                errorEvent.defaultPrevented || pedding.push(div);
                $img.off('error').remove();
            }).attr('src', $div.attr(opts.urlName));
        }

        function _detect(type) {
            var i, $image, offset, div;
            for (i = pedding.length; i--;) {
                $image = $(div = pedding[i]);
                offset = $image.offset();
                detect[type || 'default'](offset.top, offset.height) && (splice.call(pedding, i, 1), _load(div));;
            }
        }

        $(document).ready(function () {
            opts.placeHolder && $(pedding).append(opts.placeHolder);     //初化时将placeHolder存入
            _detect('init');
        });

        (opts.container === window ? $(document) : $container).on(opts.eventName + ' ortchange', function () {
            _detect();
        });

        return this;
    };
})(Zepto);

/**
 * 滑动删除组件<br/>
 *
 * @class loft.mobile.widget.deleteitem
 * @extends loft.mobile.widget
 * <pre>
 * $("#id").payinput({
 *  onDelClick:function(e){
 * })
 * </pre>
 */
(function($, undefined) {

    var tpl = '<div id="uipayinput" class="ui-input-pay"><input type="password" maxlength=6></div>'


    $.ui.define('payinput', {
        _data: {

        },


        _setup: function() {
            $(tpl).appendTo(this.root());
            this._eventHandler();
        },

        _init: function() {


        },

        _eventHandler: function() {
            $("#uipayinput input").bind("input", function() {
                var inputval = $("#uipayinput input");
                setTimeout(function() {
                    $("#uipayinput").removeClass();
                    $("#uipayinput").addClass('ui-input-pay ui-input-pay-' + inputval.val().length);
                    if (inputval.val().length >= 6) {
                        $("#uipayinput input").blur();
                        $(document).trigger('uipayinput::onblur', inputval.val());
                    }
                }, 0);
            });
        },

        clear: function() {
            $("#uipayinput input").val('');
            $("#uipayinput").removeClass();
            $("#uipayinput").addClass('ui-input-pay ui-input-pay-0');
        }


    });
})(Zepto);

/**
 * PgwModal - Version 2.0
 *
 * Copyright 2014, Jonathan M. Piat
 * http://pgwjs.com - http://pagawa.com
 * 
 * Released under the GNU GPLv3 license - http://opensource.org/licenses/gpl-3.0
 */
;(function($){
    $.pgwModal = function(obj) {

        var pgwModal = {};
        var defaults = {
            mainClassName : 'pgwModal',
            backdropClassName : 'pgwModalBackdrop',
            maxWidth : 500,
            titleBar : true,
            closable : true,
            closeOnEscape : true,
            closeOnBackgroundClick : true,
            closeContent : '<span class="pm-icon"></span>',
            loadingContent : 'Loading in progress...',
            errorContent : 'An error has occured. Please try again in a few moments.'
        };

        if (typeof window.pgwModalObject != 'undefined') {
            pgwModal = window.pgwModalObject;
        }

        // Merge the defaults and the user's config
        if ((typeof obj == 'object') && (! obj.pushContent)) {
            if (! obj.url && ! obj.target && ! obj.content) {
                throw new Error('PgwModal - There is no content to display, please provide a config parameter : "url", "target" or "content"');
            }

            pgwModal.config = {};
            pgwModal.config = $.extend({}, defaults, obj);
            window.pgwModalObject = pgwModal;
        }

        // Create modal container
        var create = function() {
            // The backdrop must be outside the main container, otherwise Chrome displays the scrollbar of the modal below
            var appendBody = '<div id="pgwModalBackdrop"></div>'
                + '<div id="pgwModal">'
                + '<div class="pm-container">'
                + '<div class="pm-body">'
                + '<span class="pm-close"></span>'
                + '<div class="pm-title"></div>'
                + '<div class="pm-content"></div>'
                + '</div>'
                + '</div>'
                + '</div>';

            $('body').append(appendBody);
            $(document).trigger('PgwModal::Create');
            return true;
        };

        // Reset modal container
        var reset = function() {
            $('#pgwModal .pm-title, #pgwModal .pm-content').html('');
            $('#pgwModal .pm-close').html('').unbind('click');
            return true;
        };

        // Angular compilation
        var angularCompilation = function() {
            angular.element('body').injector().invoke(function($compile) {
                var scope = angular.element($('#pgwModal .pm-content')).scope();
                $compile($('#pgwModal .pm-content'))(scope);
                scope.$digest();
            });
            return true;
        };

        // Push content into the modal
        var pushContent = function(content) {
            $('#pgwModal .pm-content').html(content);

            // Angular
            if (pgwModal.config.angular) {
                angularCompilation();
            }

            reposition();

            document.body.scrollTop = 0;
            $(document).trigger('PgwModal::PushContent');
            return true;
        };

        // Repositions the modal
        var reposition = function() {
            // Elements must be visible before height calculation
            $('#pgwModal, #pgwModalBackdrop').show();

            var windowHeight = $(window).height();
            var modalHeight = $('#pgwModal .pm-body').height();
            var marginTop = Math.round((windowHeight - modalHeight) / 3);
            if (marginTop <= 0) {
                marginTop = 0;
            }

            // $('#pgwModal .pm-body').css('margin-top', marginTop);
            return true;
        };

        // Returns the modal data
        var getData = function() {
            return pgwModal.config.modalData;
        };

        // Returns the scrollbar width
        var getScrollbarWidth = function() {
            var container = $('<div style="width:50px;height:50px;overflow:auto"><div></div></div>').appendTo('body');
            var child = container.children();

            // Check for Zepto
            if (typeof child.innerWidth != 'function') {
                return 0;
            }

            var width = child.innerWidth() - child.height(90).innerWidth();
            container.remove();

            return width;
        };

        // Returns the modal status
        var isOpen = function() {
            return $('body').hasClass('pgwModalOpen');
        };

        // Close the modal
        var close = function() {
            $('#pgwModal, #pgwModalBackdrop').removeClass().hide();
            $('body').css('padding-right', '').removeClass('pgwModalOpen');

            // Reset modal
            reset();

            // Disable events
            $(window).unbind('resize.PgwModal');
            $(document).unbind('keyup.PgwModal');
            $('#pgwModal').unbind('click.PgwModalBackdrop');

            try {
                delete window.pgwModalObject; 
            } catch(e) {
                window['pgwModalObject'] = undefined; 
            }

            // var container = $('<div style="width:50px;height:50px;overflow:auto"><div></div></div>');
            // container.remove();

            $(document).trigger('PgwModal::Close');
            return true;
        };

        // Open the modal
        var open = function() {
            if ($('#pgwModal').length == 0) {
                create();
            } else {
                reset();
            }

            // Set CSS classes
            $('#pgwModal').removeClass().addClass(pgwModal.config.mainClassName);
            $('#pgwModalBackdrop').removeClass().addClass(pgwModal.config.backdropClassName);

            // Close button
            if (! pgwModal.config.closable) {
                $('#pgwModal .pm-close').html('').unbind('click').hide();
            } else {
                $('#pgwModal .pm-close').html(pgwModal.config.closeContent).click(function() {
                    close();
                }).show();
            }

            // Title bar
            if (! pgwModal.config.titleBar) {
                $('#pgwModal .pm-title').hide();
            } else {
                $('#pgwModal .pm-title').show();
            }

            if (pgwModal.config.title) {
                $('#pgwModal .pm-title').text(pgwModal.config.title);
            }

            if (pgwModal.config.maxWidth) {
                $('#pgwModal .pm-body').css('max-width', pgwModal.config.maxWidth);
            }

            // Content loaded by Ajax
            if (pgwModal.config.url) {
                if (pgwModal.config.loadingContent) {
                    $('#pgwModal .pm-content').html(pgwModal.config.loadingContent);
                }

                var ajaxOptions = {
                    'url' : obj.url,
                    'success' : function(data) {
                        pushContent(data);
                    },
                    'error' : function() {
                        $('#pgwModal .pm-content').html(pgwModal.config.errorContent);
                    }
                };

                if (pgwModal.config.ajaxOptions) {
                    ajaxOptions = $.extend({}, ajaxOptions, pgwModal.config.ajaxOptions);
                }

                $.ajax(ajaxOptions);
                
            // Content loaded by a html element
            } else if (pgwModal.config.target) {
                pushContent($(pgwModal.config.target).html());

            // Content loaded by a html object
            } else if (pgwModal.config.content) {
                pushContent(pgwModal.config.content);
            }

            // Close on escape
            if (pgwModal.config.closeOnEscape && pgwModal.config.closable) {
                $(document).bind('keyup.PgwModal', function(e) {
                    if (e.keyCode == 27) {
                        close();
                    }
                });
            }

            // Close on background click
            if (pgwModal.config.closeOnBackgroundClick && pgwModal.config.closable) {
                $('#pgwModal').bind('click.PgwModalBackdrop', function(e) {
                    var targetClass = $(e.target).hasClass('pm-container');
                    var targetId = $(e.target).attr('id');
                    if (targetClass || targetId == 'pgwModal') {
                        close();
                    }
                });
            }

            // Add CSS class on the body tag
            $('body').addClass('pgwModalOpen');

            // var currentScrollbarWidth = getScrollbarWidth();
            // if (currentScrollbarWidth > 0) {
            //     $('body').css('padding-right', currentScrollbarWidth);
            // }

            // Resize event for reposition
            $(window).bind('resize.PgwModal', function() {
                reposition();
            });

            $(document).trigger('PgwModal::Open');
            return true;
        };

        // Choose the action
        if ((typeof obj == 'string') && (obj == 'close')) {
            return close();

        } else if ((typeof obj == 'string') && (obj == 'reposition')) {
            return reposition();

        } else if ((typeof obj == 'string') && (obj == 'getData')) {
            return getData();

        } else if ((typeof obj == 'string') && (obj == 'isOpen')) {
            return isOpen();

        } else if ((typeof obj == 'object') && (obj.pushContent)) {
            return pushContent(obj.pushContent);

        } else if (typeof obj == 'object') {
            return open();
        }
    }
})(window.Zepto || window.jQuery);

/* Notes:
 * - History management is currently done using window.location.hash.  This could easily be changed to use Push State instead.
 * - jQuery dependency for now. This could also be easily removed.
 */

function PageSlider(container) {

    var container = container,
        currentPage,
        stateHistory = [];

    // Use this function if you want PageSlider to automatically determine the sliding direction based on the state history
    this.slidePage = function(page) {

        var l = stateHistory.length,
            state = window.location.hash;

        if (l === 0) {
            stateHistory.push(state);
            this.slidePageFrom(page);
            return;
        }
        if (state === stateHistory[l-2]) {
            stateHistory.pop();
            this.slidePageFrom(page, 'left');
        } else {
            stateHistory.push(state);
            this.slidePageFrom(page, 'right');
        }

    };

    // Use this function directly if you want to control the sliding direction outside PageSlider
    this.slidePageFrom = function(page, from) {

        container.append(page);

        if (!currentPage || !from) {
            page.attr("class", "page center");
            currentPage = page;
            return;
        }

        // Position the page at the starting position of the animation
        page.attr("class", "page " + from);

        currentPage.one('webkitTransitionEnd', function(e) {
            $(e.target).remove();
        });

        // Force reflow. More information here: http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/
        container[0].offsetWidth;

        // Position the new page and the current page at the ending position of their animation with a transition class indicating the duration of the animation
        page.attr("class", "page transition center");
        currentPage.attr("class", "page transition " + (from === "left" ? "right" : "left"));
        currentPage = page;
    };

}
/**
 * @file 工具栏组件
 * @name Toolbar
 * @desc 工具栏组件
 * @import core/zepto.extend.js, core/zepto.ui.js, core/zepto.fix.js, core/zepto.highlight.js
 */
(function($) {
    /**
     * @name     $.ui.toolbar
     * @grammar  $(el).toolbar(options) ⇒ self
     * @grammar  $.ui.toolbar([el [,options]]) =>instance
     * @desc **el**
     * css选择器, 或者zepto对象
     * **Options**
     * - ''container'' {selector}: (可选，默认：body) 组件容器
     * - ''title'' {String}: (可选)标题文字
     * - ''backButtonText'' {String}:(可选)返回按钮文字
     * - ''backButtonHref'' {String}: (可选)返回按钮的链接
     * - ''btns'' {Array}: (可选)右侧要添加的按钮(Dom节点)
     * - ''useFix'' {Boolean}: (可选)是否使用固顶效果(toolbar 不在页面顶端)
     * **Demo**
     * <codepreview href="../gmu/_examples/widget/toolbar/toolbar.html">
     * ../gmu/_examples/widget/toolbar/toolbar.html
     * ../gmu/_examples/widget/toolbar/toolbar_demo.css
     * </codepreview>
     */
    $.ui.define("toolbar", {
        _data: {
            title: '',
            backButtonText: '返回',
            backButtonHref: '',
            btns: '',
            useFix: false,
            backButtonClick: function() {
                history.back(1)
            },
            _isShow: false
        },

        _create: function() {
            var me = this,
                o = me._data;
            (me.root() || me.root($('<div></div>'))).addClass('ui-toolbar').appendTo(me.data('container') || (me.root().parent().length ? '' : document.body))
                .html((function() {
                    var html = '<div class="ui-toolbar-wrap"><div class="ui-toolbar-left">';
                    if (o.backButtonHref) html += '<a class="ui-toolbar-backbtn" href="' + o.backButtonHref + '">' + o.backButtonText + '</a></div>';
                    else html += '<span class="ui-toolbar-backbtn">' + o.backButtonText + '</span></div>';
                    html += o.title ? '<h2 class="ui-toolbar-title">' + o.title + '</h2>' : '';
                    html += '<div class="ui-toolbar-right"></div></div>';
                    return html;
                }()));
            if (o.btns) {
                var right = me.root().find('.ui-toolbar-right');
                $(o.btns).each(function(i, item) {
                    right.append(item)
                });
            }
        },

        _setup: function(mode) {
            var me = this,
                root = me.root().addClass('ui-toolbar');
            if (!mode) {
                var childern = root.children(),
                    title = root.find('h1,h2,h3,h4'),
                    index = title.index(),
                    left = $('<div class="ui-toolbar-left"></div>'),
                    right = $('<div class="ui-toolbar-right"></div>'),
                    wrap = $('<div class="ui-toolbar-wrap"></div>');
                root.empty().append(wrap.append(left).append(right));
                if (index == -1) {
                    childern.each(function(i, item) {
                        $(item).appendTo(i == 0 ? left : right)
                    });
                } else {
                    childern.each(function(i, item) {
                        if (i < index) left.append(item);
                        else if (i == index) wrap.append($(item).addClass('ui-toolbar-title'));
                        else right.append(item);
                    });
                }
                left.children().first().addClass('ui-toolbar-backbtn');
                me.data('btns') && $(me.data('btns')).each(function(i, item) {
                    right.append(item)
                });
                me.data('container') && root.appendTo(me.data('container'));
            }
        },

        _init: function() {
            var me = this,
                root = me.root(),
                backbtn = root.find('.ui-toolbar-backbtn');
            if (me.data('useFix')) {
                var placeholder = $('<div class="ui-toolbar-placeholder"></div>').height(root.offset().height).
                insertBefore(root).append(root).append(root.clone().css({
                        'z-index': 1,
                        position: 'absolute',
                        top: 0
                    })),
                    top = root.offset(true).top,
                    check = function() {
                        document.body.scrollTop > top ? root.css({
                            position: 'fixed',
                            top: 0
                        }) : root.css('position', 'absolute');
                    },
                    offHandle;
                $(window).on('touchmove touchend touchcancel scroll scrollStop', check);
                $(document).on('touchend touchcancel', function() {
                    offHandle = arguments.callee;
                    $.later(check, 200);
                });
                me.on('destroy', function() {
                    $(window).off('touchmove touchend touchcancel scroll scrollStop', check);
                    $(document).off('touchend touchcancel', offHandle);
                    placeholder.off().remove();
                })
            }
            backbtn.highlight('ui-state-hover').is('a') || backbtn.click(me.data('backButtonClick'));
            return me;
        },

        /**
         * @desc 添加工具按钮
         * @name addButton
         * @grammar addButton() => self
         * @param {Array}  [btn1, btn2...]  参数为数组, btn必须为组件实例,通过这种方式添加进来的按钮,会在toolbar销毁时一同销毁
         *  @example
         * //setup mode
         * $('#toolbar').toolbar('addButton', btns);
         *
         * //render mode
         * var demo = $.ui.toolbar();
         * demo.addButton(btns);
         */
        addButton: function(btns) {
            var me = this,
                right = me.root().find('.ui-toolbar-right');
            $.each(btns, function(i, btn) {
                right.append(btn.root());
                me.component(btn);
            });
            return me;
        },

        /**
         * @desc 打开工具栏面板
         * @name show
         * @grammar show() => self
         *  @example
         * //setup mode
         * $('#toolbar').toolbar('show');
         *
         * //render mode
         * var demo = $.ui.toolbar();
         * demo.show();
         */
        show: function() {
            var me = this;
            me.data('_isShow', true);
            me.root().show();
            me.trigger('show');
            return me;
        },

        /**
         * @desc 隐藏工具栏面板
         * @name hide
         * @grammar hide() => self
         *  @example
         * //setup mode
         * $('#toolbar').toolbar('hide');
         *
         * //render mode
         * var demo = $.ui.toolbar();
         * demo.hide();
         */
        hide: function() {
            var me = this;
            me.data('_isShow', false);
            me.root().hide();
            me.trigger('hide');
            return me;
        },

        /**
         * @desc 切换工具栏面板的显隐
         * @name toggle
         * @grammar toggle() => self
         *  @example
         * //setup mode
         * $('#toolbar').toolbar('toggle');
         *
         * //render mode
         * var demo = $.ui.toolbar();
         * demo.toggle();
         */
        toggle: function() {
                var me = this;
                me.data('_isShow') ? me.hide() : me.show();
                return me;
            }
            /**
             * @name Trigger Events
             * @theme event
             * @desc 组件内部触发的事件
             * ^ 名称 ^ 处理函数参数 ^ 描述 ^
             * | init | event | 组件初始化的时候触发，不管是render模式还是setup模式都会触发 |
             * | show | event | 显示时触发的事件 |
             * | hide | event | 隐藏时触发的事件 |
             * | destory | event | 组件在销毁的时候触发 |
             */
    });
})(Zepto);
