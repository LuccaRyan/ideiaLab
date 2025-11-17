const Category = require('../models/Category');

/**
* Buscar todas as categorias
*/
async function findAllCategories() {
    try {
      const categories = await Category.findAll({
        attributes: ["id", "name"],
        raw: true,
      });

      if (!categories || categories.length === 0) {
        for (const category of defaultCategories) {
          await Category.create(category);
        }

        return await Category.findAll({
          attributes: ["id", "name"],
          raw: true,
        });
      }

      return categories;
    } catch (error) {
      throw new Error("Erro ao buscar categorias: " + error.message);
    }
}

module.exports = {
  findAllCategories,
};