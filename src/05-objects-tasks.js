/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;

  this.getArea = () => this.width * this.height;
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
const getJSON = (obj) => JSON.stringify(obj);


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  // eslint-disable-next-line no-proto
  obj.__proto__ = proto;
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  CssBuild: class {
    constructor(result, order = 0) {
      this.result = result;
      this.order = order;
      this.elCheck = false;
    }

    orderChecker(order) {
      const exception = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
      if (this.order > order) throw exception;
      this.order = order;
    }

    uniqChecker(value) {
      const exception = 'Element, id and pseudo-element should not occur more then one time inside the selector';
      if (new RegExp(value).test(this.result)) throw exception;
    }

    element(value) {
      this.orderChecker(1);
      this.uniqChecker('^[A-Za-z]');
      this.result += value;
      return this;
    }

    id(value) {
      this.orderChecker(2);
      this.uniqChecker('#');
      this.result += `#${value}`;
      return this;
    }

    class(value) {
      this.orderChecker(3);
      this.result += `.${value}`;
      return this;
    }

    attr(value) {
      this.orderChecker(4);
      this.result += `[${value}]`;
      return this;
    }

    pseudoClass(value) {
      this.orderChecker(5);
      this.result += `:${value}`;
      return this;
    }

    pseudoElement(value) {
      this.orderChecker(6);
      this.uniqChecker('::');
      this.result += `::${value}`;
      return this;
    }

    stringify() {
      return this.result;
    }
  },

  combine(selector1, combinator, selector2) {
    return new this.CssBuild('').element(`${selector1.stringify()} ${combinator} ${selector2.stringify()}`);
  },

  element(value) {
    return new this.CssBuild('', 1).element(value);
  },

  id(value) {
    return new this.CssBuild('', 2).id(value);
  },

  class(value) {
    return new this.CssBuild('', 3).class(value);
  },

  attr(value) {
    return new this.CssBuild('', 4).attr(value);
  },

  pseudoClass(value) {
    return new this.CssBuild('', 5).pseudoClass(value);
  },

  pseudoElement(value) {
    return new this.CssBuild('', 6).pseudoElement(value);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
