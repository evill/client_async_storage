(function (global) {
    "use strict";

    var Collection = global.asyncDataStorage.Collection;

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

    global.asyncDataStorage.Database = Database;
})(this);