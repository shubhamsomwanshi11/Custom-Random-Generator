const Data = require('./model');
// Get data
exports.getData = (req, res) => {
    Data.find(req.params.type == "All" ? {} : { category: req.params.type })
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

exports.getElementData = (req, res) => {
    Data.find({ _id: req.params.id })
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