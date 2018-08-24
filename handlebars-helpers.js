/**
 * Helpers for Handlebars.
 * @author Lee, SeongHyun (Kevin)
 * @version 0.0.1 (2014-03-15)
 */

/**
 * e.g.)
 * {{{#cond this.isEnabled "<b>Enabled</b>" "<div class='alert-danger'>Disabled</div>"}}}
 * equivalent to
 * {{{#if this.isEnabled}}}
 * <b>Enabled</b>
 * {{{else}}}
 * <div class='alert-danger'>Disabled</div>
 * {{{/if}}}
 */
Handlebars.registerHelper('cond', function(condition, trueValue, falseValue) {
  return condition ? trueValue : falseValue;
});

/**
 * e.g.)
 * {{#andCond somethingTrue somethingElseTrue}}
 *   <div>Do something if somethingTrue && somethingElseTrue.</div>
 * {{else}}
 *   <div>Otherwise something else.</div>
 * {{/andCond}}
 */
Handlebars.registerHelper('andCond', function(condition1, condition2, options) {
  return condition1 && condition2 ? options.fn(this) : options.inverse(this);
});

/**
 * e.g.)
 * {{#orCond somethingTrue somethingElseFalse}}
 *   <div>Do something if somethingTrue || somethingElseFalse.</div>
 * {{else}}
 *   <div>Otherwise something else.</div>
 * {{/orCond}}
 */
Handlebars.registerHelper('orCond', function(condition1, condition2, options) {
  return condition1 || condition2 ? options.fn(this) : options.inverse(this);
});

/**
 * e.g.)
 * {{{#ifTrueWrapTag "b" user.isVerified user.name}}}
 * 
 * result)
 * if user.isVerified and user.name is "Kevin"
 * <b>Kevin</b>
 * if !user.isVerified and user.name is "Kevin"
 * Kevin
 */
Handlebars.registerHelper('ifTrueWrapTag', function(tag, condition, value) {
  var tagOpen = "<" + tag + ">";
  var tagClose = "</" + tag + ">";
  return condition ? tagOpen + value + tagClose : value;
});

/**
 * e.g.)
 * {{{#ifFalseWrapTag "b" user.isVerified user.name}}}
 * 
 * result)
 * if user.isVerified and user.name is "Kevin"
 * Kevin
 * if !user.isVerified and user.name is "Kevin"
 * <b>Kevin</b>
 */
Handlebars.registerHelper('ifFalseWrapTag', function(tag, condition, value) {
  var tagOpen = "<" + tag + ">";
  var tagClose = "</" + tag + ">";
  return !condition ? tagOpen + value + tagClose : value;
});

/**
 * ## HTML:
 * <select>
 *   {{#select theValue}}
 *   <option value="someValue1">Value 1</option>
 *   <option value="someValue2">Value 2</option>
 *   <option value="someValue3">Value 3</option>
 *   {{/select}}
 * </select>
 * 
 * ## Handlebars:
 * template({
 *   "theValue":"someValue2"
 * });
 * 
 * ## Result:
 * <select>
 *   <option value="someValue1">Value 1</option>
 *   <option value="someValue2" selected="selected">Value 2</option>
 *   <option value="someValue3">Value 3</option>
 * </select>
 */
Handlebars.registerHelper('select', function( value, options ){
  var $select = $('<select />').html( options.fn(this) );
  $select.find('[value=' + value + ']').attr({'selected':'selected'});
  return $select.html();
});