const ideaService = require("../services/ideaService");
const categoryService = require("../services/categoryService");

/**
* Renderizar todas as ideias
*/
async function renderIdeas(req, res) {
  try {
    const ideas = await ideaService.findAllIdeas(req.session.user.id);
    res.status(200).render("all", { ideas });
  } catch (error) {
    req.flash("error_msg", error.message);
    res.status(500).render("all", { ideas: [] });
  }
};

/**
* Renderizar uma ideia por id
*/
async function renderIdea(req, res) {
  const { id } = req.params;
  try {
    const idea = await ideaService.findIdeaById(id, req.session.user.id);
    res.status(200).render("show", { idea });
  } catch (error) {
    req.flash("error_msg", error.message);
    res.status(error.message.includes("não encontrada") ? 404 : 500).redirect("/ideas");
  }
};

/**
* Renderizar ideia do usuário no perfil
*/
async function renderUserIdeas(req, res) {
  try {
    const ideas = await ideaService.findIdeasByUser(req.session.user.id);
    res.status(200).render("profile", { ideas });
  } catch (error) {
    req.flash("error_msg", error.message);
    res.status(500).render("profile", { ideas: [] });
  }
}

/**
* Renderizar o formulário de ideia
*/
async function renderCreateIdea(req, res) {
  try {
    const categories = await categoryService.findAllCategories();
    res.status(200).render("create", { categories });
  } catch (error) {
    req.flash("error_msg", "Não foi possível carregar o formulário");
    res.status(500).render("create", { categories: [], error: error.message });
  }
};

/**
* Criar uma ideia
*/
async function createIdea(req, res) {
  try {
    await ideaService.createIdea(req.body, req.session.user.id);
    req.flash("success_msg", "Ideia criada com sucesso!");
    res.status(201).redirect("/ideas");
  } catch (error) {
    req.flash("error_msg", error.message);
    res.status(400).redirect("/ideas/new");
  }
};

/**
* Renderizar o formulário de ideia para edição
*/
async function renderEditIdea(req, res) {
  const { id } = req.params;
  try {
    const idea = await ideaService.findIdeaById(id);
    const categories = await categoryService.findAllCategories();
    res.status(200).render("edit", { idea, categories });
  } catch (error) {
    req.flash("error_msg", error.message);
    res.status(error.message.includes("não encontrada") ? 404 : 500).redirect("/ideas");
  }
};

/**
* Editar uma ideia
*/
async function updateIdea(req, res) {
  const { id } = req.params;
  try {
    await ideaService.updateIdea(id, req.body, req.session.user.id);
    req.flash("success_msg", "Ideia atualizada com sucesso!");
    res.status(201).redirect("/ideas");
  } catch (error) {
    req.flash("error_msg", error.message);
    res.status(
      error.message.includes("não encontrada") ? 404 : 
      error.message.includes("não autorizado") ? 403 : 
      500
    ).redirect(`/ideas/${id}/edit`);
  }
};

/**
* Remover uma ideia
*/
async function deleteIdea(req, res) {
  const { id } = req.params;
  try {
    await ideaService.deleteIdea(id, req.session.user.id);
    req.flash("success_msg", "Ideia excluída com sucesso!");
    res.status(204).redirect("/ideas");
  } catch (error) {
    req.flash("error_msg", error.message);
    res.status(
      error.message.includes("não encontrada") ? 404 : 
      error.message.includes("não autorizado") ? 403 : 
      500
    ).redirect("/ideas");
  }
};

module.exports = {
  renderIdeas,
  renderIdea,
  renderUserIdeas,
  renderCreateIdea,
  renderEditIdea,
  createIdea,
  updateIdea,
  deleteIdea,
};
