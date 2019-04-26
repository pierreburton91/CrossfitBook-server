const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BenchmarksSchema = new Schema({
    relatedUserId: String,
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