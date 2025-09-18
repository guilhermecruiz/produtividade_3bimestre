import express from "express";
import prisma from "../../db.js";
import { getErrorsFromParsedValidation } from "../../utils/validations-utils.js";

import { USER_SCHEMA } from "./schemas.js";

const router = express.Router();

/**
 * Listar todos os usuários
 */
router.get("/", async (_req, res) => {
  try {
    const usuarios = await prisma.user.findMany({
      orderBy: { id: "asc" },
      include: {
        store: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    res.json(usuarios);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
});

/**
 * Criar um novo usuário
  * Regras:
  * - O campo email é obrigatório e deve ser único
  * - O campo name é obrigatório
  * - O campo password é obrigatório
  * - O campo name deve conter pelo menos nome e sobrenome
  * - O campo password deve ter no mínimo 8 caracteres
  * - O campo email deve ser um email válido
 */
router.post("/", async (req, res) => {
  const parseResult = USER_SCHEMA.safeParse(req.body);
  if (!parseResult.success) {
    const messages = getErrorsFromParsedValidation(parseResult.error);
    return res.status(400).json({ errors: messages });
  }

  try {
    const { name, email, password } = parseResult.data;
    const novoUsuario = await prisma.user.create({
      data: { name, email, password }
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "E-mail já cadastrado" });
    }

    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

/**
 * Atualizar um usuário
  * Regras:
  * - O campo email é obrigatório e deve ser único
  * - O campo name é obrigatório
  * - O campo password é obrigatório
  * - O campo name deve conter pelo menos nome e sobrenome
  * - O campo password deve ter no mínimo 8 caracteres
  * - O campo email deve ser um email válido
 */
router.put("/:id", async (req, res) => {
  const parseResult = USER_SCHEMA.safeParse(req.body);
  if (!parseResult.success) {
    const messages = getErrorsFromParsedValidation(parseResult.error);
    return res.status(400).json({ errors: messages });
  }

  try {
    const { id } = req.params;
    const { name, email, password } = parseResult.data;

    const usuarioAtualizado = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email, password }
    });

    res.json(usuarioAtualizado);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    if (error.code === "P2002") {
      return res.status(409).json({ error: "E-mail já cadastrado" });
    }
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

/**
 * Remover um usuário
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: Number(id) }
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

export default router;
