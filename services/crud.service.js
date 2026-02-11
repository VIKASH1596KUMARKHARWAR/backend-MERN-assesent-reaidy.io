class CrudService {
    constructor(repository) {
        this.repository = repository;
    }

    create(data) {
        return this.repository.create(data);
    }

    getAll(filter) {
        return this.repository.findAll(filter);
    }

    getById(id) {
        return this.repository.findById(id);
    }

    update(id, data) {
        return this.repository.update(id, data);
    }

    delete(id) {
        return this.repository.delete(id);
    }
}

module.exports = CrudService;
