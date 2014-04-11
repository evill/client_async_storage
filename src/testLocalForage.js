(function (global) {
    "use strict";

    global.AsyncDataStorage = {};
})(this);


(function (global) {
    "use strict";

    var items = {};

    var Collection = function Collection (database, name) {
        this._database = database;

        this._name = name;

        this._records = null;

        this._readyState = false;

        this._readyPromise = new Promise(this._init.bind(this));

        this._readyPromise.then(function setReady () {
            this._readyState = true;
        }.bind(this));
    };

    Collection.prototype = {
        constructor: Collection,
        _init: function (resolve, reject)
        {
            this._database.storage().ready().then(
                this._handleStorageReadySuccess.bind(this, resolve, reject),
                this._handleStorageReadyError.bind(this, reject)
            );
        },
        _handleStorageReadySuccess: function (resolve, reject)
        {
            var itemName = this._getStorageItemName();
            this._database.storage().adapter().getItem(itemName).then(
                this._handleGetItemSuccess.bind(this, resolve, reject),
                this._handleGetItemError.bind(this, reject)
            );
        },
        _handleStorageReadyError: function (reject, error)
        {
            reject(error); //replace but collection error
        },
        _handleGetItemSuccess: function (resolve, reject, item)
        {
            if ((item === null) || (item === undefined))
            {
                this._records = {};

                this._saveRecordsToStorage(resolve, reject);
            }
            else
            {
                try {
                    this._records = this._decodeRecords(item);
                    resolve(this);
                } catch (error) {
                    reject(error); //replace but collection error
                }
            }
        },
        _handleGetItemError: function (reject, error)
        {
            reject(error); //replace but collection error
        },
        _handleCreateItemSuccess: function (resolve)
        {
            resolve(this);
        },
        _handleCreateItemError: function (reject, error)
        {
            reject(error); //replace but collection error
        },
        _encodeRecords: function (recordsObject)
        {
            return JSON.stringify(recordsObject);
        },
        _decodeRecords: function (recordsString)
        {
            return JSON.parse(recordsString);
        },
        _getStorageItemName: function ()
        {
            return [this._database.name(), this.name()].join('.');
        },
        ready: function ()
        {
            return this._readyPromise;
        },
        isReady: function () {
            return this._readyState;
        },
        getRecord: function (key) {
            return new Promise(this._getRecord.bind(this, key));
        },
        _getRecord: function (key, resolve, reject) {
            if (this.isReady())
            {
                if (this._records.hasOwnProperty(key)) {
                    resolve(this._records[key]);
                } else {
                    reject(new Error("Record not found!"));
                }
            }
            else
            {
                reject(new Error("Collection not ready!"));
            }
        },
        setRecord: function (key, value) {
            return new Promise(this._setRecord.bind(this, key, value));
        },
        _setRecord: function (key, value, resolve, reject) {
            if (this.isReady())
            {
                this._records[key] = value;

                this._saveRecordsToStorage(resolve, reject);

                resolve();
            }
            else
            {
                reject(new Error("Collection not ready!"));
            }
        },
        clear: function ()
        {
            return new Promise(this._clearStorageItem.bind(this));
        },
        _clearStorageItem: function (resolve, reject)
        {
            this._records = {};

            this._database.storage().adapter().removeItem(
                this._getStorageItemName()
            ).then(
                this._handleClearSuccess.bind(this, resolve),
                this._handleClearError.bind(this, reject)
            );
        },
        _handleClearSuccess: function (resolve)
        {
            resolve();
        },
        _handleClearError: function (reject, error)
        {
            reject(error); //replace but collection error
        },
        _saveRecordsToStorage: function (resolve, reject)
        {
            this._database.storage().adapter().setItem(
                this._getStorageItemName(),
                this._encodeRecords(this._records)
            ).then(
                this._handleCreateItemSuccess.bind(this, resolve),
                this._handleCreateItemError.bind(this, reject)
            );
        },
        name: function ()
        {
            return this._name;
        }
    };

    global.AsyncDataStorage.Collection = Collection;
})(this);

(function (global) {
    "use strict";

    var Collection = global.AsyncDataStorage.Collection;

    var Database = function Database (dataStorage, name) {
        this._dataStorage = dataStorage;

        this._name = name;

        this._collections = {};
    };

    Database.prototype = {
        constructor: Database,
        getCollection: function(name) {

            if (!this._collections.hasOwnProperty(name)) {
                this._collections[name] = new Collection(this, name);
            }

            return this._collections[name];
        },
        name: function ()
        {
            return this._name;
        },
        storage: function ()
        {
            return this._dataStorage;
        },
        clear: function ()
        {
            
        }
    };

    global.AsyncDataStorage.Database = Database;
})(this);

(function (global) {
    "use strict";

    var Database = global.AsyncDataStorage.Database;

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

    global.AsyncDataStorage.Storage = Storage;
})(this);


(function (global) {
    "use strict";

    var Storage = global.AsyncDataStorage.Storage;

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