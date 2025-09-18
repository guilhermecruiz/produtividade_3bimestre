import { z } from "zod";

export const PRODUCT_SCHEMA = z.object({
  name: z.string().nonempty("Nome do produto é obrigatório"),
  price: z.number({ required_error: "Preço é obrigatório" }).positive("Preço deve ser maior que zero"),
  storeId: z.number({ required_error: "storeId é obrigatório" }).int("storeId deve ser um número inteiro")
});
