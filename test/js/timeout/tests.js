var timeoutService;
var QUnit;

QUnit.test(
    'trivial timout registration works',
    function(assert) {

        var token = false;

        timeoutService.register(
            10,
            function() {

                token = true;
            }
        );

        setTimeout(
            function() {

                if (token !== true) {
                    throw new Error('expected token value of true');
                }
            },
            20
        );

        // because each test requires at least one assertion
        assert.ok(true);
    }
);

QUnit.test(
    'trivial timout deregistration works',
    function(assert) {

        var token = false,
            id = timeoutService.register(
                10,
                function() {

                    token = true;
                }
            ),
            actualResult = timeoutService.deregister(id);

        assert.ok(actualResult !== null && actualResult !== undefined && typeof actualResult === 'function');

        setTimeout(
            function() {

                if (token !== false) {
                    throw new Error('expected token value of false');
                }
            },
            20
        );
    }
);
