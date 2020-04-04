function removeRequestContactRecieved() {
    $(".user-remove-request-contact-received")
        .unbind("click")
        .on("click", function() {
            let targetId = $(this).data("uid");
            //jquery chỉ hỗ trợ 2 phương thức là get và post, nếu muốn sử dụng delete or put cần phải viết cú pháp $.ajax
            $.ajax({
                url: "/contact/remove-request-contact-recieved",
                type: "delete",
                data: { uid: targetId },
                success: function(data) {
                    if (data.success) {
                        // Chức năng đang nghiên cứu
                        // decreaseNumberNotifCation("noti_counter", 1);

                        // $(".noti_content")
                        //     .find(`div[data-uid = ${user.id}]`)
                        //     .remove(); //popup notif
                        // $("ul.list-notifications")
                        //     .find(`li>div[data-uid = ${user.id}]`)
                        //     .parent()
                        //     .remove();
                        decreaseNumberNotifCation("noti_contact_counter", 1);
                        decreaseNumberNotifContact("count-request-contact-received");

                        // xử lý realtime
                        //Xóa ở modal tab đang chờ xác nhận
                        $("#request-contact-received")
                            .find(`li[data-uid = ${targetId}]`)
                            .remove();
                        socket.emit("remove-request-contact-recieved", { contactId: targetId });
                    }
                }
            });
        });
}
socket.on("response-remove-request-contact-recieved", function(user) {
    $("#find-user")
        .find(`div.user-remove-request-contact-sent[data-uid= ${user.id}]`)
        .hide();
    $("#find-user")
        .find(`div.user-add-new-contact[data-uid= ${user.id}]`)
        .css("display", "inline-block");

    $("#request-contact-sent")
        .find(`li[data-uid = ${user.id}]`)
        .remove();
    // Xóa ở modal tab yêu cầu kết bạn
    decreaseNumberNotifContact("count-request-contact-sent");
    decreaseNumberNotifCation("noti_contact_counter", 1);
});
$(document).ready(function() {
    removeRequestContactRecieved();
});
