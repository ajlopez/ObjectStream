# ObjectStream

Bidirectional and unidirectional object streams for Node.js.

## Installation

Via npm on Node:

```
npm install objectstream
```


## Usage

Reference in your program:

```js
var objectstream = require('objectstream');
```

Write objects to a serialize stream:
```js
var stream = fs.createSerializeStream(filename);
var objstream = objectstream.createSerializeStream(stream);
objstream.write({ name: 'Adam', age: 800 });
objstream.write({ name: 'Eve', age: 700 });
objstream.end();
```
`createSerializeStream` accepts a writable stream as parameter. In this example, the objects will be written
to a file. The final content will be two lines, with the objects serialized using `JSON.stringify`:
```
{"name":"Adam","age":800}
{"name":"Eve","age":700}
```

Now, given the same file (already closed), you can read the objects using a deserialize stream:
```js
var stream = fs.createDeserializeStream(filename);
var objstream = objectstream.createDeserializeStream(stream);
objstream.on('data', function (data) { console.dir(data); });
objstream.on('end', function () { console.dir('done'); });
```
You will receive two deserialized objects.

There is a bidirectional object stream:
```js
var objstream = fs.createStream(bidirectionalstream);
```
For example, the parameter could be a socket, that is a bidirectional stream implementation.

Alternatively, you can specify a readable stream and writable stream:
```js
var objstream = fs.createStream(readstream, writestream);
```
You can write and read objects:
```js
objstream.on('data', function (obj) { console.dir(obj); });
objstream.write({ message: 'hello', arguments: { name: 'Adam' }});
```

## Development

```
git clone git://github.com/ajlopez/ObjectStream.git
cd ObjectStream
npm install
npm test
```

## Samples

TBD

## To do

- Samples

## Versions

- 0.0.1: Published
- 0.0.2: Published. Improved write stream, testing writable property before write.
- 0.0.3: Published. Reviewing internal events. Updated engine range
- 0.0.4: Published. Write only if output stream is writable
- 0.0.5: Published. Using events module; using simpleunit

## Contribution

Feel free to [file issues](https://github.com/ajlopez/ObjectStream) and submit
[pull requests](https://github.com/ajlopez/ObjectStream/pulls) — contributions are
welcome.

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

