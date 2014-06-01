require.config({
    //baseUrl: '../src/',
    paths: {
        'clientstorage': '../src',
        'mocha'        : '../bower_components/mocha/mocha',
        'chai'         : '../bower_components/chai/chai',
        'sinon'        : '../bower_components/sinon/lib/sinon',
        'sinon-chai'   : '../bower_components/sinon-chai/lib/sinon-chai'
    },
    bundles: {
        '../bower_components/localforage/dist/localforage': ['localforage']
    },
    shim: {
        mocha: {
            exports: 'mocha'
        }
    }
});

requirejs(
    [
        "require",
        "mocha", "chai", "sinon", "sinon-chai"
    ],
    function prepareTests (require, mocha, chai, sinon, sinon_chai) {
        mocha.setup('bdd');
        require(
            [
                "test.Collection.js"
            ],
            function runTests (testCollection) {
                mocha.run();
            }
        );
    }
);