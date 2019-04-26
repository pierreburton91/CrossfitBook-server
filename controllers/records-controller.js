const Records = require('../models/records-model');
const RecordItem = require('../models/record-item-model');
const createDocs = require('../functions/create-docs');

exports.getAll = function(req, res) {
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

exports.addNew = function(req, res) {
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
            res.status(200).json(doc);
        })
    })
}

exports.delete = function(req, res) {
    
}




exports.addNewDeep = function(req, res) {

}

exports.updateDeep = function(req, res) {
    
}

exports.deleteDeep = function(req, res) {
    
}