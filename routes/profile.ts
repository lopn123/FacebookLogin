/**
 * @swagger
 * tags:
 *  name: Profile
 *  description: 유저 프로필 API 문서
 */
/**
 * @swagger
 * paths:
 *  /profile/{id}:
 *      get:
 *          summary: 프로필 열람
 *          tags: [Profile]
 *          parameters:
 *              - in : path
 *                type: string
 *                required: true
 *                name: id
 *                description: 유저 고유 ID
 *          response:
 *              "200":
 *                  description: 프로필 열람 성공.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/user'
 *              "404":
 *                  description: 존재하지 않는 유저.
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: object
 *                              properties:
 *                                  code:
 *                                      type: number
 *                                      example: 404
 *                                  name:
 *                                      type: string
 *                                      example: 존재하지 않는 유저입니다.
 *  /profile/change:
 *      post:
 *          summary: 유저 프로필 변경
 *          tags: [Profile]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: string
 *                              nickname:
 *                                  type: string
 *          response:
 *              "200":
 *                  description: 프로필 변경 완료.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/user'
 */
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