"use client";

import Image from "next/image";
import { FaFacebookSquare, FaLinkedin } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { Logos } from "@/components/logos";
import { useAdministrador } from "@/hooks/Home/useAdministrador";
import { useHome } from "@/hooks/Home/useHome";


export default function Home() {
  const { errors, handleCadastro, handleSubmit, isLoading, register } = useAdministrador();

  return (
    <div className="flex flex-col justify-between w-full h-screen bg-[#600000]">
      <header className="bg-[#202124] py-[16px] px-[96px]">
        <Image
          src={Logos.logo_atos_branca}
          width={160}
          height={44}
          alt="Logo da ATOS"
        />
      </header>

      <main className="flex w-full justify-center items-center px-4">
        <div className="flex flex-col w-full max-w-md bg-[#4D0303] p-8 rounded-lg shadow-lg">
          <h2 className="text-white text-[32px] mb-1">Cadastro</h2>
          <p className="text-white text-[20px] mb-6">
            Cadastre um novo usuário
          </p>

        <form onSubmit={handleSubmit(handleCadastro)} className="space-y-4">
        <div>
            <label className="block text-[16px] text-white mb-1">Nome</label>
            <input
            {...register("nome")}
            type="text"
            className="w-full text-white border border-white bg-transparent px-3 py-2 rounded focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Seu nome"
            />
            {errors.nome && (
            <p className="text-red-400 text-sm mt-1">{errors.nome.message}</p>
            )}
        </div>

        <div>
            <label className="block text-[16px] text-white mb-1">Telefone</label>
            <input
            {...register("telefone")}
            type="text"
            className="w-full text-white border border-white bg-transparent px-3 py-2 rounded focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="+557987654321"
            />
            {errors.telefone && (
            <p className="text-red-400 text-sm mt-1">{errors.telefone.message}</p>
            )}
        </div>

        <div>
            <label className="block text-[16px] text-white mb-1">Usuário</label>
            <input
            {...register("usuario")}
            type="text"
            className="w-full text-white border border-white bg-transparent px-3 py-2 rounded focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Usuario"
            />
            {errors.usuario && (
            <p className="text-red-400 text-sm mt-1">{errors.usuario.message}</p>
            )}
        </div>

        <div>
            <label className="block text-[16px] text-white mb-1">Senha</label>
            <input
            {...register("senha")}
            type="password"
            className="w-full text-white border border-white bg-transparent px-3 py-2 rounded focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="••••••••"
            />
            {errors.senha && (
            <p className="text-red-400 text-sm mt-1">{errors.senha.message}</p>
            )}
        </div>

        <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-white cursor-pointer px-4 py-2 font-medium text-[#600000] transition hover:bg-gray-300 rounded ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
            Cadastrar
        </button>
        </form>

        </div>
      </main>

      <footer className="w-full flex justify-between bg-[#4D0303] py-[24px] px-[96px]">
        <div className="flex gap-5">
          <a href="">
            <IoLogoInstagram className="text-white h-[30px] w-[30px]" />
          </a>
          <a href="">
            <FaFacebookSquare className="text-white h-[30px] w-[30px]" />
          </a>
          <a href="">
            <FaLinkedin className="text-white h-[30px] w-[30px]" />
          </a>
        </div>
      </footer>
    </div>
  );
}
