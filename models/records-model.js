const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const RecordsSchema = new Schema({
    relatedUserId: ObjectId,
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