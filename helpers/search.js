module.exports = (query) => {
    let objectSearch = {
        keyword: "",
        regex: "",
    };

    // tìm kiếm kiểm tra keyword gửi lên
    if (query.keyword) {
        objectSearch.keyword = query.keyword;

        const regex = new RegExp(objectSearch.keyword, "i");

        objectSearch.regex = regex;
    }

    return objectSearch;
}