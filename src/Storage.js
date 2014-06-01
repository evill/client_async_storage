/**
 * Provides point of resolvingclient storage object 
 * @module clientstorage/Storage
 * @requires clientstorage/Database
 */
define(['./Database'], function (Database) {
    "use strict";

    /**
     * @interface ILocalStorage
     *
     * @operation getItem(name : String) : Promise
     * @operation setItem(name : String, value : Any) : Promise
     * @operation clear
     */

    /**
     * @constructor Storage
     * 
     * @param {Object} module 
     * @param {String} identifier Identifier of new storage
     */
    var Storage = function Storage (clientstorage, identifier) {
        /**
         * Identifier of storage
         * @property {String} _identifier
         */
        this._identifier = identifier;
        /**
         * Key of item in client local storage with data of current storage
         * @property {String} _storageItemKey
         * @privates
         */
        this._storageItemKey = [clientstorage.STORAGE_ITEM_PREFIX, this._identifier].join(".");
        /**
         * [_module description]
         * @property {Object} Internal module resources
         */
        this._clientstorage = clientstorage;
        /**
         * @property {ILocalStorage} _storageAdapter
         * @private
         */
        this._storageAdapter = clientstorage.storageAdapter;
        /**
         * Define that storage ready for use
         * @property {Boolean} _readyFlag
         * @private
         */
        this._readyFlag = false;
        /**
         * Some meta data of storage
         * @property {Object} _metadata
         */
        this._metadata = null;
        /**
         * List of the storage databases
         * Keys are databases names. And values are databases instances or
         * Null if databases was not initilised before 
         * @property {Object} _databases
         */
        this._databases = {};

        this._readyPromise = new Promise(this._init.bind(this));
    };

    Storage.prototype = {
        constructor: Storage,
        _init: function (resolveReady, rejectReady)
        {
            this._storageAdapter.getItem(this._storageItemKey).then(
                this._getStorageDataSuccess.bind(this, resolveReady, rejectReady),
                rejectReady
            );
        },
        _getStoragesDataSuccess: function (resolveReady, rejectReady, data)
        {
            if (data && (typeof(data) === 'object')) {
                this._metadata = data;
            } else {
                this._metadata = this._createDataObject();

                try {
                    this._storageAdapter.setItem(
                        this._storageItemKey,
                        this._module.dataEncoder.encode(this._metadata)
                    );
                } catch (error) {
                    rejectReady(error)
                }
            }

            this._readyFlag = true;
            resolveReady(this);
        },
        _createDataObject: function ()
        {
            return {
                meta: {},
                databases[]
            };
        },
        ready: function ()
        {
            return this._readyPromise;
        },
        isReady: function ()
        {
            return this._readyFlag;
        },
        identifier: function ()
        {
            return this._identifier;
        },
        getDatabase: function(name) {
            if (!this._databases.hasOwnProperty(name)) {
                this._databases[name] = new Database(this, name);
            }

            return this._databases[name];
        },
        adapter: function ()
        {
            return this._storageAdapter;
        }
    };

    return Storage;
});