var mongoose = require("mongoose");
const { String,Number ,ObjectId} = mongoose.Schema.Types;


const QuestionSchema = new mongoose.Schema(
  {

    userId:{
      type: ObjectId,
      ref: "User",
    },
    desc:{
      type:String,
      required:true,
    },
    topics:{
      type:Array,
      required:true
    }
  },
  { timestamps: true }
);


const Question = mongoose.models.Question || mongoose.model("Question", QuestionSchema);

module.exports =Question;
