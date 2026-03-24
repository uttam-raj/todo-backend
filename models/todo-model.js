const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    checked:{
        type:Boolean,
        required:true,
    },
    dueDate:{
        type:Date,
    },
    category:{
        type:String,
        enum: ["work", "personal", "urgent", "other"],
        default:"other"
    },
        order: {
        type: Number,
        default: 0
    }
},{timestamps:true});

const Todo = new mongoose.model("Todo",todoSchema);

module.exports = Todo;