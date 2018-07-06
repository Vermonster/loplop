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
 * @returns {array} [label, length] after parsing label and considering defaults
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
 * Create a password given a label/mnemonic and master password and optional
 * length.
 *
 * @see {@link https://github.com/brettcannon/oplop}
 * @see {@link https://github.com/thedod/loplop}
 * @see {@link https://github.com/bkaney/oplop}
 *
 * NOTE on the label, this supports the "loplop" variation where the label can
 * use an optional DSL uses the long oplop variation, where:
 *
 * If the label begins with a `<digit>*`, the <digit> should be the length of
 * the password.
 *
 * If the label begins with a `*`, the length of the password is
 * assumed the classic length of 8.
 *
 * Otherwise the password will be 16 characters long.
 *
 *
 * @param {string} labelParam: the label
 * @param {string} masterParam: the master password
 * @param {string} lengthParam: the length
 *
 * @returns {string} the computed password
 */
module.exports = function oplopNode(labelParam, masterParam, lengthParam) {
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
