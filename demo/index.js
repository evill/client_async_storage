(function (global) {
    "use strict";

    var Storage = global.asyncDataStorage.Storage;

    localforage.ready().then(
        function () {
            console.log('Storage ready: success');
            global.$st = new Storage(localforage);

            global.$st.getDatabase('Environment').getCollection('logging').ready().then(
                function (collection) {
                    console.log('Collection ready: success');

                    collection.setRecord('level', 'LOG_ERROR').then(
                        function () {console.log('Set record: success');},
                        function (error) {console.log('Set record: error', error.message);}
                    );

                    collection.getRecord('level').then(
                        function (value) {console.log('Get record: success', value);},
                        function (error) {console.log('Get record: error', error.message);}
                    );
                },
                function (error) {
                    console.log('Collection ready: error', error.message);
                }
            );
        },
        function (error)
        {
            console.log('Collection ready: error', error.message);
        }
    );
})(this);