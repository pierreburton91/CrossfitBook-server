const Benchmarks = require('../models/benchmarks-model');
const BenchmarkItem = require('../models/benchmark-item-model');
const createDocs = require('../functions/create-docs');

exports.getAll = function(req, res) {
    Benchmarks.findOne({ relatedUserId: req.body._id }, (err, doc) => {
        if (err) {
            console.log(err);
            res.status(500).end();
        }

        if (!doc) {
            res.status(404).end();
        }

        res.status(200).json(doc.benchmarks);
    })
}

exports.addNew = function(req, res) {
    Benchmarks.findOne({ relatedUserId: req.body._id }, (err, doc) => {
        if (err) {
            console.log(err);
            res.status(500).end();
        }

        if (!doc) {
            try {
                createDocs.setNewUserBenchmarksObj(req.body._id, Benchmarks);
            } catch (err) {
                console.log(err);
                res.status(500).end();
            }
        }

        const newBenchmark = new BenchmarkItem();

        newBenchmark.title = req.body.title;
        newBenchmark.wod = req.body.wod;
        newBenchmark.valueTypesKey = req.body.valueTypesKey;
        newBenchmark.unit = req.body.unit;
        newBenchmark.history.push({
            value: req.body.value,
            date: req.body.date,
            isScaled: req.body.isScaled,
            scaleText: req.body.scaleText
        });

        doc.benchmarks.push(newBenchmark);

        doc.save(err => {
            if (err) {
                console.log(err);
                res.status(500).end();
            }
            res.status(200).json(doc.benchmarks);
        })
    })
}

exports.delete = function(req, res) {
    Benchmarks.findOne({ relatedUserId: req.body._id }, (err, doc) => {
        if (err) {
            console.log(err);
            res.status(500).end();
        }

        if (!doc) {
            res.status(404).end();
        }

        doc.benchmarks.forEach((benchmark, index) => {
            if (benchmark.id == req.body.itemId) {
                doc.benchmarks.splice(index, 1);
            }
        });

        doc.save(err => {
            if (err) {
                console.log(err);
                res.status(500).end();
            }
            res.status(200).json(doc.benchmarks);
        })
    })
}




exports.addNewDeep = function(req, res) {
    Benchmarks.findOne({ relatedUserId: req.body._id }, (err, doc) => {
        if (err) {
            console.log(err);
            res.status(500).end();
        }

        if (!doc) {
            res.status(404).end();
        }

        if (doc.benchmarks.length == 0) {
            res.status(403).end();
        }

        doc.benchmarks.forEach((benchmark) => {
            if (benchmark.id === req.body.itemId) {
                const newItem = {
                    value: req.body.value,
                    date: req.body.date,
                    isScaled: req.body.isScaled,
                    scaleText: req.body.scaleText
                }
                benchmark.history.push(newItem);
            }
        });

        doc.save(err => {
            if (err) {
                console.log(err);
                res.status(500).end();
            }
            res.status(200).json(doc.benchmarks);
        })
    })
}

exports.updateDeep = function(req, res) {
    Benchmarks.findOne({ relatedUserId: req.body._id }, (err, doc) => {
        if (err) {
            console.log(err);
            res.status(500).end();
        }

        if (!doc) {
            res.status(404).end();
        }

        if (doc.benchmarks.length == 0) {
            res.status(403).end();
        }

        const item = doc.benchmarks.find(el => { return el.id === req.body.itemId });
        const historyItem = item.history.find(el => { return el.id === req.body.historyId });

        historyItem.value = req.body.value;
        historyItem.date = req.body.date;
        historyItem.isScaled = req.body.isScaled;
        historyItem.scaleText = req.body.scaleText;

        doc.save(err => {
            if (err) {
                console.log(err);
                res.status(500).end();
            }
            res.status(200).json(doc.benchmarks);
        })
    })
}

exports.deleteDeep = function(req, res) {
    Benchmarks.findOne({ relatedUserId: req.body._id }, (err, doc) => {
        if (err) {
            console.log(err);
            res.status(500).end();
        }

        if (!doc) {
            res.status(404).end();
        }

        if (doc.benchmarks.length == 0) {
            res.status(403).end();
        }

        const item = doc.benchmarks.find(el => { return el.id === req.body.itemId });
        const historyItemIndex = item.history.findIndex(el => { return el.id === req.body.historyId });
        
        item.history.splice(historyItemIndex, 1);

        doc.save(err => {
            if (err) {
                console.log(err);
                res.status(500).end();
            }
            res.status(200).json(doc.benchmarks);
        })
    })
}