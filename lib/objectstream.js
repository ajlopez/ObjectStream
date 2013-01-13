
'use strict'

var EventEmitter = process.EventEmitter;

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

ObjectSerializeStream.prototype.write = function (obj) {
};

module.exports = {
    createSerializeStream: function (stream) { return new ObjectSerializeStream(stream); }
};

