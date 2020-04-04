function addContact() {
    $(".user-add-new-contact").bind("click", function() {
        let targetId = $(this).data("uid");
        $.post("/contact/app-new", { uid: targetId }, function(data) {
            if (data.success) {
                $("#find-user")
                    .find(`div.user-add-new-contact[data-uid= ${targetId}]`)
                    .hide();
                $("#find-user")
                    .find(`div.user-remove-request-contact-sent[data-uid= ${targetId}]`)
                    .css("display", "inline-block");
                increaseNumberNotifCation("noti_contact_counter", 1);

                increaseNumberNotifContact("count-request-contact-sent");
                let userInfoHtml = $("#find-user")
                    .find(`ul li[data-uid = ${targetId}]`)
                    .get(0).outerHTML;
                console.log(userInfoHtml);
                $("#request-contact-sent")
                    .find("ul")
                    .prepend(userInfoHtml);
                removeRequestContactSent(); //js/removeRequestContact.js

                // xử lý realtime
                socket.emit("add-new-contact", { contactId: targetId });
            }
        }); //ajax goi route /contact/app-new khi minh lick vo btn user-add-new-contact
        //uid o day co nghia laf truyen xuong cai uid cho controller nhan dc cai gia tri uid
        //khi click vo uid ta se nhan dc targetId va no se duoc gui xuong
    });
}
socket.on("response-add-new-contact", function(user) {
    let notif = `<div class="notif-readed-flase" data-uid="${user.id}">
    <img
        
        class="avatar-small"
        src="images/users/${user.avatar}"
        alt=""
    />
    <strong>${user.username}"</strong> đã gửi cho bạn 1 lời mời kết bạn! </div> `;
    $(".noti_content").prepend(notif); // đẩy những thông báo mới nhất từ dưới lene, append thì từ dưới lên nếu tính mới nhất
    $("ul.list-notifications").prepend(`<li>${notif}</li>`);
    increaseNumberNotifContact("count-request-contact-received");
    increaseNumberNotifCation("noti_contact_counter", 1);
    increaseNumberNotifCation("noti_counter", 1);
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
            <span>&nbsp ${user.address}.</span>
        </div>
        <div class="user-approve-request-contact-received" data-uid="${user.id}">
            Chấp nhận
        </div>
        <div class="user-remove-request-contact-received action-danger" data-uid="${user.id}">
            Xóa yêu cầu
        </div>
    </div>
    </li>
    `;
    $("#request-contact-received")
        .find("ul")
        .prepend(userInfoHtml);
    removeRequestContactRecieved(); //js/removeRequestRecieved.js
    approveRequestContactRecieved(); //js/approveRequestRecieved.js
});
