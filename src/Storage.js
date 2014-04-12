define(['./Database'], function (Database) {
    "use strict";

    var databases = {};

    var Storage = function Storage (storageAdapter) {
        this._storageAdapter = storageAdapter;

        this._readyPromise = storageAdapter.ready();

        this._readyFlag = false;

        this._readyPromise.then(function () {
            this._readyFlag = true;
        });
    };

    Storage.prototype = {
        constructor: Storage,
        ready: function ()
        {
            return this._readyPromise;
        },
        isReady: function ()
        {
            return this._readyFlag;
        },
        getDatabase: function(name) {
            if (!databases.hasOwnProperty(name)) {
                databases[name] = new Database(this, name);
            }

            return databases[name];
        },
        adapter: function ()
        {
            return this._storageAdapter;
        }
    };

    return Storage;
});