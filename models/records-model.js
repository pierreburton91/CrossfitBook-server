const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecordsSchema = new Schema({
    relatedUserId: String,
    records: [{
        title: String,
        text: String,
        valueTypesKey: Number,
        history: [{
            value: String,
            date: String
        }]
    }]
})

module.exports = mongoose.model('Records', RecordsSchema);