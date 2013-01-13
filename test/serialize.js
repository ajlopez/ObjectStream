
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

exports['write two numbers to object stream'] = function (test) {
    test.expect(1);
    var stream = {
        buffer: '',
        write: function (data) {
            this.buffer += data;
        },
        end: function () {
            test.equal(this.buffer, "1\n2\n");
            test.done();
        }
    }
    var objst = objectstream.createSerializeStream(stream);
    objst.write(1);
    objst.write(2);
    objst.end();
};

exports['write string to object stream'] = function (test) {
    test.expect(1);
    var stream = {
        write: function (data) {
            test.equal(data, '"foo"\n');
        },
        end: function () {
            test.done();
        }
    }
    var objst = objectstream.createSerializeStream(stream);
    objst.write("foo");
    objst.end();
};