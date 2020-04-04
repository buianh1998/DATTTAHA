function approveRequestContactRecieved() {
    $(".user-approve-request-contact-received")
        .unbind("click")
        .on("click", function () {
            let targetId = $(this).data("uid");

            //jquery chỉ hỗ trợ 2 phương thức là get và post, nếu muốn sử dụng delete or put cần phải viết cú pháp $.ajax
            $.ajax({
                url: "/contact/approve-request-contact-recieved",
                type: "put",
                data: { uid: targetId },
                success: function (data) {
                    if (data.success) {
                        let userInfo = $("#request-contact-received").find(`ul li[data-uid = ${targetId}]`);
                        $(userInfo).find("div.user-approve-request-contact-received").remove();
                        $(userInfo).find("div.user-remove-request-contact-received").remove();
                        $(userInfo).find("div.contactPanel").append(`
                            <div class="user-talk" data-uid="${targetId}">
                                Trò chuyện
                            </div>
                            <div class="user-remove-contact action-danger" data-uid="${targetId}">
                                Xóa liên hệ
                            </div>
                        `);
                        //lấy hết thẻ li
                        let userInfoHtml = userInfo.get(0).outerHTML;
                        $("#contacts").find("ul").prepend(userInfoHtml);
                        $(userInfo).remove();
                        decreaseNumberNotifContact("count-request-contact-received"); //js/caculateNotiFContact.js
                        increaseNumberNotifContact("count-contacts"); //js/caculateNotiFContact.js
                        decreaseNumberNotifCation("noti_contact_counter", 1); //js/caculateNotiFCation.js

                        removeContact();
                        //Chức năng chat sẽ tiếp tục xóa user phần chat

                        socket.emit("approve-request-contact-recieved", { contactId: targetId });
                    }
                },
            });
        });
}
socket.on("response-approve-request-contact-recieved", function (user) {
    let notif = `<div class="notif-readed-flase" data-uid="${user.id}">
    <img
        
        class="avatar-small"
        src="images/users/${user.avatar}"
        alt=""
    />
    <strong>${user.username}"</strong> đã chấp nhận lời mời kết bạn của bạn! </div> `;
    $(".noti_content").prepend(notif); // đẩy những thông báo mới nhất từ dưới lene, append thì từ dưới lên nếu tính mới nhất
    $("ul.list-notifications").prepend(`<li>${notif}</li>`);

    decreaseNumberNotifCation("noti_contact_counter", 1);
    increaseNumberNotifCation("noti_counter", 1);

    decreaseNumberNotifContact("count-request-contact-sent"); //js/caculateNotiFContact.js
    increaseNumberNotifContact("count-contacts"); //js/caculateNotiFContact.js

    $("#request-contact-sent").find(`ul li[data-uid = ${user.id}]`).remove();
    $("#find-user").find(`ul li[data-uid = ${user.id}]`).remove();
    let userInfoHtml = `
        <li class="_contactList" data-uid="${user.id}">
            <div class="contactPanel">
                <div class="user-avatar">
                    <img src="images/users/${user.avatar}" alt="" />
                </div>
                <div class="user-name">
                    <p>
                        ${user.username}
                    </p>
                </div>
                <br />
                <div class="user-address">
                    <span>&${user.address}</span>
                </div>
                <div class="user-talk" data-uid="${user.id}">
                    Trò chuyện
                </div>
                <div class="user-remove-contact action-danger" data-uid="${user.id}">
                    Xóa liên hệ
                </div>
            </div>
        </li>
    `;
    $("#contacts").find("ul").prepend(userInfoHtml);
    removeContact();
});

$(document).ready(function () {
    approveRequestContactRecieved();
    //Chức năng chat sẽ tiếp tục xóa user phần chat
});
