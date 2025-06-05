import axios from "axios";


const _axios = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/auth`,
  timeout: 60000, // 60 seconds
});


interface User {
  usuario: string,
  nome: string,
  senha: string,
  telefone: string,
}


interface LoginForm {
  usuario: string,
  senha: string,
}


export const createUser = async ({ usuario, nome, senha, telefone }: User) => {
  return await _axios.post('/signup', {
    name: nome,
    username: usuario,
    password: senha,
    phone: telefone,
  }).then(response => response.data.data);
};


export const login = async ({ usuario, senha }: LoginForm) => {
  return await _axios.get('/signin', {
    params: {
      username: usuario,
      password: senha,
    }
  }).then(response => response.data);
};
