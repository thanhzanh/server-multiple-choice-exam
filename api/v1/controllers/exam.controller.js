const Exam = require("../models/exam.model");
const Question = require("../models/question.model");
const User = require("../models/user.model");
const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/search");
const slugify = require("slugify");

// [GET] /api/v1/exams/index
module.exports.index = async(req, res) => {
    const user = res.locals.user; // user người dùng đăng nhập
    const find = {
        deleted: false,
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

        // tạo slug
        const slug = slugify(title, { lower: true, strict: true });
        
        // Lưu vào database
        const exam = new Exam({ title, description, image, level, subject, topic, privacy, status, createdBy, slug });
        const data = await exam.save();
        
        res.json({
            code: 200,
            message: "Tạo bài thi thành công",
            data: data
        });
    } catch (error) {
        console.error("Lỗi khi tạo đề thi:", error);
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

// [GET] /api/v1/exams/search
module.exports.search = async (req, res) => {
    try {
        const keyword = req.query.keyword;     

        const exams = await Exam.find({
            title: { $regex: keyword, $options: "i" },
            status: "active",
            privacy: "public",
            deleted: false
        }).populate("createdBy", "fullName email avatar");        

        res.json(exams);
    } catch (error) {
        console.error("Lỗi server:", error);
        res.status(500).json({ error: error.message });
    }
};

// [GET] /api/v1/exams/:slug
module.exports.examBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        
        const exam = await Exam.findOneAndUpdate(
            { slug },
            { $inc: { views: 1 }},
            { new: true }
        ).populate("createdBy", "fullName avatar");;

        if (!exam) {
            return res.status(400).json({ message: "Bài thi không tồn tại!" });
        }

        // Lấy ra câu hỏi của bài thi đó
        const questions = await Question.find({ examId: exam._id });
        
        res.json({
            exam,
            questions
        });
    } catch (error) {
        res.status(400).json({ error: "Lỗi server" });
    }
};

// [POST] /api/v1/exams/favorite/:examId
module.exports.toggleFavoriteExam = async (req, res) => {
    try {
        const userId = res.locals.user._id;

        const { examId } = req.params;

        const user = await User.findById({ _id: userId }).select("-password");        

        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        // Nếu mà có id bài thi rồi thì loại bỏ, nếu chưa có thì push vào mảng
        const index = user.favoriteExams.indexOf(examId);
        if (index !== -1) {
            user.favoriteExams.splice(index, 1); // Xóa examId khỏi mảng
        } else {
            user.favoriteExams.push(examId); // Thêm examId vào mảng
        }

        // Lưu vào database
        await user.save();

        res.json({
            message: "Cập nhật yêu thích thành công",
            favoriteExams: user.favoriteExams,
        });
    } catch (error) {
        res.status(400).json({ error: "Lỗi server" });
    }
};

// [GET] /api/v1/exams/favorite
module.exports.getFavoriteExams = async (req, res) => {
    try {
        const userId = res.locals.user._id;

        const keyword = req.query.keyword ? req.query.keyword.trim() : "";

        const user = await User.findById({ _id: userId }).populate({
            path: "favoriteExams",
            populate: {
                path: "createdBy",
                select: "fullName avatar" // Lấy thông tin người tạo bài thi
            }
        }); // Lấy thông tin bài thi            

        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        let favoriteExams = user.favoriteExams;

        // Tìm kiếm
        if (keyword) {
            const regex = new RegExp(keyword, "i");
            favoriteExams = favoriteExams.filter(exam => regex.test(exam.title)); // Lọc theo tiêu đề bài thi
        }

        res.json({
            favoriteExams
        });
    } catch (error) {
        res.status(400).json({ error: "Lỗi server" });
    }
};
