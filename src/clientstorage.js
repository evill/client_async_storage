/**
 * Provides point of resolvingclient storage object 
 * @module clientstorage
 * @requires localforage
 * @requires clientstorage/Storage
 */
define(['localforage', './Storage'], function (localforage, Storage) {
    "use strict";

    /**
     * List of private data of module
     * @type {Object}
     */
    var privateData = {
        DEFAULT_STORAGE_IDENTIFIER: "main",
        /**
         * List of initilised storages
         * @property {Object} storages
         * @private
         */
        storages = {}
    };

    /**
     * List of protected data of module
     * @type {Object}
     */
    var protectedData = {
        STORAGE_ITEM_PREFIX: "clientstorage.storage",
        storageAdapter: localforage,
        dataEncoder: {
            encode: function (decodedData)
            {
                return JSON.stringify(decodedData);
            },
            decode: function (encodedData)
            {
                return JSON.parse(encodedData);
            }
        }
    };

    return {
        /**
         * Creates new storage object with passed identifier
         * 
         * @param  {String} [identifier="main"] Identifier of storage
         * @return {Promise} To then callback will be passed created storageinstance
         */
        get: function (identifier)
        {
            if (identifier === undefined)
            {
                identifier = privateData.DEFAULT_STORAGE_IDENTIFIER;
            }

            return new Promise(function getStorage (resolve, reject) {
                localforage.ready().then(
                    function getStorageSuccess () {
                        if (privateData.storages[identifier] === undefined)
                        {
                            privateData.storages[identifier] = new Storage(
                                protectedData, identifier
                            );
                        }

                        resolve(privateData.storages[identifier]);
                    },
                    reject
                );
            });
        }
    }
});