var notificationService;
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

    notificationService.register(function(event) {
        assert.deepEqual(event, input);
    });

    notificationService.notify(input);
});

QUnit.test('deregistration works I', function(assert) {

    var input = 'a string which represents an event',
        identifier = notificationService.register(
            function(event) {
                // control should not reach this point
                assert.notOk(true);
            }
        );

    assert.deepEqual(notificationService.deregister(identifier), 1);

    notificationService.notify(input);
});

QUnit.test('deregistration works II', function(assert) {

    var input = 'a string which represents an invalid identifier';

    assert.deepEqual(notificationService.deregister(input), 0);
});

QUnit.test('more complex interaction I', function(assert) {

    var input = 'a string which represents an event',
        count = 0,
        identifier1 = notificationService.register(
            function(event) {
                count = count + 1;
            }
        ),
        identifier2 = notificationService.register(
            function(event) {
                count = count + 1;
            }
        ),
        identifier3 = notificationService.register(
            function(event) {
                // control should NOT reach this point
                assert.notOk(true);
            }
        );

    assert.deepEqual(notificationService.deregister(identifier3), 1);

    notificationService.notify(input);

    assert.deepEqual(count, 2);
});

QUnit.test('more complex interaction II', function(assert) {

    var input = 'a string which represents an event',
        count = 0,
        identifier1 = notificationService.register(
            function(event) {
                // control should NOT reach this point
                assert.notOk(true);
            }
        ),
        identifier2 = notificationService.register(
            function(event) {
                count = count + 1;
            }
        ),
        identifier3 = notificationService.register(
            function(event) {
                count = count + 1;
            }
        );

    assert.deepEqual(notificationService.deregister(identifier1), 1);

    notificationService.notify(input);

    assert.deepEqual(count, 2);
});
