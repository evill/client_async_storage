define(['localforage', './Storage'], function (localforage, Storage) {
    return {
        createStorage: function (identifier)
        {
            return new Promise(function (resolve, reject) {
                localforage.ready().then(
                    function () {
                        var storage = new Storage(localforage, identifier);
                        resolve(storage);
                    },
                    function (error)
                    {
                        reject(error);
                    }
                );
            });
        }
    }
});