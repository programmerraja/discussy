var mongoose = require("mongoose");
const { String,Number ,ObjectId} = mongoose.Schema.Types;


const AnswerSchema = new mongoose.Schema(
  {

    userId:{
      type: ObjectId,
      ref: "User",
    },
    questionId:{
      type: ObjectId,
      ref: "Question",
    },
    answer:{
      type:String,
      required:true,
    }
  },
  { timestamps: true }
);


const Answer = mongoose.models.Answer || mongoose.model("Answer", AnswerSchema);

module.exports =Answer;
