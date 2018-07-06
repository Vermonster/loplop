const base64url = require('base64-url');
const crypto = require('crypto');

const lengthLegacy = 8;
const lengthDefault = 16;

/**
 * Function to parse label DSL for length.
 *
 * @private
 *
 * @param {string} labelParam: the label
 * @param {string} lengthParam: the length, defaults to 16
 *
 * @returns {array} array of label and length
 */
function getLabelAndLength(labelParam, lengthParam = lengthDefault) {
  let label = labelParam;
  let length = lengthParam;

  if (label.match(/^([0-9]*)?\*/)) {
    let rest;
    [length, ...rest] = label.split('*');
    label = rest.join('*');
    length = parseInt(length, 10) || lengthLegacy;
  }
  return [label, length];
}

/**
 * @function oplop
 *
 * @see {@link https://github.com/brettcannon/oplop}
 * @see {@link https://github.com/thedod/loplop}
 * @see {@link https://github.com/bkaney/oplop}
 * @description
 *
 * Create a password given a label/mnemonic and master password and optional
 * length.
 *
 * NOTE this library supports the "loplop" variation where the label can use an
 * optional DSL uses the long oplop variation, where:
 * * if the label begins with a `<digit>*`, the <digit> should be the length of
 * the password,
 * * if the label begins with a `*`, the length of the password is
 * assumed the classic length of 8,
 * * otherwise the password will be 16 characters long.
 *
 * @example
 *
 * // 16-character password using `label` and `master`
 * let password = require('loplop') ('label', 'master');
 *
 * // 8-character password using `label` and `master`
 * let password = require('loplop') ('*label', 'master');
 * let password = require('loplop') ('label', 'master', 8);
 *
 * // 10-character password using `label` and `master`
 * let password = require('loplop') ('10*label', 'master')
 * let password = require('loplop') ('label', 'master', 10)
 *
 * @param {string} labelParam - label/mnemonic
 * @param {string} masterParam - master password
 * @param {string} [lengthParam] - optional length of generated password
 *
 * @returns {string} the generated password
 */
module.exports = function (labelParam, masterParam, lengthParam) {
  const [label, length] = getLabelAndLength(labelParam, lengthParam);

  let password = crypto
    .createHash('md5')
    .update(`${masterParam}${label}`, 'utf8')
    .digest('base64');

  password = base64url.escape(password);

  const digitRegex = /\d+/;
  const digitPos = password.search(digitRegex);

  if (digitPos < 0) {
    password = `1${password}`;
  } else if (digitPos >= length) {
    const digit = password.match(digitRegex);
    password = `${digit}${password}`;
  }

  return password.substring(0, length);
};
