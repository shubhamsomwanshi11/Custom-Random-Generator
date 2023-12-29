const e = require('express');
const Data = require('./model');
// Get data
exports.getData = (req, res) => {
    Data.find()
        .then(result => {
            res.status(200).json({
                message: "Generator Data fetched successfully",
                data: result
            })
        })
        .catch(
            error => {
                res.status(500).json({
                    message: "DB error occured",
                    error: error
                })
            }
        )
}

// Post Data
exports.postData = (req, res) => {
    const newData = req.body;
    Data.create(newData)
        .then(result => {
            res.status(201).json({
                message: "Data added successfully",
                data: result
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "DB error occurred",
                error: error
            });
        });
}