const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const password = require('../index.js');

function testData() {
	return JSON.parse(fs.readFileSync(path.normalize(`${__dirname}/fixtures/testdata.json`, 'utf8')));
}

describe('.password', function () {
	context('tests from testdata.json', function () {
		testData().forEach((dataElement) => {
			it('works', function () {
        expect(password(dataElement.label, dataElement.master)).to.equal(dataElement.password);
  		});
		});
	});
});
