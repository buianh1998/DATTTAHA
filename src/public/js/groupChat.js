function addFriendsToGroup() {
    $("ul#group-chat-friends")
        .find("div.add-user")
        .bind("click", function () {
            let uid = $(this).data("uid");
            $(this).remove();
            let html = $("ul#group-chat-friends")
                .find("div[data-uid=" + uid + "]")
                .html();

            let promise = new Promise(function (resolve, reject) {
                $("ul#friends-added").append(html);
                $("#groupChatModal .list-user-added").show();
                resolve(true);
            });
            promise.then(function (success) {
                $("ul#group-chat-friends")
                    .find("div[data-uid=" + uid + "]")
                    .remove();
            });
        });
}

function cancelCreateGroup() {
    $("#btn-cancel-group-chat").bind("click", function () {
        $("#groupChatModal .list-user-added").hide();
        if ($("ul#friends-added>li").length) {
            $("ul#friends-added>li").each(function (index) {
                $(this).remove();
            });
        }
    });
}
function callSearchFriends(element) {
    if (element.which === 13 || element.type === "click") {
        let keyword = $("#input-search-friends-to-add-group-chat").val();
        let regexKeyword = new RegExp(
            /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
        );
        if (!keyword.length) {
            alertify.notify("Chưa nhập nội dung tìm kiếm", "error", 7);
            return false;
        }
        if (!regexKeyword.test(keyword)) {
            alertify.notify("Chỉ cho phép nhập chữ cái và số, và khoảng trống không được nhập ký tự", "error", 7);
            return false;
        }
        $.get(`/contact/search-friends/${keyword}`, function (data) {
            $("ul#group-chat-friends").html(data);
            addFriendsToGroup();

            // Action hủy việc tạo nhóm trò chuyện
            cancelCreateGroup();
        });
    }
}
function callCreateGroupChat() {
    $("#btn-create-group-chat")
        .unbind("click")
        .on("click", function () {
            let countUsers = $("ul#friends-added").find("li");
            if (countUsers.length < 2) {
                alertify.notify("Vui lòng chọn thêm bạn bè vào nhóm, tối thiểu 2 người", "error", 7);
                return false;
            }
            let groupChatNames = $("#input-name-group-chat").val();
            if (groupChatNames.length < 5 || groupChatNames.length > 30) {
                alertify.notify("Vui lòng nhập tên cuộc trò truyện giới hạn 5 tới 30 ký tự, tối thiểu 2 người", "error", 7);
                return false;
            }
            let arrayIds = [];
            $("ul#friends-added")
                .find("li")
                .each(function (index, item) {
                    arrayIds.push({ userId: $(item).data("uid") });
                });
            Swal.fire({
                title: `Bạn có chắc chắn muốn tạo nhóm &nbsp;${groupChatNames}?`,
                icon: "Info",
                showCancelButton: true,
                confirmButtonColor: "#2ECC71",
                cancelButtonColor: "#ff7675",
                confirmButtonText: "Xác nhận",
                cancelButtonText: "Hủy",
            }).then((result) => {
                if (!result.value) {
                    return false;
                }
                $.post(
                    "/group-chat/add-new",
                    {
                        arrayIds: arrayIds,
                        groupChatNames: groupChatNames,
                    },
                    function (data) {
                        //step 1: hide modal
                        $("#input-name-group-chat").val("");
                        $("#btn-cancel-group-chat").click();
                        $("#groupChatModal").modal("hide");
                        // Step 2: handle leftside.ejs
                        let subGroupChatName = data.groupChat.name;
                        if (subGroupChatName.length > 15) {
                            subGroupChatName = subGroupChatName.substr(0, 14);
                        }
                        let leftSide = `
                            <a href="#uid_${data.groupChat._id}" class="room-chat" data-target="#to_${data.groupChat._id}">
                                <li class="person group-chat" data-chat="${data.groupChat._id}">
                                    <div class="left-avatar">
                                        <img src="images/users/group-avatar-trungquandev.png" alt="" />
                                    </div>
                                    <span class="name">
                                        <span class="group-chat-name">
                                            ${subGroupChatName}<span>...</span>
                                        </span>
                                    </span>
                                    <span class="time">
                                    </span>
                                    <span class="preview">
                                    </span>
                                </li>
                            </a>
                        `;
                        $("#all-chat").find("ul").prepend(leftSide);
                        $("#group-chat").find("ul").prepend(leftSide);
                        //Step 3: handẻr rightSide
                        let rightSideData = `
                            <div class="right tab-pane" data-chat="${data.groupChat._id}" id="to_${data.groupChat._id}">
                                <div class="top">
                                    <span>To: <span class="name">${data.groupChat.name}</span></span>
                                    <span class="chat-menu-right">
                                        <a href="#attachmentsModal_${data.groupChat._id}" class="show-attachments" data-toggle="modal">
                                            Tệp đính kèm
                                            <i class="fa fa-paperclip"></i>
                                        </a>
                                    </span>
                                    <span class="chat-menu-right">
                                        <a href="javascript:void(0)">&nbsp;</a>
                                    </span>
                                    <span class="chat-menu-right">
                                        <a href="#imagesModal_${data.groupChat._id}" class="show-images" data-toggle="modal">
                                            Hình ảnh
                                            <i class="fa fa-photo"></i>
                                        </a>
                                    </span>
                                    <span class="chat-menu-right">
                                        <a href="javascript:void(0)">&nbsp;</a>
                                    </span>
                                    <span class="chat-menu-right">
                                        <a href="javascript: void(0)" class="number-members" data-toggle="modal">
                                            <span class="show-number-members">${data.groupChat.userAmount}</span>
                                            <i class="fa fa-users"></i>
                                        </a>
                                    </span>
                                    <span class="chat-menu-right">
                                        <a href="javascript:void(0)">&nbsp;</a>
                                    </span>
                                    <span class="chat-menu-right">
                                        <a href="javascript: void(0)" class="number-message" data-toggle="modal">
                                            <span class="show-number-message">${data.groupChat.messageAmount}</span>
                                            <i class="fa fa-comment"></i>
                                        </a>
                                    </span>
                                </div>
                                <div class="content-chat">
                                    <div class="chat" data-chat="${data.groupChat._id}">
                                    </div>
                                </div>
                                <div class="write" data-chat="${data.groupChat._id}">
                                    <input
                                        type="text"
                                        class="write-chat chat-in-group"
                                        id="write-chat-${data.groupChat._id}"
                                        data-chat="${data.groupChat._id}"
                                    />
                                    <div class="icons">
                                        <a href="#" class="icon-chat" data-chat="${data.groupChat._id}"><i class="fa fa-smile-o"></i></a>
                                        <label for="image-chat-${data.groupChat._id}">
                                            <input
                                                type="file"
                                                id="image-chat-${data.groupChat._id}"
                                                name="my-image-chat"
                                                class="image-chat chat-in-group"
                                                data-chat="${data.groupChat._id}"
                                            />
                                            <i class="fa fa-photo"></i>
                                        </label>
                                        <label for="attachment-chat-${data.groupChat._id}">
                                            <input
                                                type="file"
                                                id="attachment-chat-${data.groupChat._id}"
                                                name="my-attachment-chat"
                                                class="attachment-chat chat-in-group"
                                                data-chat="${data.groupChat._id}"
                                            />
                                            <i class="fa fa-paperclip"></i>
                                        </label>
                                        <a href="javascrpit:void(0)" id="video-chat-group">
                                            <i class="fa fa-video-camera"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        `;
                        $("#screen-chat").prepend(rightSideData);
                        //Step 4: call function changeScreenChat
                        changeScreenChat();
                        //Step 5: handle imageModal
                        let imageModalData = `
                        <div class="modal fade" id="imagesModal_${data.groupChat._id}" role="dialog">
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

                        //step 06: call function gridPhoto
                        gridPhotos(5);
                        //step 07: handel acctackment modal
                        let actachMentModal = `
                        <div class="modal fade" id="attachmentsModal_${data.groupChat._id}" role="dialog">
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
                        // Step 08: Emit new Group created
                        socket.emit("new-group-created", { groupChat: data.groupChat });
                        // Step 09: nothing to code
                        // Step 10: check status
                        socket.emit("check-status");
                    }
                ).fail(function (response) {
                    alertify.notify(response.responseText, "error", 7);
                });
            });
        });
}
$(document).ready(function () {
    $("#input-search-friends-to-add-group-chat").bind("keypress", callSearchFriends);
    $("#btn-search-friends-to-add-group-chat").bind("click", callFindUser);
    callCreateGroupChat();
    socket.on("response-new-group-created", function (data) {
        //step 1: nothing to code

        // Step 2: handle leftside.ejs
        let subGroupChatName = data.groupChat.name;
        if (subGroupChatName.length > 15) {
            subGroupChatName = subGroupChatName.substr(0, 14);
        }
        let leftSide = `
                <a href="#uid_${data.groupChat._id}" class="room-chat" data-target="#to_${data.groupChat._id}">
                    <li class="person group-chat" data-chat="${data.groupChat._id}">
                        <div class="left-avatar">
                            <img src="images/users/group-avatar-trungquandev.png" alt="" />
                        </div>
                        <span class="name">
                            <span class="group-chat-name">
                                ${subGroupChatName}<span>...</span>
                            </span>
                        </span>
                        <span class="time">
                        </span>
                        <span class="preview">
                        </span>
                    </li>
                </a>
            `;
        $("#all-chat").find("ul").prepend(leftSide);
        $("#group-chat").find("ul").prepend(leftSide);
        //Step 3: handẻr rightSide
        let rightSideData = `
                <div class="right tab-pane" data-chat="${data.groupChat._id}" id="to_${data.groupChat._id}">
                    <div class="top">
                        <span>To: <span class="name">${data.groupChat.name}</span></span>
                        <span class="chat-menu-right">
                            <a href="#attachmentsModal_${data.groupChat._id}" class="show-attachments" data-toggle="modal">
                                Tệp đính kèm
                                <i class="fa fa-paperclip"></i>
                            </a>
                        </span>
                        <span class="chat-menu-right">
                            <a href="javascript:void(0)">&nbsp;</a>
                        </span>
                        <span class="chat-menu-right">
                            <a href="#imagesModal_${data.groupChat._id}" class="show-images" data-toggle="modal">
                                Hình ảnh
                                <i class="fa fa-photo"></i>
                            </a>
                        </span>
                        <span class="chat-menu-right">
                            <a href="javascript:void(0)">&nbsp;</a>
                        </span>
                        <span class="chat-menu-right">
                            <a href="javascript: void(0)" class="number-members" data-toggle="modal">
                                <span class="show-number-members">${data.groupChat.userAmount}</span>
                                <i class="fa fa-users"></i>
                            </a>
                        </span>
                        <span class="chat-menu-right">
                            <a href="javascript:void(0)">&nbsp;</a>
                        </span>
                        <span class="chat-menu-right">
                            <a href="javascript: void(0)" class="number-message" data-toggle="modal">
                                <span class="show-number-message">${data.groupChat.messageAmount}</span>
                                <i class="fa fa-comment"></i>
                            </a>
                        </span>
                    </div>
                    <div class="content-chat">
                        <div class="chat" data-chat="${data.groupChat._id}">
                        </div>
                    </div>
                    <div class="write" data-chat="${data.groupChat._id}">
                        <input
                            type="text"
                            class="write-chat chat-in-group"
                            id="write-chat-${data.groupChat._id}"
                            data-chat="${data.groupChat._id}"
                        />
                        <div class="icons">
                            <a href="#" class="icon-chat" data-chat="${data.groupChat._id}"><i class="fa fa-smile-o"></i></a>
                            <label for="image-chat-${data.groupChat._id}">
                                <input
                                    type="file"
                                    id="image-chat-${data.groupChat._id}"
                                    name="my-image-chat"
                                    class="image-chat chat-in-group"
                                    data-chat="${data.groupChat._id}"
                                />
                                <i class="fa fa-photo"></i>
                            </label>
                            <label for="attachment-chat-${data.groupChat._id}">
                                <input
                                    type="file"
                                    id="attachment-chat-${data.groupChat._id}"
                                    name="my-attachment-chat"
                                    class="attachment-chat chat-in-group"
                                    data-chat="${data.groupChat._id}"
                                />
                                <i class="fa fa-paperclip"></i>
                            </label>
                            <a href="javascrpit:void(0)" id="video-chat-group">
                                <i class="fa fa-video-camera"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        $("#screen-chat").prepend(rightSideData);
        //Step 4: call function changeScreenChat
        changeScreenChat();
        //Step 5: handle imageModal
        let imageModalData = `
            <div class="modal fade" id="imagesModal_${data.groupChat._id}" role="dialog">
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

        //step 06: call function gridPhoto
        gridPhotos(5);
        //step 07: handel acctackment modal
        let actachMentModal = `
            <div class="modal fade" id="attachmentsModal_${data.groupChat._id}" role="dialog">
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
        // Step 08: Emit new Group created: nothing to code
        // Step 09: Emit when menber receichat
        socket.emit("member-received-group-chat", { groupChatId: data.groupChat._id });
        // Step 10: update online
        socket.emit("check-status");
    });
});
