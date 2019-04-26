exports.setNewUserRecordsObj = (id, Records) => {
    Records.findOne({ relatedUserId: id }, (err, doc) => {
        if (err) {
            throw err;
        }

        if (doc) {
            return;
        } else {
            const obj = new Records();

            obj.relatedUserId = id;

            obj.save(err => {
                if (err) {
                    throw err;
                }
            })
        }
    });
}

exports.setNewUserBenchmarksObj = (id, Benchmarks) => {
    Benchmarks.findOne({ relatedUserId: id }, (err, doc) => {
        if (err) {
            throw err;
        }

        if (doc) {
            return;
        } else {
            const obj = new Benchmarks();

            obj.relatedUserId = id;

            obj.save(err => {
                if (err) {
                    throw err;
                }
            })
        }
    });
}