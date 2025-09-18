import { z } from "zod";

export const USER_SCHEMA = z.object({
    name: z.string()
      .nonempty("Nome é obrigatório")
      .refine(
        (val) => val.trim().split(/\s+/).length >= 2,
        { message: "Informe pelo menos nome e sobrenome" }
      ),
    email: z.string().email("E-mail inválido").nonempty("E-mail é obrigatório"),
    password: z.string().nonempty("Senha é obrigatória").min(8, "A senha deve ter pelo menos 8 caracteres")
  });