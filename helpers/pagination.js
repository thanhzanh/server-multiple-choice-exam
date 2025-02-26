module.exports = (objectPagination, query, countRecords) => {
    // nếu mà số page gửi lên
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }

    if (query.limit) {
        objectPagination.limitItem = parseInt(query.limit);
    }

    // thêm vào objectPagination một trường skip (bỏ qua bao nhiêu sản phẩm)
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem;
    // thêm totalPage vào objectPagination
    objectPagination.totalPage = Math.ceil(countRecords/objectPagination.limitItem);

    return objectPagination;
}