const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const { Schema } = mongoose;

//Suggestion
const suggestion_schema = new Schema({
    user_id:    {
                            type: String,
                            unique: true,
                            index: true
                },
    status:     {
                            type: String,
                            enum: ['PENDING', 'COMPLETED'],
                            default: 'PENDING'
                },
    result:     [Object]
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

const Suggestion = mongoose.model('Suggestion', suggestion_schema);

module.exports = Suggestion;
