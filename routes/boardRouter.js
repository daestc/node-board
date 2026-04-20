const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const {uploadBoard} = require('../config/upload');

//게시판 페이지
// router.get('/list/free', boardController.getFreeList);
// router.get('/list/study', boardController.getStudyList);
// router.get('/list/suggestion', boardController.getSuggestionList);
// router.get('/list/counsel', boardController.getCounselList);
router.get('/list/:category', boardController.getList);

// 게시판 작성 페이지
router.get('/write', boardController.getWrite);

// 게시판 작성 처리
router.post('/write', uploadBoard.single('uploadFile'), boardController.postWrite);

// 게시판 정보 페이지
router.get('/info/:boardId', boardController.getInfo);

// 게시판 수정 페이지
router.get('/modify/:userId/:boardId', boardController.getModify);

// 게시판 수정 처리
router.post('/modify/:userId/:boardId', boardController.postModify);

// 게시판 삭제 페이지
router.get('/delete/:userId/:boardId', boardController.getDelete);

// 게시판 삭제 처리
router.post('/delete/:userId/:boardId', boardController.postDelete);

// 댓글 작성 처리
router.post('/info/comment/:boardId', boardController.postCreateComment);

// 댓글 삭제 처리
router.post('/info/comment/delete/:userId/:boardId/:commentId', boardController.postDeleteComment);

module.exports = router;