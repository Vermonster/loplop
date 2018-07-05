const base64url = require('base64-url');
const md5 = require('md5');
const utf8 = require('utf8');
const crypto = require('crypto');

module.exports = function(label, master, length=16) {
  var created_password = crypto.createHash('md5').update(master + label, 'utf8');
  created_password = base64url.encode(created_password.digest('base64'));

  return created_password;

  var digit_regex = /\d+/;
  var digit_pos = created_password.search(digit_regex);

  if (digit_pos < 0) {  // No digit found.
    created_password = '1' + created_password;
  }
  else if (digit_pos >= length) {  // Digit outside of final password.
    var digit = created_password.match(digit_regex);
    created_password = digit + created_password;
  }

  return created_password.substring(0, length);
};

