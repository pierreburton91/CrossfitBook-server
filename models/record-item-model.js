const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecordItemSchema = new Schema({
        title: String,
        text: String,
        valueTypesKey: Number,
        history: [{
            value: String,
            date: String
        }]
})

module.exports = mongoose.model('RecordItem', RecordItemSchema);