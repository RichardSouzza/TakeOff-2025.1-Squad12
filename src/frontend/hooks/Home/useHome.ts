"use client";

import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as api from "@/api/authentication";
import { useToast } from "@/contexts";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginType } from "./validations";


export const useHome = () => {
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<LoginType>({
    defaultValues: {
      usuario: "",
      senha: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  const router = useRouter();
  const {toastMessage} = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    const { usuario, senha } = getValues();

    try {
      const response = await api.login({usuario, senha});
      if (!response.isAxiosError) {
        setCookie("auth-token", JSON.stringify(response));
        toastMessage("Login realizado com sucesso", "success");
        setTimeout(() => {
          router.push("/dashboards");
        }, 1500);
      }
    }
    catch {
      toastMessage("Usuário ou senha incorretos", "error");
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
