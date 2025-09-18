import express from "express";
import prisma from "../../db.js";
import { getErrorsFromParsedValidation } from "../../utils/validations-utils.js";
import { CREATE_STORE_SCHEMA, UPDATE_STORE_SCHEMA } from "./schemas.js";

const router = express.Router();

/**
 * Listar todas as lojas
 */
router.get('/', async (_req, res) => {
  try {
    const stores = await prisma.store.findMany({
      orderBy: { id: 'asc' },
      include: {
        products: {
          select: { 
            id: true, 
            name: true, 
            price: true 
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    res.json(stores);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao listar lojas' });
  }
});

/**
 * Criar uma nova loja
 * Regras:
 * - Um usuário só pode ter uma loja
 * - O campo name é obrigatório
 * - O userId deve referenciar um usuário existente
 */
router.post('/', async (req, res) => {
  const parseResult = CREATE_STORE_SCHEMA.safeParse(req.body);
  if (!parseResult.success) {
    const messages = getErrorsFromParsedValidation(parseResult.error);
    return res.status(400).json({ errors: messages });
  }
  try {
    const { name, userId } = parseResult.data;

    // Verifica se o usuário existe
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verifica se o usuário já possui uma loja
    const existingStore = await prisma.store.findUnique({ where: { userId } });
    if (existingStore) {
      return res.status(409).json({ error: 'Usuário já possui uma loja' });
    }

    const novaLoja = await prisma.store.create({
      data: {
        name,
        user: { connect: { id: userId } }
      },
      include: { products: true }
    });
    res.status(201).json(novaLoja);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Usuário já possui uma loja' });
    }
    res.status(500).json({ error: 'Erro ao criar loja' });
  }
});

/**
 * Atualizar uma loja
 * Regras:
 * - O campo name é obrigatório 
 */
router.put('/:id', async (req, res) => {
  const parseResult = UPDATE_STORE_SCHEMA.safeParse(req.body);
  if (!parseResult.success) {
    const messages = getErrorsFromParsedValidation(parseResult.error);
    return res.status(400).json({ errors: messages });
  }
  try {
    const { id } = req.params;
    const { name } = parseResult.data;

    // Verifica se a loja existe
    const loja = await prisma.store.findUnique({ where: { id: Number(id) } });
    if (!loja) {
      return res.status(404).json({ error: 'Loja não encontrada' });
    }

    const lojaAtualizada = await prisma.store.update({
      where: { id: Number(id) },
      data: { name },
      include: { products: true }
    });
    res.json(lojaAtualizada);
  } catch (_error) {
    res.status(500).json({ error: 'Erro ao atualizar loja' });
  }
});

/**
 * Deletar uma loja
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se a loja existe
    const loja = await prisma.store.findUnique({ where: { id: Number(id) } });
    if (!loja) {
      return res.status(404).json({ error: 'Loja não encontrada' });
    }

    await prisma.store.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (_error) {
    res.status(500).json({ error: 'Erro ao deletar loja' });
  }
});

export default router;