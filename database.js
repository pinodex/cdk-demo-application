const { DynamoDB } = require('aws-sdk');
const uuid = require('uuid');

const { REGION, TABLE_NAME } = process.env;

const dynamodb = new DynamoDB({
    region: REGION
});

/**
 * Get current timestamp
 *
 * @return {Number}
 */
function getTimestamp() {
    return Number(Date.now());
}

/**
 * Transform dynamodb item to message object
 *
 * @param  {Object} item
 * @return {Object}
 */
function transformMessage(item) {
    const { id, name, message, timestamp } = item;

    return {
        id: id.S,
        name: name.S,
        message: message.S,
        timestamp: new Date(Number(timestamp.N))
    };
}

/**
 * Add message to database
 *
 * @param  {String} name    Message name
 * @param  {String} message Message content
 * @return {String}         Message ID
 */
async function addMessage(name, message) {
    const id = uuid.v4();

    dynamodb.putItem({
        TableName: TABLE_NAME,
        Item: {
            id: { S: id },
            name: { S: name },
            message: { S: message },
            timestamp: { N: String(getTimestamp()) }
        }
    }).promise();

    return id;
}

/**
 * Get message by ID
 *
 * @param  {String} id Message ID
 * @return {Object}
 */
async function getMessage(id) {
    const { Item } = await dynamodb.getItem({
        TableName: TABLE_NAME,
        Key: {
            id: { S: id }
        }
    }).promise();

    if (Item === undefined) {
        return null;
    }

    return transformMessage(Item);
}

/**
 * Get all messages
 *
 * @return {Array}
 */
async function getAllMessages() {
    const { Items } = await dynamodb.scan({
        TableName: TABLE_NAME
    }).promise();

    const messages = Items.map((item) => transformMessage(item));

    return messages.sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Delete message by ID
 *
 * @param  {String} id Message ID
 */
async function deleteMessage(id) {
    await dynamodb.deleteItem({
        TableName: TABLE_NAME,
        Key: {
            id: { S: id }
        }
    }).promise();
}

module.exports = {
    getMessage,
    getAllMessages,
    addMessage,
    deleteMessage
};
