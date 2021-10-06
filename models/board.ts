import * as mongoose from "mongoose";
const schema = mongoose.Schema;

const commentSchema = new schema({
    contents : String,
    author : String,
    authorID : String,
    date : Date,
    dateText : String
});

const boardSchema = new schema({
    title: String, //제목
    contents: String, //내용
    author : String, //작성자 이름
    date: Date, //작성일
    dateText : String, //ex) '2021-10-05 15:41:40'
    imageDir : String,
    like : {type : Number, default: 0}, //좋아요
    likeUsers : [String], //이 글에 좋아요를 누른 유저들
    comments : [commentSchema] //댓글
});

export default mongoose.model('board', boardSchema);