import { z } from "zod";

export const LoginSchema = z.object({
  usuario: z.string().email("Usuario inválido"),
  senha: z.string().min(6, "A senha precisa ter no mínimo 6 caracteres"),
});

export type LoginType = z.infer<typeof LoginSchema>;

export const CadastroSchema = z.object({
  nome: z
    .string({ required_error: "O nome é obrigatório" })
    .nonempty("O nome não pode ser vazio"),
  
  telefone: z
    .string({ required_error: "O telefone é obrigatório" })
    .nonempty("O telefone não pode ser vazio")
    .regex(
      /^\(\d{2}\)\s\d{5}-\d{4}$/,
      "O telefone deve estar no formato (99) 99999-9999"
    ),
  
  usuario: z
    .string({ required_error: "O usuário é obrigatório" })
    .min(6, "O usuário precisa ter no mínimo 6 caracteres"),
  
  senha: z
    .string({ required_error: "A senha é obrigatória" })
    .min(6, "A senha precisa ter no mínimo 6 caracteres"),
});

export type CadastroType = z.infer<typeof CadastroSchema>;
