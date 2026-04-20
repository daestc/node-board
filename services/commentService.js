const User = require('../models/User');
const Board = require('../models/Board');
const Comment = require('../models/Comment');

// 댓글 작성
async function createComment(userId, boardId, content) {
  const user = await User.findById(userId);
  const board = await Board.findById(boardId);

  if(!user) {
    throw new Error('사용자를 찾을 수 없습니다');
  }

  if(!board) {
    throw new Error('게시글을 찾을 수 없습니다');
  }

    const newComment = new Comment({
        content,
        author: userId,
        post: boardId
    });

    //DB 저장
    await newComment.save();
}

// 댓글 가져오기
async function getComments(boardId) {
  const board = await Board.findById(boardId);
  if(!board) {
    throw new Error('게시글을 찾을 수 없습니다');
  }

  return await Comment.find({ post: boardId})
                      .populate('author')
                      .populate('post')
                      .sort({createdAt: -1});
}

// 댓글 삭제하기
async function deleteComment(userId, boardId, commentId) {
  const user = await User.findById(userId);
  const board = await Board.findById(boardId);
  const comment = await Comment.findById(commentId);

  if(!user) {
    throw new Error('사용자를 찾을 수 없습니다');
  }

  if(!board) {
    throw new Error('게시글을 찾을 수 없습니다');
  }

  if(!comment) {
    throw new Error('댓글을 찾을 수 없습니다');
  }
  
  await Comment.findByIdAndDelete(comment.id);
}

module.exports = {createComment, getComments, deleteComment};