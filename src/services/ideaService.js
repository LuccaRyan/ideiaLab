const { fn, col, literal } = require("sequelize");
const Idea = require("../models/Idea");
const Category = require("../models/Category");
const User = require("../models/User");
const Vote = require("../models/Vote");

/**
* Buscar todas as ideias
* Dados de Idea, Category, Votes e Status de voto do usuário
* Ordenado por balanço de votos
*/
async function findAllIdeas(userId) {
  try {
    const ideas = await Idea.findAll({
      attributes: {
        include: [
          [
            fn('GREATEST',
              fn('COALESCE', fn('SUM', col('votes.weight')), 0),
              0
            ),
            'voteScore'
          ],
          [
            literal(`EXISTS (
              SELECT 1 FROM votes AS v
              WHERE v.ideaId = Idea.id AND v.userId = ${userId} AND v.weight = 1
            )`),
            'userAgreed'
          ],
          [
            literal(`EXISTS (
              SELECT 1 FROM votes AS v
              WHERE v.ideaId = Idea.id AND v.userId = ${userId} AND v.weight = -1
            )`),
            'userDisagreed'
          ]
        ],
      },
      include: [
        {
          model: Category,
          as: 'category',
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name'],
        },
        {
          model: Vote,
          as: 'votes',
          attributes: [],
        },
      ],
      group: ['Idea.id', 'category.id', 'creator.id'],
      order: [[fn('SUM', col('votes.weight')), 'DESC']],
    });

    return ideas.map(i => {
      const data = i.toJSON();
      return {
        ...data,
        voteScore: Number(data.voteScore) || 0,
        userAgreed: Boolean(Number(data.userAgreed)),
        userDisagreed: Boolean(Number(data.userDisagreed)),
      };
    });
  } catch (error) {
    throw new Error("Erro ao buscar ideias: " + error.message);
  }
}

/**
* Buscar uma ideia
* Dados de Idea, Category, Votes e Status de voto do usuário (opcional)
*/
async function findIdeaById(id, userId) {
  try {
    const idea = await Idea.findOne({
      where: { id },
      attributes: {
        include: [
          [
            fn('GREATEST',
              fn('COALESCE', fn('SUM', col('votes.weight')), 0),
              0
            ),
            'voteScore'
          ],
          ...(userId ? [[
            literal(`EXISTS (
              SELECT 1 FROM votes AS v
              WHERE v.ideaId = Idea.id AND v.userId = ${userId} AND v.weight = 1
            )`),
            'userAgreed'
          ],
          [
            literal(`EXISTS (
              SELECT 1 FROM votes AS v
              WHERE v.ideaId = Idea.id AND v.userId = ${userId} AND v.weight = -1
            )`),
            'userDisagreed'
          ]] : []),
        ],
      },
      include: [
        {
          model: Category,
          as: "category",
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "name"],
        },
        {
          model: Vote,
          as: 'votes',
          attributes: [],
        },
      ],
      group: ['Idea.id', 'category.id', 'creator.id'],
    });

    if (!idea) {
      throw new Error("Ideia não encontrada");
    }

    const data = idea.toJSON();
    return {
      ...data,
      voteScore: Number(data.voteScore) || 0,
      userAgreed: Boolean(Number(data.userAgreed)),
      userDisagreed: Boolean(Number(data.userDisagreed)),
    };
  } catch (error) {
    throw new Error("Erro ao buscar ideia: " + error.message);
  }
}

/**
* Buscar ideias do usuário
* Dados de Idea, Category, Votes e Status de voto do usuário
*/
async function findIdeasByUser(userId) {
  try {
    const ideas = await Idea.findAll({
      where: { createdBy: userId },
      attributes: {
        include: [
          [
            fn('GREATEST',
              fn('COALESCE', fn('SUM', col('votes.weight')), 0),
              0
            ),
            'voteScore'
          ],
          [
            literal(`EXISTS (
              SELECT 1 FROM votes AS v
              WHERE v.ideaId = Idea.id AND v.userId = ${userId} AND v.weight = 1
            )`),
            'userAgreed'
          ],
          [
            literal(`EXISTS (
              SELECT 1 FROM votes AS v
              WHERE v.ideaId = Idea.id AND v.userId = ${userId} AND v.weight = -1
            )`),
            'userDisagreed'
          ]
        ],
      },
      include: [
        {
          model: Category,
          as: "category",
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "name"],
        },
        {
          model: Vote,
          as: 'votes',
          attributes: [],
        },
      ],
      group: ['Idea.id', 'category.id', 'creator.id'],
    });

    return ideas.map(idea => {
      const data = idea.toJSON();
      return {
        ...data,
        voteScore: Number(data.voteScore) || 0,
        userAgreed: Boolean(Number(data.userAgreed)),
        userDisagreed: Boolean(Number(data.userDisagreed)),
      };
    });
  } catch (error) {
    throw new Error("Erro ao buscar ideias do usuário: " + error.message);
  }
}

/**
* Criar ideia
*/
async function createIdea(ideaData, userId) {
  try {
    return await Idea.create({
      title: ideaData.title,
      description: ideaData.description,
      categoryId: ideaData.categoryId,
      createdBy: userId,
    });
  } catch (error) {
    throw new Error("Erro ao criar ideia: " + error.message);
  }
}

/**
* Atualizar ideia
*/
async function updateIdea(id, ideaData, userId) {
  try {
    const idea = await Idea.findByPk(id);

    if (!idea) {
      throw new Error("Ideia não encontrada");
    }
    if (userId !== idea.createdBy) {
      throw new Error("Usuário não autorizado a atualizar esta ideia");
    } 

    await idea.update({
      title: ideaData.title,
      description: ideaData.description,
      categoryId: ideaData.categoryId,
    });

    return idea;
  } catch (error) {
    throw new Error("Erro ao atualizar ideia: " + error.message);
  }
}

/**
* Remover ideia
*/
async function deleteIdea(id, userId) {
  try {
    const idea = await Idea.findByPk(id);

    if (!idea) {
      throw new Error("Ideia não encontrada");
    }
    if (userId !== idea.createdBy) {
      throw new Error("Usuário não autorizado a atualizar esta ideia");
    } 

    await idea.destroy();
    return true;
  } catch (error) {
    throw new Error("Erro ao deletar ideia: " + error.message);
  }
}

module.exports = {
  findAllIdeas,
  findIdeaById,
  findIdeasByUser,
  createIdea,
  updateIdea,
  deleteIdea,
};
