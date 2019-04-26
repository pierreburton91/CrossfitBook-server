const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RecordItem = require('./record-item-model');
const RecordItemSchema = RecordItem.schema;

const RecordsSchema = new Schema({
    relatedUserId: String,
    records: [RecordItemSchema]
})

module.exports = mongoose.model('Records', RecordsSchema);