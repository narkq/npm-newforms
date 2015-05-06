'use strict';

var object = require('isomorph/object')
var React = require('react')

var ErrorObject = require('./ErrorObject')
var Form = require('./Form')
var FormRow = require('./FormRow')
var ProgressMixin = require('./ProgressMixin')

var $__0=  require('./constants'),NON_FIELD_ERRORS=$__0.NON_FIELD_ERRORS
var $__1=   require('./util'),autoIdChecker=$__1.autoIdChecker,getProps=$__1.getProps

var formProps = {
  autoId: autoIdChecker
, controlled: React.PropTypes.bool
, data: React.PropTypes.object
, emptyPermitted: React.PropTypes.bool
, errorConstructor: React.PropTypes.func
, errors: React.PropTypes.instanceOf(ErrorObject)
, files: React.PropTypes.object
, initial: React.PropTypes.object
, labelSuffix: React.PropTypes.string
, onChange: React.PropTypes.func
, prefix: React.PropTypes.string
, validation: React.PropTypes.oneOfType([
    React.PropTypes.string
  , React.PropTypes.object
  ])
}

/**
 * Renders a Form. A form instance or constructor can be given. If a constructor
 * is given, an instance will be created when the component is mounted, and any
 * additional props will be passed to the constructor as options.
 */
var RenderForm = React.createClass({displayName: "RenderForm",
  mixins: [ProgressMixin],
  propTypes: object.extend({}, formProps, {
    className: React.PropTypes.string      // Class for the component wrapping all rows
  , component: React.PropTypes.any         // Component to wrap all rows
  , form: React.PropTypes.oneOfType([      // Form instance or constructor
      React.PropTypes.func,
      React.PropTypes.instanceOf(Form)
    ]).isRequired
  , row: React.PropTypes.any               // Component to render form rows
  , rowComponent: React.PropTypes.any      // Component to wrap each row
  }),

  contextTypes: {
    validateWith: React.PropTypes.func
  },

  childContextTypes: {
    form: React.PropTypes.instanceOf(Form)
  },

  getChildContext:function() {
    return {form: this.form}
  },

  getDefaultProps:function() {
    return {
      component: 'div'
    , row: FormRow
    , rowComponent: 'div'
    }
  },

  componentWillMount:function() {
    if (this.props.form instanceof Form) {
      this.form = this.props.form
    }
    else {
      this.form = new this.props.form(object.extend({
        onChange: this.forceUpdate.bind(this)
      }, getProps(this.props, Object.keys(formProps))))
    }
    if (this.context.validateWith) {
      this.form.validateWith = this.context.validateWith;
    }
  },

  getForm:function() {
    return this.form
  },

  render:function() {
    // Allow a single child to be passed for custom rendering - passing any more
    // will throw an error.
    if (React.Children.count(this.props.children) !== 0) {
      // TODO Cloning should no longer be necessary when facebook/react#2112 lands
      return React.cloneElement(React.Children.only(this.props.children), {form: this.form})
    }

    // Default rendering
    var $__0=   this,form=$__0.form,props=$__0.props
    var attrs = {}
    if (this.props.className) {
      attrs.className = props.className
    }
    var topErrors = form.nonFieldErrors()
    var hiddenFields = form.hiddenFields().map(function(bf)  {
      var errors = bf.errors()
      if (errors.isPopulated) {
        topErrors.extend(errors.messages().map(function(error)  {
          return '(Hidden field ' + bf.name + ') ' + error
        }))
      }
      return bf.render()
    })

    return React.createElement(props.component, React.__spread({},  attrs), 
      topErrors.isPopulated() && React.createElement(props.row, {
        className: form.errorCssClass, 
        component: props.rowComponent, 
        content: topErrors.render(), 
        key: form.addPrefix(NON_FIELD_ERRORS)}
      ), 
      form.visibleFields().map(function(bf)  {return React.createElement(props.row, {
        bf: bf, 
        className: bf.cssClasses(), 
        component: props.rowComponent, 
        key: bf.htmlName, 
        progress: props.progress}
      );}), 
      form.nonFieldPending() && React.createElement(props.row, {
        className: form.pendingRowCssClass, 
        component: props.rowComponent, 
        content: this.renderProgress(), 
        key: form.addPrefix('__pending__')}
      ), 
      hiddenFields.length > 0 && React.createElement(props.row, {
        className: form.hiddenFieldRowCssClass, 
        component: props.rowComponent, 
        content: hiddenFields, 
        hidden: true, 
        key: form.addPrefix('__hidden__')}
      )
    )
  }
})

module.exports =  RenderForm