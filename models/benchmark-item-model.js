const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BenchmarkItemSchema = new Schema({
    title: String,
    wod: String,
    valuesTypesKey: Number,
    unit: String,
    history: [{
        value: String,
        date: String, 
        isScaled: Boolean,
        scaleText: String
    }]
})

module.exports = mongoose.model('BenchmarkItem', BenchmarkItemSchema);