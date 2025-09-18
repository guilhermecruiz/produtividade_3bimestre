import { z } from "zod";

export const CREATE_STORE_SCHEMA = z.object({
  name: z.string().nonempty("Nome da loja é obrigatório"),
  userId: z.number({ required_error: "userId é obrigatório" }).int("userId deve ser um número inteiro")
});

export const UPDATE_STORE_SCHEMA = CREATE_STORE_SCHEMA.omit({ userId: true });