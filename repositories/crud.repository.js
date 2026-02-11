class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    create(data) {
        return this.model.create(data);
    }

    getById(id) {
        return this.model.findById(id).lean();   // 🔥 lean
    }

    getAll(filter = {}) {
        return this.model.find(filter).lean();   // 🔥 lean
    }

    update(id, data) {
        return this.model.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        ).lean();   // 🔥 lean
    }

    delete(id) {
        return this.model.findByIdAndDelete(id).lean();   // 🔥 lean
    }
}

module.exports = CrudRepository;

