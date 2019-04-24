module.exports = function (app) {
    const auth = require('../controllers/auth-controller.js');
    const records = require('../controllers/records-controller.js');
    const benchmarks = require('../controllers/benchmarks-controller.js');

    app.route('/')
        .get((req, res) => res.send('CrossfitBook server'))
    
    app.route('/auth')
        .get(auth.connect)
        .put(auth.update)
        .delete(auth.delete);

    app.route('/records')
        .get(records.getAll)
        .post(records.addNew)
        .delete(records.delete);

    app.route('/records/:recordTitle/:recordText')
        .post(records.addNewDeep)
        .put(records.updateDeep)
        .delete(records.deleteDeep);

    app.route('/benchmarks')
        .get(benchmarks.getAll)
        .post(benchmarks.addNew)
        .delete(benchmarks.delete);

    app.route('/benchmarks/:benchmarkTitle')
        .post(benchmarks.addNewDeep)
        .put(benchmarks.updateDeep)
        .delete(benchmarks.deleteDeep);
};