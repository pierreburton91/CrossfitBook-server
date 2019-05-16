const Records = require('../models/records-model');
const RecordItem = require('../models/record-item-model');
const createDocs = require('../functions/create-docs');

exports.getAll = function (req, res) {
    Records.findOne({ relatedUserId: req.body._id }, (err, doc) => {
        if (err) {
            console.log(err);
            res.status(500).end();
        }

        if (!doc) {
            res.status(404).end();
        }

        res.status(200).json(doc.records);
    })
}

exports.addNew = function (req, res) {
    Records.findOne({ relatedUserId: req.body._id }, (err, doc) => {
        if (err) {
            console.log(err);
            res.status(500).end();
        }

        if (!doc) {
            try {
                createDocs.setNewUserRecordsObj(req.body._id, Records);
            } catch (err) {
                console.log(err);
                res.status(500).end();
            }
        }

        const newRecord = new RecordItem();

        newRecord.title = req.body.title;
        newRecord.text = req.body.text;
        newRecord.valueTypesKey = req.body.valueTypesKey;
        newRecord.unit = req.body.unit;
        newRecord.history.push({
            value: req.body.value,
            date: req.body.date
        });

        doc.records.push(newRecord);

        doc.save(err => {
            if (err) {
                console.log(err);
                res.status(500).end();
            }
            res.status(200).json(doc.records);
        })
    })
}

exports.delete = function (req, res) {
    Records.findOne({ relatedUserId: req.body._id }, (err, doc) => {
        if (err) {
            console.log(err);
            res.status(500).end();
        }

        if (!doc) {
            res.status(404).end();
        }

        doc.records.forEach((record, index) => {
            if (record.id == req.body.itemId) {
                doc.records.splice(index, 1);
            }
        });

        doc.save(err => {
            if (err) {
                console.log(err);
                res.status(500).end();
            }
            res.status(200).json(doc.records);
        })
    })
}




exports.addNewDeep = function (req, res) {
    Records.findOne({ relatedUserId: req.body._id }, (err, doc) => {
        if (err) {
            console.log(err);
            res.status(500).end();
        }

        if (!doc) {
            res.status(404).end();
        }

        if (doc.records.length == 0) {
            res.status(403).end();
        }

        doc.records.forEach((record) => {
            if (record.id === req.body.itemId) {
                const newItem = {
                    value: req.body.value,
                    date: req.body.date
                }
                record.history.push(newItem);
            }
        });

        doc.save(err => {
            if (err) {
                console.log(err);
                res.status(500).end();
            }
            res.status(200).json(doc.records);
        })
    })
}

exports.updateDeep = function (req, res) {
    Records.findOne({ relatedUserId: req.body._id }, (err, doc) => {
        if (err) {
            console.log(err);
            res.status(500).end();
        }

        if (!doc) {
            res.status(404).end();
        }

        if (doc.records.length == 0) {
            res.status(403).end();
        }

        const item = doc.records.find(el => { return el.id === req.body.itemId });
        const historyItem = item.history.find(el => { return el.id === req.body.historyId });

        historyItem.value = req.body.value;
        historyItem.date = req.body.date;

        doc.save(err => {
            if (err) {
                console.log(err);
                res.status(500).end();
            }
            res.status(200).json(doc.records);
        })
    })
}

exports.deleteDeep = function (req, res) {
    Records.findOne({ relatedUserId: req.body._id }, (err, doc) => {
        if (err) {
            console.log(err);
            res.status(500).end();
        }

        if (!doc) {
            res.status(404).end();
        }

        if (doc.records.length == 0) {
            res.status(403).end();
        }

        const item = doc.records.find(el => { return el.id === req.body.itemId });
        const historyItemIndex = item.history.findIndex(el => { return el.id === req.body.historyId });
        
        item.history.splice(historyItemIndex, 1);

        doc.save(err => {
            if (err) {
                console.log(err);
                res.status(500).end();
            }
            res.status(200).json(doc.records);
        })
    })
}