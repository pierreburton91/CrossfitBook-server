const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const BenchmarksSchema = new Schema({
    relatedUserId: ObjectId,
    benchmarks: [{
        title: String,
        wod: String,
        valuesTypesKey: Number,
        history: [{
            value: String,
            date: String, 
            isScaled: Boolean,
            scaleText: String
        }]
    }]
})

module.exports = mongoose.model('Benchmarks', BenchmarksSchema);