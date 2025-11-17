const Vote = require('../models/Vote');

/**
* Votar em uma ideia
* O voto pode ser positivo ou negativo
*/
async function vote({ ideaId, userId, isAgreement }) {
    try {
        const existentVote = await Vote.findOne({ where: { ideaId, userId } });
        const weight = isAgreement ? 1 : -1;

        if (!existentVote) {
            const vote = await Vote.create({ ideaId, userId, weight });
            return vote;
        }

        if (existentVote.weight !== weight) {
            existentVote.weight = weight;
            await existentVote.save();
            return existentVote;
        }

        throw new Error('Você não pode votar mais de uma vez!');
    } catch(error) {
        throw error;
    }
}

/**
* Desfazer voto na ideia
*/
async function clearVote({ ideaId, userId }) {
    const deletedCount = await Vote.destroy({ where: { ideaId, userId } });
    return deletedCount;
}

module.exports = {
    vote,
    clearVote,
};