import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema=new Schema({
      videofile:{
        type:String,
        required:true
      },
       thumbnail:{
        type:String,
        required:true
      },
       description:{
        type:String,
        required:true
      },
      title:{
        type:String,
        required:true
      },
      duration:{
        type:Number,
        required:true
      },
      views:{
        type:Number,
        default:0
      },
      owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
      }
      




    }
)
videoSchema.plugin(mongooseAggregatePaginate)