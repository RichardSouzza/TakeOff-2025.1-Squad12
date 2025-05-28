import axios from "axios";


const _axios = axios.create({
  baseURL: "http://localhost:8000/auth",
  headers: { "Access-Control-Allow-Origin": "http://localhost:8000" },
  timeout: 10000,
});


interface User {
  usuario: string,
  nome: string,
  senha: string,
  telefone: string,
}


export const createUser = async ({ usuario, nome, senha, telefone }: User) => {
  return await _axios.post('/signup', {
      name: nome,
      username: usuario,
      password: senha,
      phone: telefone,
  }).then(response => response.data.data);
};

