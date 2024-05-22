
const User = require('../models/user');
const { cloudinary } = require('../cloudinary');
const searchMovies = require('../public/js/searchMoviesInLists');


module.exports.userRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, lists: [{ listName: 'Watched' }, { listName: 'Want to watch' }] });
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if (err) return next(err);
            res.redirect('/home');
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/users/register')
    }
};


module.exports.getLists = async (req, res) => {
    const upgradedLists = await searchMovies.getUpgradedLists(req.user);
    res.render('users/lists', { lists: upgradedLists } )
  };

module.exports.addMovieToList = async (req, res) => {
    const {list, movieId} = req.body;
    const selectedList = req.user.lists;

    for (let l of selectedList) {
        if (l.listName === list) {
            l.movies.push({movieId: movieId});
            break;
        } else {
            console.log('list not found')
        }
    }
    await req.user.save();
    res.redirect(`/movie/${movieId}`);
};

module.exports.changeList = async (req, res) => {
    const {list, movieId, oldList} = req.body;
    const userLists = req.user.lists;

    const newList = userLists.find(l => l.listName === list) 
    const oldListForReal = userLists.find(x => x._id.toString() === oldList.trim())
 
    newList.movies.push({ movieId })
    oldListForReal.movies = oldListForReal.movies.filter(m => m.movieId !== movieId )

    await req.user.save()
    res.redirect(`/movie/${movieId}`);
}

module.exports.deleteMovieFromList = async (req, res) => {
    const { listId, movieId } = req.body;
    const aList = req.user.lists.find(x => x._id.toString() === listId)
    const newMovies = aList.movies.filter(x => x._id.toString() !== movieId)
    aList.movies = newMovies
    req.user.save()
    res.redirect('/users/lists')
};

module.exports.filterByList = async (req, res) => {
    const currentList = req.params.id;
    const upgradedLists = await searchMovies.getUpgradedLists(req.user);
    res.render(`users/list`, {lists: upgradedLists, currentList});
}

module.exports.addNewList = async (req, res) => {
    const newList = req.body.newListName;
    const user = req.user.lists;
    user.push({listName: newList});
    await req.user.save();
    res.redirect('/users/lists');
}

module.exports.deleteList = async (req, res) => {
    const listId = req.params.id;
    const finalLists = req.user.lists.filter(x => x._id.toString() !== listId);
    req.user.lists = finalLists
    req.user.save()
    res.redirect('/users/lists')
}

module.exports.logout =  (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);
        
        res.redirect('/home');
    });
};

module.exports.getProfile = async (req, res) => {
    const user = req.user;
    res.render('users/profile', {user})
};


module.exports.uploadIMG = async (req, res) => { 
    const { _id } = req.user._id;
    const { path, filename } = req.file;

    const { deleteImage } = req.body;
    const user = await User.findByIdAndUpdate(_id, {userIMG:{url: path, filename : filename}});
    await user.save();
    if (deleteImage.length) {
        await cloudinary.uploader.destroy(deleteImage);
    }
    res.redirect('/users/profile');
}
