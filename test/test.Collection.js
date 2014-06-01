require(['clientstorage/Collection'], function (Collection) {
    describe('clientstorage/Collection', function () {
        describe('#constructor', function() {
            it('should create new database collection', function () {
                var collection = new Collection({}, "users");
            });

            it('should throw exception for bad database interface', function () {
                var collection = new Collection({}, "users");
            });

            it('should throw exception for absent name', function () {
                var collection = new Collection({}, "users");
            });
        })
    });
});