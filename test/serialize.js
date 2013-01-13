
var objectstream = require('..');

exports['write number to object stream'] = function (test) {
    test.expect(1);
    var stream = {
        write: function (data) {
            test.equal(data, "4\n");
        },
        end: function () {
            test.done();
        }
    }
    var objst = objectstream.createSerializeStream(stream);
    objst.write(4);
    objst.end();
};