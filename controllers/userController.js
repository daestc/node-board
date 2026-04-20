const userService = require('../services/userService');

//# 회원 가입 페이지
const getJoin = (req, res) => {
    res.render('user/join', {
        errors: {}
    });
};

//# 회원 가입 처리
const postJoin = async (req, res, next) => {
    try {
        const { email, password, name, address } = req.body;
        //회원 생성
        await userService.createUser({email, password, name, address, uploadFile: req.file});

        console.log('회원가입 완료');
        res.redirect('/');
    } catch (error) {
        // 에러를 미들웨어에 보내기
        return next(error);
    }
};

// 로그인 페이지
const getLogin = (req, res) =>{

    const messages = req.session.messages || [];
    const errorMessage = messages[messages.length - 1] || null;
    req.session.messages = [];

    res.render('user/login', {errorMessage});
};

//로그아웃 처리
const logout = (req, res, next) => {
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        res.redirect('/user/login');
    })
};

//마이페이지
const getInfo = async (req, res) =>{
    if(!req.isAuthenticated()){
        return res.redirect('/user/login');
    }//인증되지 않은 사용자가 마이페이지 요청 시 로그인 페이지로 이동
    res.render('user/info');
};

// 회원 수정 페이지
const getModify = async (req, res) => {
    // 인증되지 않은 사용자가 회원수정 페이지 요청 시 로그인 페이지로 이동
    if(!req.isAuthenticated()) {
        return res.redirect('/user/login');
    }
    res.render('user/modify');
};

// 회원 수정 처리
const postModify = async (req, res, next) => {
    // 인증되지 않은 사용자가 회원수정 페이지 요청 시 로그인 페이지로 이동
    if(!req.isAuthenticated()) {
        return res.redirect('/user/login');
    }
    // 회원정보 수정
    const {password, name, address} = req.body;
    try {
        // DB에서 회원정보 수정(세션에 들어있는 회원의 기본키와 수정하고자 할 값들)
        await userService.updateUser(req.user.id, {password, name, address});
        // 수정 후 마이페이지로 이동
        res.redirect('user/info');
    } catch (error) {
        return next(error);
    }
    
};

// 회원 탈퇴 페이지
const getDelete = async (req, res) => {
  // 인증되지 않은 사용자가 회원수정 페이지 요청 시 로그인 페이지로 이동
  if(!req.isAuthenticated()) {
      return res.redirect('/user/login');
  }
  res.render('user/delete');
};

// 회원 탈퇴 처리
const postDelete = async (req, res, next) => {
  // 인증되지 않은 사용자가 회원수정 페이지 요청 시 로그인 페이지로 이동
  if(!req.isAuthenticated()) {
      return res.redirect('/user/login');
  }
  const password = req.body.password;
  try {
    await userService.deleteUser(req.user.id, password);
    res.redirect('/');
  } catch (error) {
    return next(error);
  }
};

// 이메일 중북확인 처리
const getCheckEmail = async (req, res, next) => {
  const {email} = req.query;

  try {
    const available = await userService.checkEmail(email);
    // DB에 해당 email이 있으면 false, 없으면 true
    res.json({available});
  } catch (error) {
    next(error);
  }
};


module.exports = {getJoin, postJoin, getLogin, logout, getInfo, getModify, postModify, getDelete, postDelete, getCheckEmail};