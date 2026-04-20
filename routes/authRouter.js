const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

router.get('/google/', 
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get('/google/callback', 
  passport.authenticate('google', {
    // 인증 실패시 로그인페이지로
    failureRedirect: '/user/login',
    // 인증 성공시 메인페이지로 
    successRedirect: '/'
  })
);

// 네이버로 로그인
router.get('/naver', 
  passport.authenticate('naver')
);

//  
router.get('/naver/callback',
  passport.authenticate('naver', {
    // 인증 실패시 로그인페이지로
    failureRedirect: '/user/login',
    // 인증 성공시 메인페이지로 
    successRedirect: '/'
  })
);

module.exports = router;