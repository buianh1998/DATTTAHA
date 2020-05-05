function approveRequestContactRecieved() {
    $(".user-approve-request-contact-received")
        .unbind("click")
        .on("click", function () {
            let targetId = $(this).data("uid");
            let targetName = $(this).parent().find("div.user-name>p").text().trim();
            let targetAvater = $(this).parent().find("div.user-avatar>img").attr("src");
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
                        //All steps handel chat after approve contact
                        //Step 01:
                        // $("#contactModal").modal("hide");
                        let subUsername = targetName;
                        if (subUsername.length > 15) {
                            subUsername = subUsername.substr(0, 14);
                        }
                        let leftSide = `
                        <a href="#uid_${targetId}" class="room-chat" data-target="#to_${targetId}">
                            <li class="person" data-chat="${targetId}">
                                <div class="left-avatar">
                                    <div class="dot"></div>
                                    <img src="${targetAvater}" alt="" />
                                </div>
                                <span class="name">
                                    ${subUsername}
                                </span>
                                <span class="time">
                                </span>
                                <span class="preview">
                                </span>
                            </li>
                        </a>
                        `;
                        $("#all-chat").find("ul").prepend(leftSide);
                        $("#user-chat").find("ul").prepend(leftSide);
                        let rightSideData = `
                        <div class="right tab-pane data-chat="${targetId}" id="to_${targetId}">
                            <div class="top">
                                <span>To: <span class="name">${targetName}</span></span>
                                <span class="chat-menu-right">
                                    <a href="#attachmentsModal_${targetId}" class="show-attachments" data-toggle="modal">
                                        Tệp đính kèm
                                        <i class="fa fa-paperclip"></i>
                                    </a>
                                </span>
                                <span class="chat-menu-right">
                                    <a href="javascript:void(0)">&nbsp;</a>
                                </span>
                                <span class="chat-menu-right">
                                    <a href="#imagesModal_${targetId}" class="show-images" data-toggle="modal">
                                        Hình ảnh
                                        <i class="fa fa-photo"></i>
                                    </a>
                                </span>
                            </div>
                            <div class="content-chat">
                                <div class="chat" data-chat="${targetId}">
                                    
                                </div>
                            </div>
                            <div class="write" data-chat="${targetId}">
                                <input type="text" class="write-chat" id="write-chat-${targetId}" data-chat="${targetId}" />
                                <div class="icons">
                                    <a href="#" class="icon-chat" data-chat="${targetId}"><i class="fa fa-smile-o"></i></a>
                                    <label for="image-chat-${targetId}">
                                        <input
                                            type="file"
                                            id="image-chat-${targetId}"
                                            name="my-image-chat"
                                            class="image-chat"
                                            data-chat="${targetId}"
                                        />
                                        <i class="fa fa-photo"></i>
                                    </label>
                                    <label for="attachment-chat-${targetId}">
                                        <input
                                            type="file"
                                            id="attachment-chat-${targetId}"
                                            name="my-attachment-chat"
                                            class="attachment-chat"
                                            data-chat="${targetId}"
                                        />
                                        <i class="fa fa-paperclip"></i>
                                    </label>
                                    <a
                                        href="javascript:void(0)"
                                        id="video-chat-${targetId}"
                                        class="video-chat"
                                        data-chat="${targetId}"
                                    >
                                        <i class="fa fa-video-camera"></i>
                                    </a>
                                    <input type="hidden" id="peer-id" value="" />
                                </div>
                            </div>
                        </div>
                        `;
                        $("#screen-chat").prepend(rightSideData);
                        //Step 4: call function changeScreenChat
                        changeScreenChat();
                        //Step 5: handle imageModal
                        let imageModalData = `
                                                <div class="modal fade" id="imagesModal_${targetId}" role="dialog">
                                                    <div class="modal-dialog modal-lg">
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                                                <h4 class="modal-title">Những hình ảnh trong cuộc trò truyện.</h4>
                                                            </div>
                                                            <div class="modal-body">
                                                                <div class="all-images" style="visibility: hidden;">
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                `;
                        $("body").append(imageModalData);
                        gridPhotos(5);
                        let actachMentModal = `
                        <div class="modal fade" id="attachmentsModal_${targetId}" role="dialog">
                            <div class="modal-dialog modal-lg">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                                        <h4 class="modal-title">Những file đính kèm trong cuộc trò chuyện.</h4>
                                    </div>
                                    <div class="modal-body">
                                        <ul class="list-attachments">
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
                        $("body").append(actachMentModal);
                        //step 8
                        socket.emit("check-status");
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
    //All steps handel chat after approve contact
    //Step 01:nothing to code

    let subUsername = user.username;
    if (subUsername.length > 15) {
        subUsername = subUsername.substr(0, 14);
    }
    let leftSide = `
                        <a href="#uid_${user.id}" class="room-chat" data-target="#to_${user.id}">
                            <li class="person" data-chat="${user.id}">
                                <div class="left-avatar">
                                    <div class="dot"></div>
                                    <img src="images/users/${user.avatar}" alt="" />
                                </div>
                                <span class="name">
                                    ${user.username}
                                </span>
                                <span class="time">
                                </span>
                                <span class="preview">
                                </span>
                            </li>
                        </a>
                        `;
    $("#all-chat").find("ul").prepend(leftSide);
    $("#user-chat").find("ul").prepend(leftSide);
    let rightSideData = `
                        <div class="right tab-pane data-chat="${user.id}" id="to_${user.id}">
                            <div class="top">
                                <span>To: <span class="name">${user.username}</span></span>
                                <span class="chat-menu-right">
                                    <a href="#attachmentsModal_${user.id}" class="show-attachments" data-toggle="modal">
                                        Tệp đính kèm
                                        <i class="fa fa-paperclip"></i>
                                    </a>
                                </span>
                                <span class="chat-menu-right">
                                    <a href="javascript:void(0)">&nbsp;</a>
                                </span>
                                <span class="chat-menu-right">
                                    <a href="#imagesModal_${user.id}" class="show-images" data-toggle="modal">
                                        Hình ảnh
                                        <i class="fa fa-photo"></i>
                                    </a>
                                </span>
                            </div>
                            <div class="content-chat">
                                <div class="chat" data-chat="${user.id}">
                                    
                                </div>
                            </div>
                            <div class="write" data-chat="${user.id}">
                                <input type="text" class="write-chat" id="write-chat-${user.id}" data-chat="${user.id}" />
                                <div class="icons">
                                    <a href="#" class="icon-chat" data-chat="${user.id}"><i class="fa fa-smile-o"></i></a>
                                    <label for="image-chat-${user.id}">
                                        <input
                                            type="file"
                                            id="image-chat-${user.id}"
                                            name="my-image-chat"
                                            class="image-chat"
                                            data-chat="${user.id}"
                                        />
                                        <i class="fa fa-photo"></i>
                                    </label>
                                    <label for="attachment-chat-${user.id}">
                                        <input
                                            type="file"
                                            id="attachment-chat-${user.id}"
                                            name="my-attachment-chat"
                                            class="attachment-chat"
                                            data-chat="${user.id}"
                                        />
                                        <i class="fa fa-paperclip"></i>
                                    </label>
                                    <a
                                        href="javascript:void(0)"
                                        id="video-chat-${user.id}"
                                        class="video-chat"
                                        data-chat="${user.id}"
                                    >
                                        <i class="fa fa-video-camera"></i>
                                    </a>
                                    <input type="hidden" id="peer-id" value="" />
                                </div>
                            </div>
                        </div>
                        `;
    $("#screen-chat").prepend(rightSideData);
    //Step 4: call function changeScreenChat
    changeScreenChat();
    //Step 5: handle imageModal
    let imageModalData = `
                                                <div class="modal fade" id="imagesModal_${user.id}" role="dialog">
                                                    <div class="modal-dialog modal-lg">
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                                                <h4 class="modal-title">Những hình ảnh trong cuộc trò truyện.</h4>
                                                            </div>
                                                            <div class="modal-body">
                                                                <div class="all-images" style="visibility: hidden;">
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                `;
    $("body").append(imageModalData);
    gridPhotos(5);
    let actachMentModal = `
                        <div class="modal fade" id="attachmentsModal_${user.id}" role="dialog">
                            <div class="modal-dialog modal-lg">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                                        <h4 class="modal-title">Những file đính kèm trong cuộc trò chuyện.</h4>
                                    </div>
                                    <div class="modal-body">
                                        <ul class="list-attachments">
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
    $("body").append(actachMentModal);
    //step 8
    socket.emit("check-status");
});

$(document).ready(function () {
    approveRequestContactRecieved();
    //Chức năng chat sẽ tiếp tục xóa user phần chat
});
