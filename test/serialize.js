
var objectstream = require('..'),
    path = require('path'),
    fs = require('fs');

exports['write number to object stream'] = function (test) {
    test.expect(1);
    var stream = {
        on: function () { },
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
        on: function () { },
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
        on: function () { },
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


exports['write object to object stream'] = function (test) {
    test.expect(1);
    var stream = {
        on: function () { },
        write: function (data) {
            test.equal(data, '{"x":1,"y":2}\n');
        },
        end: function () {
            test.done();
        }
    }
    var objst = objectstream.createSerializeStream(stream);
    objst.write({ x: 1, y: 2});
    objst.end();
};

exports['write object to file'] = function (test) {
    test.expect(1);
    var filename = path.join(__dirname, 'test.txt');

    var stream = fs.createWriteStream(filename);

    stream.on('close', function () {
        var content = fs.readFileSync(filename).toString();
        test.equal(content, '{"x":1,"y":2}\n');
        test.done();
    });

    var objst = objectstream.createStream(stream);
    objst.write({ x: 1, y: 2});
    objst.end();
};
