var expect = require('chai').expect;
var sinon = require('sinon');

// BDD style:
describe("className", function () {
    before('before all test & called only once', function () {
        // console.log('before');
    });

    after('after all test & called only once', function () {
        // console.log('after');
    });

    beforeEach('called before each test', function () {
        // console.log('beforeEach');
    });

    afterEach('called after each test', function () {
        // console.log('afterEach');
    });

    describe("#method()", function () {
        it("return something when input something", function () {
            // given

            // when

            // then
            expect(-1).to.equal([1,2].indexOf(3));
        });
    });
});
