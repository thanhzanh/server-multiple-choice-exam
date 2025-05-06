const Setting = require('../models/setting.model');

// [GET] /api/v1/settings/
module.exports.getSettings = async (req, res) => {
    try {
        const setting = await Setting.findOne();
        res.json({
            code: 200,
            data: setting
        });
    } catch (error) {
        console.error("Lỗi khi lấy cài đặt: ", error);
        res.status(400).json({ error: "Lỗi lấy cài đặt" });
    }
};

// [PUT] /api/v1/settings/
module.exports.updateSettings = async (req, res) => {
    try {
        const { logoName, examChannelName } = req.body;

        let setting = await Setting.findOne();

        if (!setting) {
            setting = new Setting({ logoName, examChannelName });
        } else {
            setting.logoName = logoName;
            setting.examChannelName = examChannelName;
        }

        // Lưu vào database
        await setting.save();
        res.json({
            code: 200,
            data: setting
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật cài đặt: ", error);
        res.status(400).json({ error: "Lỗi khi cập nhật cài đặt" });
    }
};
