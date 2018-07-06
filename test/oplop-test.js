const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const oplop = require('../index.js');

function testData() {
  return JSON.parse(fs.readFileSync(path.normalize(`${__dirname}/fixtures/testdata.json`, 'utf8')));
}

/* eslint-disable func-names */
describe('oplopNode', function () {
  context('8-character tests from testdata.json', function () {
    testData().forEach((dataElement) => {
      it(`creates password using *<label> for ${dataElement.why}`, function () {
        expect(oplop(`*${dataElement.label}`, dataElement.master)).to.equal(dataElement.password);
      });

      it(`creates password using 8*<label> for ${dataElement.why}`, function () {
        expect(oplop(`8*${dataElement.label}`, dataElement.master)).to.equal(dataElement.password);
      });

      it(`creates password passing in length for ${dataElement.why}`, function () {
        expect(oplop(dataElement.label, dataElement.master, 8)).to.equal(dataElement.password);
      });
    });
  });

  context('16-character tests from testdata.json', function () {
    testData().forEach((dataElement) => {
      it(`creates default 16-char password for ${dataElement.why}`, function () {
        expect(oplop(dataElement.label, dataElement.master)).to.equal(dataElement.password16);
      });
    });
  });
});
