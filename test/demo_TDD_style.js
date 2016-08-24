var assert = require('chai').assert;
var sinon = require('sinon');

// TDD style
// use mocha -u tdd <test file>
suite.skip("className", function () {
    suiteSetup('before all test & called only once', function () {
        // console.log('suiteSetup');
    });

    suiteTeardown('after all test & called only once', function () {
        // console.log('suiteTeardown');
    });

    setup('called before each test', function () {
        // console.log('setup');
    });

    teardown('called after each test', function () {
        // console.log('teardown');
    });

    suite('#methood()', function () {
        test('return something when input something', function () {
            // given

            // when

            //then
            assert.equal(-1, [1, 2].indexOf(3));
        });
    });
});