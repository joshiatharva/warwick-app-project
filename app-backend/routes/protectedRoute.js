const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


module.exports = function isValidated(token) {
    if (token) {
        try {
            var payload = jwt.verify(token, "This is secret");
            return true;
        } catch (err) {
            console.log(payload);
            return false;
        }
    } else {
        return false;
    }
}
