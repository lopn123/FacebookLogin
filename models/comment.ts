import * as mongoose from "mongoose";
const schema = mongoose.Schema;

const commentSchema = new schema({
    contents : String, //내용
    author : String, //작성자 이름
    authorID : String, //작성자 ID
    date : Date, //작성일
    dateText : String
});

export default mongoose.model('comment', commentSchema);