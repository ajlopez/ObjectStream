
var objectstream = require('..'),
    path = require('path'),
    fs = require('fs');

exports['raise if not writable'] = function (test) {
    test.expect(1);
    var stream = {
        write: function (data) {
            test.equal(data, "4\n");
        },
        writable: false,
        end: function () {
            test.done();
        },
        on: function () { }
    }
    var objst = objectstream.createStream(stream);
    test.throws(function () { objst.write(4) });
    test.done();
};

exports['raise if not writable'] = function (test) {
    test.expect(1);
    var stream = {
        write: function (data) {
            test.equal(data, "4\n");
        },
        writable: true,
        end: function () {
            test.done();
        },
        on: function () { }
    }
    var objst = objectstream.createStream(stream);
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
        writable: true,
        end: function () {
            test.equal(this.buffer, "1\n2\n");
            test.done();
        },
        on: function () { }
    }
    var objst = objectstream.createStream(stream);
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
        writable: true,
        end: function () {
            test.done();
        },
        on: function () { }
    }
    var objst = objectstream.createStream(stream);
    objst.write("foo");
    objst.end();
};

exports['write object to object stream'] = function (test) {
    test.expect(1);
    var stream = {
        write: function (data) {
            test.equal(data, '{"x":1,"y":2}\n');
        },
        writable: true,
        end: function () {
            test.done();
        },
        on: function () { }
    }
    var objst = objectstream.createStream(stream);
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
