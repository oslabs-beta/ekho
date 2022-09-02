"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
mongoose_1.default.connect(process.env.MONGO_URI, {})
    .then(() => console.log('Connected to Mongo DB.'))
    .catch((err) => console.log(err));
const resultSchema = new mongoose_1.default.Schema({
    experimentName: {
        type: String,
        required: true,
    },
    context: {
        type: Object,
    },
    resultLegacy: {
        type: String,
        required: true,
    },
    resultMS: {
        type: String,
        required: true,
    },
    legacyTime: {
        type: Number,
        required: true,
    },
    msTime: {
        type: Number,
        required: true,
    },
    mismatch: {
        type: Boolean,
        required: true,
    },
    ignoredMismatch: {
        type: Boolean,
    },
    mismatchName: {
        type: String,
    },
    createdAt: {
        type: String,
        required: true
    }
});
const Results = mongoose_1.default.model('Results', resultSchema);
exports.default = Results;
