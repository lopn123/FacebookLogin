//import
import express from "express";
import axios from "axios";
import queryString from "querystring"
import fs from "fs"
import request from "request";
import User from "../models/user";
//variable
const router = express.Router();
let userFileDir = 'public/userFiles/'; //유저 파일 생성 위치

router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/login', (req, res) => {
    const stringifieldParams = queryString.stringify({
        client_id: "264574525535124",
        redirect_uri: 'http://localhost/auth/callback',
        scope: ['email', 'user_photos'].join(','),
        response_type: 'code',
        auth_type: 'rerequest',
    });

    const facebookUrl = 'https://www.facebook.com/v12.0/dialog/oauth?' + stringifieldParams;

    res.render('login', { facebookUrl: facebookUrl });
});

router.get('/auth/callback', async (req, res) => {
    const access_token = await getAccessTokenFromCode(req.query.code);
    if(access_token)
    {
        console.log('AccessToken : \n' + access_token);
        const userInfo = await getUserInfoWithAccessToken(access_token);

        User.findOne({id : userInfo?.id})
            .then((user) => {
                //유저(전용) 파일 생성
                const dir = userFileDir + userInfo?.id;
                if(!fs.existsSync(dir))
                {
                    fs.mkdirSync(dir, {recursive : true});
                    fs.mkdirSync(dir + '/profileImages');
                }
                //세션에 유저 ID 저장. (현재 로그인 중인 유저를 찾기 위해서)
                req.session.userID = userInfo?.id;

                if(!user)
                {
                    //유저 Schema 생성
                    user = new User();
                    user.id = userInfo?.id;
                    user.nickname = userInfo?.name;
                    user.email = userInfo?.email;

                    const profileImageDir = 'public/userFiles/' + user.id + '/profileImages/facebookProfile.png';
                    //유저 프로필 이미지 저장
                    request(userInfo?.picture.data.url).pipe(fs.createWriteStream(profileImageDir));
                    user.profileImageDir = '/userFiles/' + user.id + '/profileImages/facebookProfile.png';

                    user.save()
                        .then((user : any) => {
                            console.log('user Save : \n' + user);
                        })
                        .catch((err : Error) => {
                            console.error(err);
                        });
                }
                else //이미 저장되어 있는 유저라면,
                {
                    console.log('Already saved user : \n' + user);
                }

                res.redirect('/board_list');
            })
            .catch((err) => {
                console.error(err);
            });
    }
    else
    {
        console.log('Failed receive to access token.');
        res.redirect('/login');
    }
});

export default router;

//Function
async function getAccessTokenFromCode(code : any) { //db
    try {
        const data = await axios({
            url: 'https://graph.facebook.com/v12.0/oauth/access_token',
            method: 'get',
            params: {
                client_id: "264574525535124",
                client_secret: 'c54baba9f76fc42bca512971b33327a4',
                redirect_uri: 'http://localhost/auth/callback',
                code
            }
        });
        console.log('Return AccessToken : \n' + data.data.access_token);
        return data.data.access_token;
    }
    catch (err) {
        console.log(err);
    }
};

async function getUserInfoWithAccessToken(token : any){
    try {
        const data = await axios({
            url: 'https://graph.facebook.com/me?fields=id,name,email,picture&access_token=' + token,
            method: 'get',
            params: {
                redirect_uri: 'http://localhost/auth/callback'
            }
        });
        const userInfo = {
            id : data.data.id,
            name : data.data.name,
            email : data.data.email,
            picture : data.data.picture
        };

        return userInfo;
    }
    catch (err){
        console.log(err);
    }
}