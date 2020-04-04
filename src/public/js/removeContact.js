function removeContact() {
    $(".user-remove-contact")
        .unbind("click")
        .on("click", function () {
            let targetId = $(this).data("uid");
            let username = $(this).parent().find("div.user-name p").text();
            //jquery chỉ hỗ trợ 2 phương thức là get và post, nếu muốn sử dụng delete or put cần phải viết cú pháp $.ajax
            Swal.fire({
                title: `Bạn có chắc chắn muốn xóa ${username} khỏi danh bạ không?`,
                text: "Bạn không thể hoàn tác lại quá trình này!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#2ECC71",
                cancelButtonColor: "#ff7675",
                confirmButtonText: "Xác nhận",
                cancelButtonText: "Hủy",
            }).then((result) => {
                if (!result.value) {
                    return false;
                }
                $.ajax({
                    url: "/contact/remove-contact",
                    type: "delete",
                    data: { uid: targetId },
                    success: function (data) {
                        if (data.success) {
                            $("#contacts").find(`ul li[data-uid= ${targetId}]`).remove();
                            decreaseNumberNotifContact("count-contacts"); //js/caculateNotiFContact.js
                            //Chức năng chat sẽ tiếp tục xóa user phần chat
                            socket.emit("remove-contact", { contactId: targetId });
                        }
                    },
                });
            });
        });
}
socket.on("response-remove-contact", function (user) {
    $("#contacts").find(`ul li[data-uid= ${user.id}]`).remove();
    decreaseNumberNotifContact("count-contacts"); //js/caculateNotiFContact.js
});

$(document).ready(function () {
    removeContact();
});
