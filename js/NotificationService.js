/**
 * @author jonnie savell
 *
 * avoiding this through module protected members
 *
 * @type {{register, deregister, notify}}
 */
var notificationService = (function() {

    // private
    var listeners = [];

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

    return {
        /**
         * this method allows clients to register a callback function with
         * the service. an identifier for this callback is generated and
         * returned to the client so that it may later deregister this
         * callback.
         *
         * should the client register the same function twice, this service
         * will not recognize the duplication and will, therefore, fail to
         * return an identifier equivalent to that returned when the
         * callback was first registered.
         *
         * @param callback
         * @returns {string|*}
         */
        register: function(callback) {

            var listener = function(event) {
                callback(event);
            };

            listener.identifier = generateUUID();

            listeners.push(listener);

            return listener.identifier;
        },

        /**
         * this method allows clients to deregister a previously registered
         * callback. the client supplies the identifier that was returned
         * at the time the callback was registered.
         *
         * @param identifier
         * @returns {number}
         */
        deregister: function(identifier) {

            var updatedListeners = [],
                numberOfRemovedListeners = 0;

            listeners.forEach(function(listener) {
                if (listener.identifier !== identifier) {
                    updatedListeners.push(listener);
                } else {
                    // identifiers match => deregister by discarding listener
                    numberOfRemovedListeners++;
                }
            });

            listeners = updatedListeners;

            return numberOfRemovedListeners;
        },

        /**
         * this is how clients send events to callbacks. for a given event,
         * each callback is invoked allowing for the same callback to
         * receive the event twice in the event that that callback was
         * registered more than once.
         *
         * @param event
         */
        notify: function(event) {

            listeners.forEach(function(listener) {

                try {
                    listener(event);
                } catch (e) {
                    // in this situation, we will swallow the exception
                    //   although this is not generally desirable.
                    console.log('listener with identifier ' +
                        listener.identifier +
                        ' threw exception ' + e.toString());
                }
            });
        }
    };
})();
