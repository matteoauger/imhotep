const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Type = {
    SALE: 'Vente',
    RENT: 'Location'
};

const PublishStatus = {
    PUBLISHED: 'Publiée',
    NOT_PUBLISHED: 'Non publiée'
};

const TransactionStatus = {
    AVAILABLE: 'Disponible',
    RENTED: 'Louée',
    SALED: 'Vendue'
};

const CommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 2048
    }
});

const QuestionSchema = new Schema({
    question: CommentSchema,
    answers: [CommentSchema]
});

const PictureSchema = new Schema({
    data: {
        type: Buffer,
        required: true
    },
    contentType: {
        type: String,
        required: true,
        validate: /^image\/\w{1,6}$/
    }
});

const AdSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 126
    },
    type: {
        type: String,
        enum: Object.values(Type),
        required: true,
    },
    publish_status: {
        type: String,
        enum: Object.values(PublishStatus),
        required: true
    },
    transaction_status: {
        type: String,
        enum: Object.values(TransactionStatus),
        required: true
    },
    description: {
        type: String,
        required: true,
        minlength: 16,
        maxlength: 1024
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    disponibility: {
        type: Date,
        default: Date.now
    },
    pictures: [PictureSchema],
    questions: [QuestionSchema]
});

module.exports = mongoose.model('Ad', AdSchema);