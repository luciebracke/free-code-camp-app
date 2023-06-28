const protect = async (req, res, next) => {
    // si l'utilisateur n'est pas connecté, on renvoie une erreur
    // La l'objet user est stocké dans la session
    const { user } = req.session;

    if (!user){
        return res.status(401).json({
            status: 'failure',
            message: 'Unauthorized'
        });
    }

    // on stocke l'objet user dans req.user
    req.user = user;

    next();
};

module.exports = protect;