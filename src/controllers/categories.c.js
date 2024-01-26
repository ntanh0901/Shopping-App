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
        try {
            const id = req.query.id;
            const newval = req.query.newval;
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
        try {
            const id = req.query.id;
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
        const name = req.query.name;
        const result = await Categories.insert(new Categories(name));
        if (result !== null)
            res.json(result);
    }
}