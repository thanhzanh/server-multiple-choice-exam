const Exam = require("../models/exam.model");

const paginationHelper = require("../../../helpers/pagination");

// [GET] /api/v1/exams/index
module.exports.index = async(req, res) => {
    const find = {
        deleted: false
    };

    // sort
    const sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    // end sort

    // pagination
    let initPagination = {
        currentPage: 1,
        limitItem: 3
    }

    const countExams = await Exam.countDocuments(find);

    const objectPagination = paginationHelper(
        initPagination,
        req.query,
        countExams
    );
    // end pagination

    const exam = await Exam.find(find).sort(sort).skip(objectPagination.skip).limit(objectPagination.limitItem);

    res.json(exam);
};

// [GET] /api/v1/exams/detail/:id
module.exports.detail = async(req, res) => {
    try {
        const id = req.params.id;

        const exam = await Exam.findOne({
            _id: id,
            deleted: false
        });

        res.json(exam);
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tìm thấy"
        });
    }
};
