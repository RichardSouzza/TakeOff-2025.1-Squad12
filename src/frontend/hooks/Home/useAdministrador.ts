"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CadastroSchema, CadastroType, LoginSchema, LoginType } from "./validations";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { ToastProvider, useToast } from "@/contexts";


export const useAdministrador = () => {
const { register, handleSubmit, getValues, formState: { errors } } = useForm<CadastroType>({
  defaultValues: {
    nome: "",
    telefone: "",
    usuario: "",
    senha: "",
  },
  resolver: zodResolver(CadastroSchema),
});


  const router = useRouter();
  const {toastMessage} = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleCadastro = async () => {
    setIsLoading(true);

    const { usuario, nome, telefone, senha } = getValues();

    toastMessage(`Usuário ${usuario} criado com sucesso!`, "success");

    setIsLoading(false);
  };

  return {
    handleCadastro,
    register,
    handleSubmit,
    errors,
    isLoading,
  };
};
