import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


type LoginResponse = {
  code: string,
  accessToken: string,
  refreshToken: string,
  status: string,
  message: string,
}

const URL = "http://192.168.219.108:8000";

async function postLogin(id: string, passWord: string) {
  const res = await axios.post(URL + '/auth/login', {
    accountName: id,
    password: passWord
  }).catch((err) => {
    console.log("it's an Error! ");
    console.log(err);
  })

  //실패시
  if (res?.data.code === 'LOGIN_FAILED') { res.data.status = 'FAIL' }

  //성공 시 
  if (res?.data.code === 'LOGIN_SUCCEEDED') {
    AsyncStorage.setItem('loginId', id);
    AsyncStorage.setItem('accessToken', res.data.accessToken);
    AsyncStorage.setItem('refreshToken', res.data.refreshToken);
    res.data.status = 'OK';
  }

  return res?.data;
}

const postLogout = async (id: string) => {
  const token = await AsyncStorage.getItem('accessToken');
  await axios.post(URL + '/auth/logout', {
    accountName: id,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((res) => {
    console.log(res.data);
    return res.data;
  }).catch((err) => {
    console.log(err);
  })
}

const getUserInfo = async (id: string) => {
  const token = await AsyncStorage.getItem('accessToken');
  await axios.get(URL + '/auth/profile', {
    headers: {
      "Authorization": `Bearer ${token}`
    },
    params: {
      accountName: id,
    }
  }).then((res) => {
    console.log(res.data);
    return res.data;
  }
  ).catch((err) => {
    console.log(err);
  })
}


export { postLogin, getUserInfo, postLogout };