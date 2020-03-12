const modofun = require('modofun');
const cors = require('cors');

const {
    getAllMessages,
    getMessage,
    addMessage,
    deleteMessage
} = require('./database');

const controllers = {
    /**
     * Get messages
     *
     * @param  {Request}  req
     * @param  {Response} res
     */
    async allMessages(req, res) {
        const messages = await getAllMessages();

        res.json(messages);
    },

    /**
     * Get message
     *
     * @param  {Request}  req
     * @param  {Response} res
     */
    async getMessage(req, res) {
        const [ id ] = req.params;

        const message = await getMessage(id);

        if (message !== null) {
            return res.json(message);
        }

        return res.status(404).json({
            message: 'Message not found'
        });
    },

    /**
     * Add message
     *
     * @param  {Request}  req
     * @param  {Response} res
     */
    async addMessage(req, res) {
        const { name, message } = req.body;

        if (name === undefined || message === undefined) {
            return res.status(406).json({
                message: 'Name and message cannot be empty'
            });
        }

        const id = await addMessage(name, message);

        res.json({
            id
        });
    },

    /**
     * Delete message
     *
     * @param  {Request}  req
     * @param  {Response} res
     */
    async deleteMessage(req, res) {
        const [ id ] = req.params;

        await deleteMessage(id);

        return res.status(200).json({
            message: 'Message deleted'
        });
    }
};

const options = {
    type: 'aws',
    mode: 'reqres',
    middleware: [
        cors()
    ]
};

const handler = modofun(controllers, options);

module.exports = {
    handler
};
