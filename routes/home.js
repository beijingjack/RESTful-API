var secrets = require('../config/secrets');

module.exports = function (router) {

    var homeRoute = router.route('/');

    homeRoute.get(function (req, res) {
        var connectionString = secrets.token;
        res.json({ message: 'My connection string is ' + connectionString });
    });

    // const User = require("../models/user");
    // router.post('/users', (req, res) => {
    //     console.log("here");
    //     const user = new User({
    //         name: req.body.name,
    //         email: req.body.email,
    //         pendingTasks: req.body.pendingTasks,
    //         dateCreated: req.body.dateCreated
    //     });
    //     user
    //       .save()
    //       .then(result => {
    //           console.log(result);
    //           res.status(201).json({
    //               message: "User created",
    //               data: result
    //           });
    //       })
    //       .catch(err => {
    //           res.status(500).json({ error: err });
    //       });
    // });
    return router;
};
