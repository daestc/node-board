const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');

//회원가입 서비스(DB에 회원 객체 저장)
async function createUser({ email, password, name, address, uploadFile }) {

    //비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 프로필 이미지 처리
    const profile = uploadFile ? uploadFile.filename : 'default-profile.png';

    //회원 객체 생성
    const newUser = new User({
        email,
        password: hashedPassword,
        name,
        address,
        profileImage: profile
    });

    //DB 저장
    await newUser.save();

} // createUser()

//email로 특정 회원 가져오기(passport 로그인 시 사용)
const findUserByEmail = async (email) =>{
    return await User.findOne({email});
}

//ID(고유값)로 특정 회원 가져오기(passport 인증 시 사용)
const findUserById = async(id) =>{
    return await User.findById(id);
}

// 회원 수정
async function updateUser(userId, {password, name, address}) {
  // 임시 데이터(예외처리)
  userId = 'dddd';
  // 해당 고유키를 가지는 도큐먼트를 찾아줌
  if(!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error('사용자를 찾을 수 없습니다');
    error.status = 404;
    throw error;
  }
  const user = await User.findById(userId);
    
  if(!user) {
    throw new Error('사용자를 찾을 수 없습니다');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.name = name;
  user.address = address;
  user.password = hashedPassword;
  await user.save();
} // updateUser()

// 회원 삭제
async function deleteUser(userId, password) {
  const user = await User.findById(userId);
  if(!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error('사용자를 찾을 수 없습니다');
    error.status = 404;
    throw error;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) {
    const error = new Error('비밀번호가 입치하지 않습니다');
    error.status = 400;
    throw error;
  }

  if(!user) {
    throw new Error('사용자를 찾을 수 없습니다');
  }
  await User.findByIdAndDelete(user.id);
} // deleteUser()

// 이메일 중복확인
async function checkEmail(email) {
  // DB에 해당 email이 있으면 true
  const user = await User.findOne({email});
  
  // DB에 해당 email이 있으면 false를 리턴
  return !user;
} // checkEmail()

// 소셜 회원 DB 저장
async function createSocialUser({email, name, profileImage, address, provider}) {
  const newUser = new User({
    email,
    name,
    profileImage,
    address,
    provider
  });
  await newUser.save();
  return newUser;
  
} // createSocialUser()

module.exports = {createUser, findUserByEmail, findUserById, updateUser, deleteUser, checkEmail, createSocialUser};