const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BenchmarkItem = require('./record-item-model');
const BenchmarkSchema = BenchmarkItem.schema;

const BenchmarksSchema = new Schema({
    relatedUserId: String,
    benchmarks: [BenchmarkSchema]
})

module.exports = mongoose.model('Benchmarks', BenchmarksSchema);