import _clone from './_clone.js';
import _curryN from './_curryN.js';
import _has from './_has.js';
import _xfBase from './_xfBase.js';


function XReduceBy(valueFn, valueAcc, keyFn, xf) {
  this.valueFn = valueFn;
  this.valueAcc = valueAcc;
  this.keyFn = keyFn;
  this.xf = xf;
  this.inputs = {};
}
XReduceBy.prototype['@@transducer/init'] = _xfBase.init;
XReduceBy.prototype['@@transducer/result'] = function(result) {
  var key;
  for (key in this.inputs) {
    if (_has(key, this.inputs)) {
      result = this.xf['@@transducer/step'](result, this.inputs[key]);
      if (result['@@transducer/reduced']) {
        result = result['@@transducer/value'];
        break;
      }
    }
  }
  this.inputs = null;
  return this.xf['@@transducer/result'](result);
};
XReduceBy.prototype['@@transducer/step'] = function(result, input) {
  var key = this.keyFn(input);
  this.inputs[key] = this.inputs[key] || [key, _clone(this.valueAcc, false)];
  this.inputs[key][1] = this.valueFn(this.inputs[key][1], input);
  return result;
};

var _xreduceBy = _curryN(4, [],
  function _xreduceBy(valueFn, valueAcc, keyFn, xf) {
    return new XReduceBy(valueFn, valueAcc, keyFn, xf);
  }
);
export default _xreduceBy;
