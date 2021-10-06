//import
import express from "express";
import multer from "multer";
import fs from "fs";
import User from "../models/user";
//variable
const router = express.Router();
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/userFiles/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
});
let upload = multer({
    storage : storage,
});

router.get('/profile/:id',function(req, res){
    User.findOne({id : req.params.id})
        .then((user) => {
            if(!user)
            {
                res.send('유저를 찾을 수 없습니다.');
            }
            else
            {
                res.render('profile', { user : user, sessionID : req.session.userID });
            }
        })
        .catch((err) => {
            console.error(err);
        });
});

router.post('/profile/change', upload.single('image'), (req, res) => {
    let update = {};
    const userID = req.body.id;
    if(req.body.nickname)
    {
        update = {nickname : req.body.nickname};
    }
    else if(req.file)
    {
        const fileName = req.file.filename;
        const oldPath = 'public/userFiles/' + fileName;
        const newPath = 'public/userFiles/' + userID + '/profileImages/' + fileName;
        fs.rename(oldPath, newPath, (err) => {
            if(err)
            {
                console.log(err);
                throw err;
            }
        });
        update = {profileImageDir : '/userFiles/' + userID + '/profileImages/' + req.file.filename};
    }

    User.findOneAndUpdate({id : userID}, update)
        .then((user) => {
            res.redirect('/profile/' + user.id);
        })
        .catch((err) => {
            console.error(err);
        });
});

router.post('/profile/logout', (req, res) => {
    req.session.destroy(() =>{
        req.session;
    });
    res.redirect('/login');
});

export default router;