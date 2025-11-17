const voteService = require("../services/voteService");

/**
* Votar em uma ideia
*/
async function vote(req, res) {
  try {
    await voteService.vote({
      ideaId: req.body.ideaId,
      userId: req.session.user.id,
      isAgreement: req.body.voteType === 'agree',
    });
    req.flash('success_msg', 'Voto adicionado com sucesso!');
    return res.status(201).redirect(req.get("referer") || "/ideas");
  } catch (error) {
    req.flash('error_msg', error.message);
    return res.status(400).redirect('/ideas');
  }
}

/**
* Lipar voto na ideia
*/
async function clearVote(req, res) {
  try {
    await voteService.clearVote({
      ideaId: req.body.ideaId,
      userId: req.session.user.id,
    });
    req.flash('success_msg', 'Voto cancelado com sucesso!');
    return res.status(200).redirect('/ideas');
  } catch (error) {
    req.flash('error_msg', error.message);
    return res.status(400).redirect('/ideas');
  }
}

module.exports = {
  vote,
  clearVote,
};
