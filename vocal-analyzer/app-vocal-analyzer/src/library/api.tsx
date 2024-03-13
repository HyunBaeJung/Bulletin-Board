import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const URL = "http://192.168.219.108:8000";

const postLogin = async (id: string, passWord: string) => {
  await axios.post(URL + '/auth/login', {
    "accountName": id,
    "password": passWord
  }).then((res) => {
    console.log(res.data);
    AsyncStorage.setItem('loginId', id);
    AsyncStorage.setItem('accessToken', res.data.token);
    AsyncStorage.setItem('refreshToken', res.data.refreshToken);
    res.data = 'success';
    return res;
  }).catch((err) => {
    console.log("it's an Error! ");
    console.log(err);
  })
}

const getUserInfo = async (id: string) => {
  const token = await AsyncStorage.getItem('accessToken');
  await axios.get(URL + '/auth/profile', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      "accountName": id,
    }
  }).then((res) => {
    console.log(res.data);
    return res.data;
  }
  ).catch((err) => {
    console.log(err);
  })
}


export { postLogin, getUserInfo };