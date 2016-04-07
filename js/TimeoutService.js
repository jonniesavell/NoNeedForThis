/**
 * @author jonnie savell
 *
 * avoiding this through module protected members
 *
 * @type {{register, deregister}}
 */
timeoutService = (function() {

    // private data and methods
    var callbacks = [];

    /**
     * honest attribution:
     *   http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
     *   for the source of this implementation. thank you, Briguy37.
     * @returns {string}
     */
    function generateUUID() {

        var d = new Date().getTime();

        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); //use high-precision timer if available
        }

        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
            function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            }
        );

        return uuid;
    }

    function partitionCallbacks(callbacks, identifier) {

        var thisCallback = [],
            otherCallbacks = [];

        callbacks.forEach(function(currentValue) {

            if (currentValue.identifier === identifier) {
                thisCallback.push(currentValue);
            } else {
                otherCallbacks.push(currentValue);
            }
        });

        return {
            matchingCallbacks: thisCallback,
            otherCallbacks: otherCallbacks
        }
    }

    return {
        /**
         * This method allows clients to register timeouts
         *
         * @param numberOfMilliseconds
         * @param callback
         * @returns {string}
         */
        register: function(numberOfMilliseconds, callback) {

            var identifier = generateUUID(),
                persistedCallback = {
                    identifier: identifier,
                    callback: callback
                };

            callbacks.push(persistedCallback);

            setTimeout(
                function () {

                    var result = partitionCallbacks(callbacks, identifier);

                    // update protected state
                    callbacks = result.otherCallbacks;

                    if (result.matchingCallbacks.length > 0) {

                        try {
                            result.matchingCallbacks[0].callback();
                        } catch (e) {
                            // must swallow the exception
                        }
                    }
                },
                numberOfMilliseconds
            );

            return identifier;
        },

        /**
         * This method allows clients to deregister timeout handlers.
         *
         * It is entirely possible that the timeout handler has been called before deregister has had an
         *   opportunity to remove it from the array of callbacks.
         *
         * @param identifier
         * @returns {*}
         */
        deregister: function (identifier) {

            var result = partitionCallbacks(callbacks, identifier);

            callbacks = result.otherCallbacks;

            if (result.matchingCallbacks.length > 0) {
                return result.matchingCallbacks[0].callback;
            } else {
                return null;
            }
        }
    };
})();
