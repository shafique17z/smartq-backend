const db = require('../models/index.js');
const ImageService = require('../services/ImageService.js');

const User = db.UserModel;
const Vendor = db.VendorProfileModel;
const Customer = db.CustomerProfileModel;

const update = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    User.update(req.body, {
        where: { userid: id }
    })
        .then(num => {
            if (num === 1) {
                res.status(200).send({
                    message: "User was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
};

const deleteUser = async (req, res) => {
    const id = req.params.id;

    User.destroy({
        where: { userid: id }
    })
        .then(num => {
            if (num === 1) {
                res.status(200).send({
                    message: "User was deleted successfully!"
                });
            } else {
                res.status(404).send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
};

const getAll = async (req, res) => {
    try {
        const users = await User.findAll();
        const usersWithImagesPromises = users.map(async (user) => {
            const images = await ImageService.getImagesByUserId(user.userid);
            return { ...user.dataValues, images };
        });
        const usersWithImages = await Promise.all(usersWithImagesPromises);

        res.status(200).send(usersWithImages);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    }
};

const getById = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).send({
            message: "User id is required"
        });
    }

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send({
                message: `User with id=${id} not found`
            });
        }

        const images = await ImageService.getImagesByUserId(id);
        const userData = { ...user.dataValues, images };

        res.status(200).send(userData);
    } catch (err) {
        res.status(500).send({
            message: `Error retrieving User with id=${id}`
        });
    }
};

const getByUsername = async (req, res) => {
    const username = req.params.username;

    if (!username) {
        return res.status(400).send({
            message: "Username is required"
        });
    }

    try {
        const user = await User.findOne({
            where: { username }
        });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const images = await ImageService.getImagesByUserId(user.userid);
        const userData = { ...user.dataValues, images };

        res.status(200).send(userData);
    } catch (err) {
        res.status(500).send({
            message: `Error retrieving User with username=${username}`
        });
    }
};

const getByUsertype = async (req, res) => {
    const usertype = req.params.usertype;

    if (!usertype) {
        return res.status(400).send({
            message: "Usertype is required"
        });
    }

    try {
        const users = await User.findAll({
            where: { usertype }
        });

        const usersWithImages = await Promise.all(users.map(async (user) => {
            const images = await ImageService.getImagesByUserId(user.userid);
            return { ...user.dataValues, images };
        }));

        res.status(200).send(usersWithImages);
    } catch (err) {
        res.status(500).send({
            message: `Error retrieving Users with usertype=${usertype}`
        });
    }
};

module.exports = {
    update,
    deleteUser,
    getAll,
    getById,
    getByUsername,
    getByUsertype
};
