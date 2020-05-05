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
                            // All steps hande chat after remove contact
                            // Step 0: check active
                            let checkActive = $(`#all-chat`).find(`li[data-chat = ${targetId}]`).hasClass("active");
                            // Step 01: remove leftSide.ejs
                            $("#all-chat").find(`ul a[href = "#uid_${targetId}" ]`).remove();
                            $("#user-chat").find(`ul a[href = "#uid_${targetId}" ]`).remove();
                            // Step 02: remove rightSide.ejs
                            $("#screen-chat").find(`div#to_${targetId}`).remove();
                            // Step 03: remove imageModal
                            $("body").find(`div#imagesModal_${targetId}`).remove();
                            // Step 04: remove attachMentModal
                            $("body").find(`div#attachmentsModal_${targetId}`).remove();
                            // Step 05:  Click first conversation
                            if (checkActive) {
                                $("ul.people").find("a")[0].click();
                            }
                        }
                    },
                });
            });
        });
}
socket.on("response-remove-contact", function (user) {
    // Step 0: check active
    let checkActive = $(`#all-chat`).find(`li[data-chat = ${user.id}]`).hasClass("active");
    $("#contacts").find(`ul li[data-uid= ${user.id}]`).remove();
    decreaseNumberNotifContact("count-contacts"); //js/caculateNotiFContact.js
    // All steps hande chat after remove contact
    // Step 01: remove leftSide.ejs
    $("#all-chat").find(`ul a[href = "#uid_${user.id}" ]`).remove();
    $("#user-chat").find(`ul a[href = "#uid_${user.id}" ]`).remove();
    // Step 02: remove rightSide.ejs
    $("#screen-chat").find(`div#to_${user.id}`).remove();
    // Step 03: remove imageModal
    $("body").find(`div#imagesModal_${user.id}`).remove();
    // Step 03: remove attachMentModal
    $("body").find(`div#attachmentsModal_${user.id}`).remove();
    // Step 05: Click first conversation
    if (checkActive) {
        $("ul.people").find("a")[0].click();
    }
});

$(document).ready(function () {
    removeContact();
});
