/* eslint-disable no-restricted-syntax */
// https://github.com/adam-26/babel-plugin-react-intl-id-hash/blob/master/src/murmurHash.js
const { getOptions } = require('loader-utils');
const validateOptions = require('schema-utils');

const murmurhashJs = require('murmurhash-js');

// https://stackoverflow.com/questions/15761790/convert-a-32bit-integer-into-4-bytes-of-data-in-javascript
function toBytesInt32(num) {
    const arr = new ArrayBuffer(4)
    const view = new DataView(arr)
    view.setUint32(0, num, false)
    return arr
}

function murmur3Hash(id) {
    return Buffer.from(toBytesInt32(murmurhashJs(id))).toString('base64')
}

const schema = {
    type: 'object',
    properties: {
        test: {
            type: 'string',
        },
    },
};

// eslint-disable-next-line func-names
module.exports = function (source) {
    const options = getOptions(this);

    validateOptions(schema, options, 'react-intl-messages-id-hash-loader');
	let json = {};
    try {
		json = JSON.parse(source);
	} catch(e){
		json = {};
		throw new Error('messages file not a JSON file');
	}
    const result = {};
    for (const key of Object.keys(json)) {
        result[murmur3Hash(key)] = json[key]
    }
    return `export default ${JSON.stringify(result)}`;
}