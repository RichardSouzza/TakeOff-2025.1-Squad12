import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "A senha precisa ter no mínimo 6 caracteres"),
});

export type LoginType = z.infer<typeof LoginSchema>;
