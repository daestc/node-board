const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

// 메인 페이지 
router.get('/', boardController.getMainBoards);

module.exports = router;