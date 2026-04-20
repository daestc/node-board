const multer = require('multer');
const path = require('path');

// 파일명 처리
const makeFileName = (req, file, cb) => {
  // 확장자 추출(예시: .png, .jpg, .pdf)
  const ext = path.extname(file.originalname);
  // cb(에러 없음, 업로드한 시간.확장자로 파일명 생성)
  cb(null, Date.now() + ext);
};

// 프로필 이미지 저장 경로 설정
// destination: 파일 저장 경로
// fileName: 저장될 파일 명
const profileStorage = multer.diskStorage(
  {
    destination: (req, file, cb) => {
      cb(null, 'public/images/profile');
    },
    filename: makeFileName
  }
);

// 게시판 이미지 저장 경로 설정
const boardStorage = multer.diskStorage(
  {
    destination: (req, file, cb) => {
      cb(null, 'public/images/upload');
    },
    filename: makeFileName
  }
);

// 이미지 필터
const imageFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
  // pdf형식: aplication/pdf
  if(allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('이미지 파일만 업로드 가능합니다'));
  }
  
};

// 프로필 사진 미들웨어
const uploadProfile = multer({
  // 저장 경로(public/images/profile/업로드한 시간(밀리초)_원본파일.확장자)
  storage: profileStorage,
  // 파일의 용량 (1024 * 1024) = 1mb
  limits: {fileSize: 5 * 1024 * 1024},
  // 형식 제한
  fileFilter: imageFilter
});

// 게시글 이미지 미들웨어
const uploadBoard = multer({
  // 저장 경로(public/images/profile/업로드한 시간(밀리초)_원본파일.확장자)
  storage: boardStorage,
  // 파일의 용량 (1024 * 1024) = 1mb
  limits: {fileSize: 20 * 1024 * 1024},
  // 형식 제한
  fileFilter: imageFilter
});

module.exports = {uploadProfile, uploadBoard};