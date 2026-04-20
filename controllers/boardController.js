const boardService = require('../services/boardService');
const commentService = require('../services/commentService');

// // # 자유게시판 리스트 페이지
// const getFreeList = async (req, res) => {
//     const category = 'free';
//     const categoryTitle = '자유';
//     const boards = await boardService.getBoardList(category);
//     console.log(boards);
//     res.render('board/list', {
//         errors: {},
//         category,
//         boards,
//         categoryTitle
//     });
// };
// # 게시판 리스트 페이지
const getList = async (req, res, next) => {
    const category = req.params.category;
    let categoryTitle = '';
    switch (category) {
        case 'free':
            categoryTitle = '자유'; break;
        case 'study':
            categoryTitle = '학업'; break;
        case 'suggestion':
            categoryTitle = '건의'; break;
        case 'counsel':
            categoryTitle = '상담'; break;
        default: break;
    }

    // 페이지 정보. 디폴트 1페이지
    const page = parseInt(req.query.page) || 1;
    try {
        const {boards, totalPages, currentPage} = 
            await boardService.getBoardList(category, page);
        res.render('board/list', {
            errors: {},
            categoryTitle,
            category,
            boards,
            totalPages,
            currentPage
        });
        
    } catch (error) {
        next(error);
    }
};

//# 게시판 작성 페이지
const getWrite = async (req, res) => {
    if(!req.isAuthenticated()){
        return res.redirect('/user/login');
    }//인증되지 않은 사용자가 마이페이지 요청 시 로그인 페이지로 이동
    res.render('board/write', {
        errors: {}
    });
};

//# 게시판 작성 처리
const postWrite = async (req, res) => {
    // 인증되지 않은 사용자가 회원수정 페이지 요청 시 로그인 페이지로 이동
    if(!req.isAuthenticated()) {
        return res.redirect('/user/login');
    }
    try {
        const { title, content, category } = req.body;
        const author = req.user.id;

        //회원 생성
        await boardService.createBoard({title, content, author, category, uploadFile: req.file});

        console.log('게시판 작성 완료');
        res.redirect('/');
    } catch (error) {
        console.error('게시판 작성 실패', error.message);
    }
};

// # 게시판 정보 페이지
const getInfo = async (req, res) => {
    const boardId = req.params.boardId;
    const board = await boardService.getBoardInfo(boardId);

    // 댓글 리스트 생성
    const comments = await commentService.getComments(boardId);

    // 페이지 렌더링
    res.render('board/info', {
        errors: {},
        board,
        comments,
        userId: req.user?.id || null
    });
};

// # 게시판 수정 페이지
const getModify = async (req, res) => {
    // 인증되지 않은 사용자가 회원수정 페이지 요청 시 로그인 페이지로 이동
    if(!req.isAuthenticated()) {
        return res.redirect('/user/login');
    }

    const userId = req.params.userId;
    if(userId !== req.user.id) {
        return res.redirect('/board/list/free');
    }

    res.render('board/modify', {
        userId: req.params.userId,
        boardId: req.params.boardId
    });
};

// # 게시판 수정 처리
const postModify = async (req, res) => {
    // 인증되지 않은 사용자가 회원수정 페이지 요청 시 로그인 페이지로 이동
    if(!req.isAuthenticated()) {
        return res.redirect('/user/login');
    }
    
    const userId = req.params.userId;
    if(userId !== req.user.id) {
        return res.redirect('/board/list/free');
    }
    // 게시판 정보 수정
    try {
        const {title, content, category} = req.body;
        const boardId = req.params.boardId;
        await boardService.updateBoard(boardId, {title, content, category});
        // 수정 후 리스트로 이동
        res.redirect(`/board/info/${boardId}`);
    } catch (error) {
        console.error('게시글 수정 실패', error.message);
    }
    
};

// # 게시판 삭제 페이지
const getDelete = (req, res) => {
    // 인증되지 않은 사용자가 회원수정 페이지 요청 시 로그인 페이지로 이동
    if(!req.isAuthenticated()) {
        return res.redirect('/user/login');
    }

    const userId = req.params.userId;
    if(userId !== req.user.id) {
        return res.redirect('/board/list/free');
    }

    res.render('board/delete', {
        userId: req.user.id,
        boardId: req.params.boardId
    });
};

// # 게시판 삭제 처리
const postDelete = async (req, res) => {
    // 인증되지 않은 사용자가 회원수정 페이지 요청 시 로그인 페이지로 이동
    if(!req.isAuthenticated()) {
        return res.redirect('/user/login');
    }

    const userId = req.params.userId;
    if(userId !== req.user.id) {
        return res.redirect('/board/list/free');
    }

    try {
        await boardService.deleteBoard(req.params.boardId);
        res.redirect('/board/list/free');
    } catch (error) {
        console.error(error);
    }
};

// # 댓글 작성 처리
const postCreateComment = async (req, res) => {
    // 인증되지 않은 사용자가 회원수정 페이지 요청 시 로그인 페이지로 이동
    if(!req.isAuthenticated()) {
      return res.redirect('/user/login');
    }

    const userId = req.user.id;
    if(!userId) {
      return res.redirect('/user/login');
    }

    const boardId = req.params.boardId;
    const content = req.body.content;

    try {
      await commentService.createComment(userId, boardId, content);
      res.redirect(`/board/info/${boardId}`);
    } catch (error) {
      console.error('댓글 작성 실패', error.message);
    }
};

// 댓글 삭제 처리
const postDeleteComment = async (req, res) => {
  // input으로 id값 가져오기
  // const {boardId, commentId} = req.body;

  const userId = req.params.userId;
  const boardId = req.params.boardId;
  const commentId = req.params.commentId;

  if(userId !== req.user.id) {
      return res.redirect(`/board/info/${boardId}`);
  }

  try {
    await commentService.deleteComment(userId, boardId, commentId);
    res.redirect(`/board/info/${boardId}`);
  } catch (error) {
    console.error('댓글 삭제 실패', error.message);
  }
};

// 최신글 6개 가져오기
const getMainBoards = async (req, res, error) => {
    try {
        const mainBoards = await boardService.getMainBoards();
        res.render('index', {title : '메인페이지', mainBoards});
    } catch (error) {
        next(error);
    }
}; // getMainBoards()

module.exports = {getList, getWrite, postWrite, getInfo, getModify, postModify, getDelete, postDelete, postCreateComment, postDeleteComment, getMainBoards};