import { create } from 'zustand'

/**
 * NOTE
 * 새로고침 후에도 데이터가 남아있으혀면 persist를 사용하면 된다.
 * 
 * TO-DO
 * devtools 리액트 네이티브도 사용 가능한가?
 * 
 */

interface loginInfo {
  userId: string;
  setId: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
}
export const userStore = create<loginInfo>((set) => ({
  userId: 'VALUE',
  setId: (val) => set(() => ({ userId: val })),
  password: 'VALUE',
  setPassword: (val) => set(() => ({ password: val })),
}))

