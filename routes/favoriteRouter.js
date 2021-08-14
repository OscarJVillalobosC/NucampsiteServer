const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user.id }).populate('user').populate('campsites').then((favorite) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsites);
        })
            .catch(err => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id }).then((favorite) => {
            if (favorite) {
                req.body.forEach((fav) => {
                    if (!favorite.campsites.includes(fav._id)) {
                        favorite.campsites.push(fav_id);
                    }
                })
                favorite.save().then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                    .catch(err => next(err));
            }
            else {
                Favorite.create({ user: req.user._id }).then(favorite => {
                    req.body.forEach((fav) => {
                        if (!favorite.campsites.includes(fav._id)) {
                            favorite.campsites.push(fav_id);
                        }
                    })
                    favorite.save().then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                        .catch(err => next(err));
                })
                    .catch(err => next(err));
            }
        })
            .catch(err => next(err));
        Favorite.create(req.body)
            .then(favorites => {
                console.log('Favorite Created ', favorites);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            })
            .catch(err => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .then((favorite) => {
                res.statusCode = 200;
                if (favorite) {
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                } else {
                    res.setHeader("Content-Type", "text/plain");
                    res.end("You do not have any favorites to delete");
                }
            })
            .catch((err) => next(err));
    });

    favoriteRouter.route('/:campsiteId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {
        res.statusCode = 403;
        res.end(`GET operation not supported on /favorites/${req.params.campsiteId}`);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
        Favorite.findOne({user: req.user._id})
        .then(favorite => {
            if ({user: req.user._id}) {
                favorite.campsites.push(element);
                favorite.save()
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch(err => next(err));
            } else {
                Favorite.create({user: req.user._id})
                .then(favorite => {
                    req.body.forEach(element => {
                        if (!favorite.campsites.includes(element._id)) {
                            favorite.campsites.push(element)
                        }
                    });
                    favorite.save()
                    .then(favorite => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                    .catch(err => next(err));
                })
                .catch(err => next(err));
            }
        });
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /favorites/${req.params.campsiteId}`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=> {
        Favorite.findOne({user: req.user._id}).then((favorite) =>{
            if(favorite) {
                const index = favorite.campsites.indexOf(req.params.campsiteId)
                if (index >= 0) {favorite.campsites.splice(index,1)}
                favorite.save().then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }).catch(err => next(err));
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type','text/plain');
                res.end('You do not have any favorites to delete.');
            }
        })
        .catch(err => next(err));
    })

module.exports = favoriteRouter;

