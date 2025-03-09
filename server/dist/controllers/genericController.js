var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class GenericController {
    constructor(model) {
        this.model = model;
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield this.model.create(req.body);
                res.status(201).json(doc);
            }
            catch (error) {
                res.status(500).json({ message: 'Server error', error });
            }
        });
        this.getByQuery = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query; // Explicitly cast req.query to Partial<T>
                const docs = yield this.model.find(query);
                if (!docs.length) {
                    res.status(404).json({ message: 'No documents found' });
                    return;
                }
                res.status(200).json(docs);
            }
            catch (error) {
                res.status(500).json({ message: 'Server error', error });
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const updatedDoc = yield this.model.findByIdAndUpdate(id, req.body, { new: true });
                if (!updatedDoc) {
                    res.status(404).json({ message: 'Document not found' });
                    return;
                }
                res.status(200).json(updatedDoc);
            }
            catch (error) {
                next(error);
            }
        });
        this.get = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const doc = yield this.model.findById(id);
                if (!doc) {
                    res.status(404).json({ message: 'Document not found' });
                    return;
                }
                res.status(200).json(doc);
            }
            catch (error) {
                next(error);
            }
        });
        this.getAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const docs = yield this.model.find({});
                res.status(200).json(docs);
            }
            catch (error) {
                next(error);
            }
        });
        this.updateAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.updateMany({}, req.body);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteByQuery = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                const result = yield this.model.deleteMany(query);
                if (result.deletedCount === 0) {
                    res.status(404).json({ message: 'No documents found to delete' });
                    return;
                }
                res.status(200).json({ message: 'Documents deleted successfully', result });
            }
            catch (error) {
                res.status(500).json({ message: 'Server error', error });
            }
        });
    }
}
//# sourceMappingURL=genericController.js.map