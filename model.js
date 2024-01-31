const mongoose = require('mongoose')

const DataSchema = mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // image: {
    //     type: String,
    //     required: true
    // },
    sampleData: {
        type: Array,
        required: true
    },
    // sentence: {
    //     type: String,
    // },
    isGoogleLink: {
        type: Boolean,
        required: true
    }
})
module.exports = mongoose.model("CustomData", DataSchema, 'generator_data')