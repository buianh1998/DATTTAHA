function callFindUser(element) {
    if (element.which === 13 || element.type === "click") {
        let keyword = $("#input-find-users-contact").val();
        // let regexKeyword = new RegExp(
        //     /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
        // );
        if (!keyword.length) {
            alertify.notify("Chưa nhập nội dung tìm kiếm", "error", 10);
            return false;
        }
        // if (!regexKeyword.test(keyword)) {
        //     alertify.notify("Chỉ cho phép nhập chữ cái và số, và khoảng trống không được nhập ký tự", "error", 7);
        //     return false;
        // }
        $.get(`/contact/find-users/${keyword}`, function (data) {
            $("#find-user ul").html(data);
            addContact(); //js/addContact.js
            removeRequestContactSent(); // js/removeRequestContact.js
        });
    }
}
$(document).ready(function () {
    $("#input-find-users-contact").bind("keypress", callFindUser);
    $("#btn-find-users-contact").bind("click", callFindUser);
});
