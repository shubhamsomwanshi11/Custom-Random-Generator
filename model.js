const mongoose = require('mongoose')

const DataSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    sampleData: {
        type: Array,
        required: true
    },
    sentence: {
        type: String,
        required: true
    },
    isGoogleLink: {
        type: Boolean,
        required: true
    }
})
module.exports = mongoose.model("CustomData", DataSchema, 'generator_data')