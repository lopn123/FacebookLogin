import * as mongoose from "mongoose";
const schema = mongoose.Schema;

const userSchema = new schema({
    id : String,
    nickname : String,
    email : String,
    profileImageDir : String, //프로필 사진 경로
});

export default mongoose.model('user', userSchema);