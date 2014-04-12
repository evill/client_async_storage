requirejs.config({
    bundles: {
        '../bower_components/localforage/dist/localforage': ['localforage']
    }
});

(function (global) {
    "use strict";

    var mainStorage;

    require(['../src/asyncDataStorage'], function (asyncDataStorage) {
        asyncDataStorage.createStorage().then(
            function onCreateSuccess (storage) {
                console.log('Storage ready: success');
                mainStorage = storage;
                mainStorage.getDatabase('Environment').getCollection('Logging').ready().then(
                    function (collection) {
                        console.log('Collection ready: success');

                        collection.setRecord('level', 'LOG_DEBUG').then(
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
            }
        ).catch(
            function onCreateError (error) {
                console.log('Storage ready: error', error.message);
            }
        );
    });

})(this);