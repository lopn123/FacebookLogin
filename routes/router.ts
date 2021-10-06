/**
 * @swagger
 * tags:
 *  name: Boards
 *  description: Manage Board API
 */
/**
 * @swagger
 * paths:
 *  /board_list:
 *      get:
 *          summary: Lists all the Boards
 *          tags: [Boards]
 *          response:
 *              "200":
 *                  description: The list of Boards.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/board'
 *  /board/write:
 *      post:
 *          summary: Creates a new Board
 *          tags: [Boards]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/board'
 *          response:
 *              "200":
 *                  description: The created board.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/board'
 *  /comment/write:
 *      post:
 *          summary: Creates a new Comment
 *          tags: [Boards]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/comment'
 *          response:
 *              "200":
 *                  description: The created comment.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/comment'
 */
//import
import express from "express";
import multer from "multer";
import User from "../models/user";
import Board from "../models/board";
import Comment from "../models/comment";
import DateFormat from "../function/DateFormat";
//variable
const router = express.Router();
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
})
let upload = multer({
    storage : storage,
});

router.get('/board_list', (req, res) => {
    Board.find({})
        .then((board) => {
            res.render('boardList', { title: '글 목록', board: board, userID : req.session.userID });
        })
        .catch((err) => {
            console.error(err);
        });
});

router.get('/write', (req, res) => {
    User.findOne({id : req.session.userID})
        .then((user) => {
            if(!user)
            {
                console.log('Can not find user.');
                res.redirect('/login');
            }
            else
            {
                res.render('writeBoard', {user : user});
            }
        })
        .catch((err) => {
            console.error(err);
        });
});

router.post('/board/write', upload.single('image'), (req, res) => {
    let board = new Board();
    board.title = req.body.title;
    board.author = req.body.author;
    board.authorID = req.body.authorID;
    board.contents = req.body.contents;
    board.date = Date.now();
    board.dateText = DateFormat(board.date);
    if (req.file) {
        board.imageDir = '/img/' + req.file.filename;
    }

    board.save()
        .then(() => {
            res.redirect('/board_list');
        })
        .catch((err : Error) => {
            console.error(err);
        });
});

router.get('/board/:id', (req, res) => {
    Board.findOne({ _id: req.params.id })
        .then((board) => {
            if(!board)
            {
                res.send('존재하지 않는 유저의 프로필입니다.');
            }
            else
            {
                res.render('board', { board: board });
            }
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/board_list');
        });
});

router.post('/board/like', (req, res) => {
    if(req.session.userID)
    {
        let update = {};
        let like;

        Board.findOne({_id : req.body.id})
            .then((board) => {
                if(board.likeUsers.includes(req.session.userID))
                {
                    like = board.like - 1;
                    update = { $set : {like : like}, $pull : { likeUsers : req.session.userID } };

                    return Board.findOneAndUpdate({_id: req.body.id}, update);
                }
                else
                {
                    like = board.like + 1;
                    update = { like : like, $push : { likeUsers : req.session.userID } };

                    return Board.findOneAndUpdate({_id: req.body.id}, update);
                }
            })
            .then((updatedBoard) => {
                res.redirect('/board/' + updatedBoard._id);
            })
            .catch((err) => {
                console.error(err);
            });
    }
    else
    {
        console.log('로그인이 되어 있지 않아 로그인 페이지로 이동합니다.');
        res.redirect('/login');
    }
});

router.post('/comment/write',  (req, res) => {
    let comment = new Comment();

    comment.contents = req.body.contents;
    comment.date = Date.now();
    comment.dateText = DateFormat(comment.date);

    User.findOne({id : req.session.userID})
        .then((user) => {
            if(!user)
            {
                console.log('사용자를 찾을 수 없음.');
                res.redirect('/login');
            }
            else
            {
                comment.author = user.nickname;
                comment.authorID = user.id;
                return Board.findOneAndUpdate({ _id: req.body.id }, { $push: { comments: comment } });
            }
        })
        .then((updatedBoard) => {
            res.redirect('/board/' + updatedBoard._id);
        })
        .catch((err) => {
            console.error(err);
        });
});

router.post('/board/go_list', (req, res) => {
    res.redirect('/board_list');
});

export default router;