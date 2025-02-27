const Exam = require("../models/exam.model");

const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/search");

// [GET] /api/v1/exams/index
module.exports.index = async(req, res) => {
    const find = {
        deleted: false
    };

    // search
    let objectSearch = searchHelper(req.query);

    if (req.query.keyword) {
        find.title = objectSearch.regex;
    }
    // end search

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

// [GET] /api/v1/exams/change-status/:id
module.exports.changeStatus = async(req, res) => {
    try {
        const id = req.params.id;
        const { status, privacy } = req.body;

        // kiểm tra exam có tồn tại không
        const exam = await Exam.findById(id);
        if (!exam) {
            res.json({
                code: 400,
                message: "Không tồn tại"
            });
        }

        let updateData = {};
        if (status) {
            updateData.status = status;
        }
        if (privacy) {
            updateData.privacy = privacy;
        }

        // save database
        await Exam.updateOne({ _id: id }, updateData);
        
        res.json({
            code: 200,
            message: "Cập nhật thành công"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại"
        });
    }
};

// [GET] /api/v1/exams/create
module.exports.create = async(req, res) => {
    try {
        const exam = new Exam(req.body)
        const data = await exam.save();
        
        res.json({
            code: 200,
            message: "Tạo bài thi thành công",
            data: data
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Đã xãy ra lỗi"
        });
    }
};

// [PATCH] /api/v1/exams/edit/:id
module.exports.edit = async(req, res) => {
    try {
        const id = req.params.id;
        
        await Exam.updateOne({
            _id: id
        }, req.body);
        
        res.json({
            code: 200,
            message: "Chỉnh sửa thành công"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Đã xãy ra lỗi"
        });
    }
};

// [DELETE] /api/v1/exams/delete/:id
module.exports.delete = async(req, res) => {
    try {
        const id = req.params.id;
        
        await Exam.updateMany({
            _id: id
        }, {
            deleted: true,
            deletedAt: new Date()
        });
        
        res.json({
            code: 200,
            message: "Xóa bài thi thành công"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Đã xãy ra lỗi"
        });
    }
};