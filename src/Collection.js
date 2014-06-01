/**
 * Constructor represents collection which stores and
 * resolves records data  from client storage
 * @class Collection
 * @memberOf clientstorage
 */
define(function () {
    "use strict";

    /**
     * @constructor
     *
     * @param {Database} database Database which holds collection
     * @param {String} name Name of collection
     */
    var Collection = function Collection (database, name) {
        if (!database || (typeof(database) !== 'object'))
        {
            throw new TypeError("Bad database type!");
        }

        if (typeof(name) !== 'string')
        {
            throw new TypeError("Bad collection name type!");
        }
        /**
         * Contains database of current collection
         *
         * @property {Database} Collection#_database
         * @private
         */
        this._database = database;
        /**
         * Name of storage collection
         * 
         * @property {String} _name
         * @private
         */
        this._name = name;
        /**
         * List of collection records
         * 
         * @property {Object} records
         * @private
         */
        this._records = null;
        /**
         * State of collection instance
         * 
         * @property {Boolean} _readyState
         * @private
         */
        this._readyState = false;
        /**
         * Promise for ready state
         * 
         * @property {Promise} _readyPromise
         * @private
         */
        this._readyPromise = new Promise(this._init.bind(this));

        this._readyPromise.then(function setReady () {
            this._readyState = true;
        }.bind(this));
    };

    Collection.prototype = {
        constructor: Collection,
        _init: function (resolve, reject) {
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

    return Collection;
});