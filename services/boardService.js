const User = require('../models/User');
const Board = require('../models/Board');
const Comment = require('../models/Comment');

// 게시글 작성 서비스(DB에 게시글 객체 저장)
async function createBoard({ title, content, author, category, uploadFile }) {

    // 게시판 이미지 처리
    const fileName = uploadFile ? uploadFile.filename : null;
    //게시글 객체 생성
    const newBoard = new Board({
        title,
        content,
        author,
        category,
        file: fileName
    });

    //DB 저장
    await newBoard.save();

} // createBoard()

// 카테고리에 맞는 게시글 가져오기
async function getBoardList(category, page) {
  const limit = 10;
  // 1페이지: 0, 2페이지: 10, 3페이지: 20
  const skip = (page - 1) * limit;
  // 해당 카테고리의 게시판 개수 확인
  const totalBoards = await Board.countDocuments({category});

  // 전체 페이지 수(올림처리) 출력
  // 10개 미만이면 1페이지, 20개 미만이면 2페이지
  const totalPages = Math.ceil(totalBoards / limit);
  
  const boards = await Board.find({category})
                            .populate('author', 'name')
                            .sort({createdAt: -1})
                            .skip(skip)
                            .limit(limit);
  return {boards, totalPages, currentPage: page};
} // getBoardList()

// 게시글 정보 가져오기
async function getBoardInfo(boardId) {
    return await Board.findById(boardId)
                      .populate('author');
} // getBoardInfo()

// 게시글 정보 수정
async function updateBoard(boardId, {title, content, category}) {
  // const board = await Board.findById(boardId);
  // if(!board) {
  //   throw new Error('사용자를 찾을 수 없습니다');
  // }
  // board.title = title;
  // board.content = content;
  // board.category = category;
  // await board.save();
  await Board.findByIdAndUpdate(boardId, {title, content, category});
} // updateBoard()

// 게시글 삭제
async function deleteBoard(boardId) {
  const board = await Board.findById(boardId);
    if(!board) {
      throw new Error('게시글을 찾을 수 없습니다');
    }
  await Board.findByIdAndDelete(board.id);
} // deleteBoard()

// 카테고리와 상관없이 최신 글 6개 가져오기
async function getMainBoards() {
  const mainBoards = await Board.find()
                                .populate('author', 'name')
                                .sort({createdAt: -1})
                                .limit(6);
  return mainBoards;
} // getMainBoards()

module.exports = {createBoard, getBoardList, getBoardInfo, updateBoard, deleteBoard, getMainBoards};