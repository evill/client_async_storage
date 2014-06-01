define(['chai', 'clientstorage/Collection'], function (chai, Collection) {
    describe('Test Collection', function () {
        describe('Test constructor', function() {

            describe('Test constructor', function() {
                it('should create new database collection', function () {
                    chai.expect(new Collection({}, "users")).to.be.
                        an("object").and.
                        instanceof(Collection);
                });
            });

            describe('Test constructor parameter `database`', function() {
                var name;

                before(function () {
                    name = "some_collection";
                });

                after(function () {
                    name = null;
                });

                it('should throw exception for absent database', function () {
                    var createCollection = function () {
                        new Collection(undefined, name);
                    };
                    chai.expect(createCollection).to.
                        throw(TypeError, "Bad database type!");
                });
                it('should throw exception for Null as database', function () {
                    var createCollection = function () {
                        new Collection(null, name);
                    };
                    chai.expect(createCollection).to.
                        throw(TypeError, "Bad database type!");
                });
                it('should throw exception for String as database', function () {
                    var createCollection = function () {
                        new Collection("database", name);
                    };
                    chai.expect(createCollection).to.
                        throw(TypeError, "Bad database type!");
                });
                it('should throw exception for Number as database', function () {
                    var createCollection = function () {
                        new Collection(1, name);
                    };
                    chai.expect(createCollection).to.
                        throw(TypeError, "Bad database type!");
                });
                it('should throw exception for Boolean as database', function () {
                    var createCollection = function () {
                        new Collection(true, name);
                    };
                    chai.expect(createCollection).to.
                        throw(TypeError, "Bad database type!");
                });
                it('should throw exception for Function as database', function () {
                    var createCollection = function () {
                        new Collection(function () {}, name);
                    };
                    chai.expect(createCollection).to.
                        throw(TypeError, "Bad database type!");
                });
            });

            describe('Test constructor parameter `name`', function() {
                var database;

                before(function () {
                    database = {};
                });

                after(function () {
                    database = null;
                });

                it('should throw exception for absent name', function () {
                    var createCollection = function () {
                        new Collection(database, undefined);
                    };
                    chai.expect(createCollection).to.
                        throw(TypeError, "Bad collection name type!");
                });

                it('should throw exception for Null as name', function () {
                    var createCollection = function () {
                        new Collection(database, null);
                    };
                    chai.expect(createCollection).to.
                        throw(TypeError, "Bad collection name type!");
                });
                it('should throw exception for Number as name', function () {
                    var createCollection = function () {
                        new Collection(database, 1);
                    };
                    chai.expect(createCollection).to.
                        throw(TypeError, "Bad collection name type!");
                });
                it('should throw exception for Boolean as name', function () {
                    var createCollection = function () {
                        new Collection(database, true);
                    };
                    chai.expect(createCollection).to.
                        throw(TypeError, "Bad collection name type!");
                });
                it('should throw exception for Object as name', function () {
                    var createCollection = function () {
                        new Collection(database, {});
                    };
                    chai.expect(createCollection).to.
                        throw(TypeError, "Bad collection name type!");
                });
                it('should throw exception for Function as name', function () {
                    var createCollection = function () {
                        new Collection(database, function () {});
                    };
                    chai.expect(createCollection).to.
                        throw(TypeError, "Bad collection name type!");
                });
            });
        });
    });
});