
'use strict'

var util = require('util');

var EventEmitter = process.EventEmitter;

function ObjectDeserializeStream(stream) {
	EventEmitter.call(this);
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

util.inherits(ObjectDeserializeStream, EventEmitter);

function ObjectSerializeStream(stream) {
	EventEmitter.call(this);
    var self = this;

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

    // for http://nodejs.org/api/stream.html#stream_event_drain
    // http://nodejs.org/api/events.html#events_emitter_once_event_listener
    this.once = function (name, fn) {
        stream.once(name, fn);
    };

    stream.on('close', function () { self.emit('close'); });
    stream.on('error', function (err) { self.emit('error', err); });
    stream.on('drain', function () { self.emit('drain'); });
}

util.inherits(ObjectSerializeStream, EventEmitter);

function ObjectStream(readstream, writestream) {
    writestream = writestream || readstream;

	EventEmitter.call(this);
    var self = this;

    var input = new ObjectDeserializeStream(readstream);
    input.on('data', function (data) { self.emit('data', data); });
    input.on('error', function (data) { self.emit('error', data); });
    input.on('end', function () { self.emit('end'); });

    var output = new ObjectSerializeStream(writestream);
    output.on('close', function () { self.emit('close'); });
    output.on('error', function () { self.emit('error'); });
    output.on('drain', function () { self.emit('drain'); });

    this.write = function (obj) { output.write(obj); }
    this.end = function () { output.end(); }
}

util.inherits(ObjectStream, EventEmitter);

module.exports = {
    createStream: function (readstream, writestream) { return new ObjectStream(readstream, writestream); },
    createSerializeStream: function (stream) { return new ObjectSerializeStream(stream); },
    createDeserializeStream: function (stream) { return new ObjectDeserializeStream(stream); }
};

