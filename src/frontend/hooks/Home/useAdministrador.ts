"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as api from "@/api/authentication";
import { useToast } from "@/contexts";
import { zodResolver } from "@hookform/resolvers/zod";
import { CadastroSchema, CadastroType } from "./validations";


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

    await api.createUser(
      { usuario, nome, telefone, senha }
    ).then(() => {
      toastMessage(`Usuário ${usuario} criado com sucesso!`, "success");
      router.push("/")
    });

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
