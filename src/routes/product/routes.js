import express from "express";
import prisma from "../../db.js";
import { getErrorsFromParsedValidation } from "../../utils/validations-utils.js";
import { PRODUCT_SCHEMA } from "./schemas.js";

const router = express.Router();

/**
 * Listar todos os produtos
 */
router.get('/', async (_req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'asc' },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
});

/**
 * Criar um novo produto
 * Regras:
 * - O campo name é obrigatório
 * - O campo price é obrigatório
 * - O campo storeId é obrigatório e deve referenciar uma loja existente
 */
router.post('/', async (req, res) => {
  const parseResult = PRODUCT_SCHEMA.safeParse(req.body);
  if (!parseResult.success) {
    const messages = getErrorsFromParsedValidation(parseResult.error);
    return res.status(400).json({ errors: messages });
  }

  try {
    const { name, price, storeId } = parseResult.data;

    // Verifica se a loja existe
    const loja = await prisma.store.findUnique({ where: { id: storeId } });
    if (!loja) {
      return res.status(404).json({ error: 'Loja não encontrada' });
    }

    const novoProduto = await prisma.product.create({
      data: {
        name,
        price,
        store: { connect: { id: storeId } }
      }
    });
    res.status(201).json(novoProduto);
  } catch (_error) {
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

/**
 * Atualizar um produto
 * Regras:
 * - O campo name é obrigatório
 * - O campo price é obrigatório
 * - O campo storeId, se fornecido, deve referenciar uma loja existente
 */
router.put('/:id', async (req, res) => {
  const parseResult = PRODUCT_SCHEMA.safeParse(req.body);
  if (!parseResult.success) {
    const messages = getErrorsFromParsedValidation(parseResult.error);
    return res.status(400).json({ errors: messages });
  }

  try {
    const { id } = req.params;
    const { name, price, storeId } = parseResult.data;

    // Se storeId for informado, valida se a loja existe
    let storeConnect;
    if (storeId !== undefined) {
      const loja = await prisma.store.findUnique({ where: { id: storeId } });
      if (!loja) {
        return res.status(404).json({ error: 'Loja informada não existe' });
      }
      storeConnect = { connect: { id: storeId } };
    }

    const produtoAtualizado = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        price,
        ...(storeConnect && { store: storeConnect })
      }
    });
    res.json(produtoAtualizado);
  } catch (_error) {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

/**
 * Deletar um produto
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (_error) {
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
});

 
export default router;