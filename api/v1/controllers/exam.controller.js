const Exam = require("../models/exam.model");
const User = require("../models/user.model");
const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/search");

// [GET] /api/v1/exams/index
module.exports.index = async(req, res) => {
    const user = res.locals.user; // user người dùng đăng nhập
    const find = {
        deleted: false,
        status: "active",
        createdBy: user._id
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
        limitItem: 8
    }

    const countExams = await Exam.countDocuments(find);

    const objectPagination = paginationHelper(
        initPagination,
        req.query,
        countExams
    );
    // end pagination

    const exams = await Exam.find(find).sort(sort).skip(objectPagination.skip).limit(objectPagination.limitItem);
        
    res.json({
        exams, 
        pagination: objectPagination
    });
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

// [POST] /api/v1/exams/create
module.exports.create = async(req, res) => {

    try {
        const { title, description, level, subject, topic, privacy, status } = req.body;
        const image = req.file ? req.file.filename : null; // Lưu file ảnh

        // User nào tạo bài thi
        if (!res.locals.user) {
            return res.status(401).json({ code: 401, message: "Chưa xác thực người dùng" });
        }
        createdBy = res.locals.user._id;
        
        // Lưu vào database
        const exam = new Exam({ title, description, image, level, subject, topic, privacy, status, createdBy });
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
        const { id } = req.params;
        const updatedData = req.body;
        
        // Nếu có ảnh, thêm ảnh vào dữ liệu cập nhật
        if (req.file) {
            updatedData.image = req.file.filename;
        }
             
        await Exam.updateOne({
            _id: id
        }, updatedData);
        
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

// [GET] /api/v1/exams/getExamLevels
module.exports.getExamLevels = (req, res) => {
    let levels = Exam.schema.path("level").enumValues;
    res.json({ levels });
};
