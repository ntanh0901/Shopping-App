const Categories = require('../models/categories.m');

module.exports = {
    getCategories: async (req, res) => {
        try {
            const categories = await Categories.getAll();
            res.json({ categories: categories });
        }
        catch (error) {
            console.log("getCategories error: ", error);
            res.json(false);
        }
    },

    updateCategories: async (req, res) => {
        if (!req.user || req.user.LaAdmin !== '1') res.redirect('/');
        try {
            const id = req.body.id;
            const newval = req.body.newval;
            if (await Categories.update(["MaLoai", "TenLoai"], [id, newval], id))
                res.json(true);
            else
                res.json(false);
        }
        catch (error) {
            console.log("updateCategories error: ", error);
            res.json(false);
        }
    },

    deleteCategories: async (req, res) => {
        if (!req.user || req.user.LaAdmin !== '1') res.redirect('/');
        try {
            const id = req.body.id;
            if (await Categories.delete(id))
                res.json(true);
            else
                res.json(false);
        }
        catch (error) {
            console.log("deleteCategories error: ", error);
            res.json(false);
        }
    },

    addCategory: async (req, res) => {
        if (!req.user || req.user.LaAdmin !== '1') res.redirect('/');
        const name = req.body.name;
        const result = await Categories.insert(new Categories(name));
        if (result !== null)
            res.json(result);
    }
}