var api;
var QUnit;

/**
 * opinion: few methods present on assert
 *   => need another object on which additional methods live
 *
 * i would like the following:
 *   execution.mustNotReachThisPoint
 *   execution.mustReachThisPoint
 */
QUnit.test('trivial notification works', function(assert) {

    var input = 'a string which represents an event';

    api.register(function(event) {
        assert.deepEqual(event, input);
    });

    api.notify(input);
});

QUnit.test('deregistration works I', function(assert) {

    var input = 'a string which represents an event',
        identifier = api.register(
            function(event) {
                // control should not reach this point
                assert.notOk(true);
            }
        );

    assert.deepEqual(api.deregister(identifier), 1);

    api.notify(input);
});

QUnit.test('deregistration works II', function(assert) {

    var input = 'a string which represents an invalid identifier';

    assert.deepEqual(api.deregister(input), 0);
});

QUnit.test('more complex interaction I', function(assert) {

    var input = 'a string which represents an event',
        count = 0,
        identifier1 = api.register(
            function(event) {
                count = count + 1;
            }
        ),
        identifier2 = api.register(
            function(event) {
                count = count + 1;
            }
        ),
        identifier3 = api.register(
            function(event) {
                // control should NOT reach this point
                assert.notOk(true);
            }
        );

    assert.deepEqual(api.deregister(identifier3), 1);

    api.notify(input);

    assert.deepEqual(count, 2);
});

QUnit.test('more complex interaction II', function(assert) {

    var input = 'a string which represents an event',
        count = 0,
        identifier1 = api.register(
            function(event) {
                // control should NOT reach this point
                assert.notOk(true);
            }
        ),
        identifier2 = api.register(
            function(event) {
                count = count + 1;
            }
        ),
        identifier3 = api.register(
            function(event) {
                count = count + 1;
            }
        );

    assert.deepEqual(api.deregister(identifier1), 1);

    api.notify(input);

    assert.deepEqual(count, 2);
});
