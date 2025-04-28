"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginType } from "./validations";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { ToastProvider, useToast } from "@/contexts";


export const useHome = () => {
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<LoginType>({
    defaultValues: {
      email: "",
      senha: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  const router = useRouter();
  const {toastMessage} = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    const { email, senha } = getValues();

    if (email === "teste@email.com" && senha === "123456") {
      const dadosUsuario = { email, nome: "Usuário Teste" };
      setCookie("authMock", JSON.stringify(dadosUsuario));

        toastMessage("Login realizado com sucesso", "success");

      setTimeout(() => {
        router.push("/dashboards");
      }, 1500);
    } else {
      toastMessage("Credenciais inválidas. Use teste@email.com / 123456", "error");
    }

    setIsLoading(false);
  };

  return {
    register,
    handleSubmit,
    handleLogin,
    errors,
    isLoading,
  };
};
