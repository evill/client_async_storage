require.config({
    baseUrl: '/backbone-tests/',
    paths: {
        'mocha'         : 'libs/mocha',
        'chai'          : 'libs/chai'
    },
    bundles: {
        '../bower_components/localforage/dist/localforage': ['localforage']
    }
});