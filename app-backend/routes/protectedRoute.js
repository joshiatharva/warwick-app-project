const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');


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

// module.exports.isAdminValidated = function(req, res) {
//     try {
//         var token = jwt.verify(req.headers.authorization.split(" ")[1], "This is secret");
//         if (token.admin) {
//             var admin = await Admin.findOne({_id: admin});
//             if (admin) {
//                 return token;
//             } else {
//                 return false;
//             }
//         } else {
//             return false;
//         }
//     } catch (err) {
//         return err;
//     }
// }
