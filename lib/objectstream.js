
'use strict'

var EventEmitter = process.EventEmitter;

function ObjectDeserializeStream(stream) {
	EventEmitter.prototype.constructor.call(this);
    var buffer = '';
    var self = this;

    stream.on('data', function (data) {
        buffer += data.toString();

        for (var p = buffer.indexOf('\n'); p >= 0; p = buffer.indexOf('\n')) {
            var line = buffer.substring(0, p);

            if (line && line[line.length-1] == '\r')
                line = line.substring(0, line.length - 1);

            buffer = buffer.substring(p + 1);

            if (!line)
                continue;

            try {
                var obj = JSON.parse(line);
                self.emit('data', obj);
            }
            catch (err) {
                self.emit('error', err);
            }
        }
    });

    stream.on('end', function () { self.emit('end'); });
    stream.on('error', function (err) { self.emit('error', err); });
}

ObjectDeserializeStream.prototype.__proto__ = EventEmitter.prototype;

function ObjectSerializeStream(stream) {
	EventEmitter.prototype.constructor.call(this);

    this.write = function (obj) {
        try {
            var json = JSON.stringify(obj);
            stream.write(json + '\n');
        }
        catch (err) {
            this.emit('error', err);
        }
    };

    this.end = function () {
        try {
            stream.end();
        }
        catch (err) {
            this.emit('error', err);
        }
    };
}

ObjectSerializeStream.prototype.__proto__ = EventEmitter.prototype;

function ObjectStream(stream) {
	EventEmitter.prototype.constructor.call(this);

    var input = new ObjectDeserializeStream(stream);
    var output = new ObjectSerializeStream(stream);

    input.on('data', function (data) { self.emit('data', data); });
    input.on('error', function (data) { self.emit('error', data); });
    input.on('endr', function () { self.emit('end'); });

    this.write = function (obj) { output.write(obj); }
    this.end = function () { output.end(); }
}

ObjectStream.prototype.__proto__ = EventEmitter.prototype;

module.exports = {
    createStream: function (stream) { return new ObjectStream(stream); },
    createSerializeStream: function (stream) { return new ObjectSerializeStream(stream); },
    createDeserializeStream: function (stream) { return new ObjectDeserializeStream(stream); }
};

