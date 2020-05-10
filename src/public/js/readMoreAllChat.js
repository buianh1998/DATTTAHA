$(document).ready(function () {
    $("#link-read-more-all-chat")
        .unbind("click")
        .bind("click", function () {
            let skipPersonnal = $("#all-chat").find("li:not(.group-chat)").length;
            let skipGroup = $("#all-chat").find("li.group-chat").length;
            $("#link-read-more-all-chat").css("display", "none");
            $(".read-more-all-chat-loader").css("display", "inline-block");
            $.get(`/message/read-more-allChat?skipPersonnal=${skipPersonnal}&&skipGroup=${skipGroup}`, function (data) {
                if (data.leftSideData.trim() === "") {
                    alertify.notify("Bạn không còn cuộc trò chuyện nào để xem nữa cả.", "error", 7);
                    $("#link-read-more-all-chat").css("display", "inline-block");
                    $(".read-more-all-chat-loader").css("display", "none");
                    return false;
                }
                //Step 01: handle left side
                $("#all-chat").find("ul").append(data.leftSideData);
                // Step 02: handle scroll left
                resizeNiceScrollLeft();
                nineScrollLeft();
                //Step 03: handle right side
                $("#screen-chat").append(data.rightSideData);
                //Step 04:  call function changeScreenChat;
                changeScreenChat();
                //Step 05: conver Image: nothing to code
                // Step 06: handle image modal
                $("body").append(data.imageModalData);
                // Step 07: call gridPhotos(5);
                gridPhotos(5);
                // Step 08: handle attachmentModal
                $("body").append(data.actachmentModalData);
                // Step 09: check online
                socket.emit("check-status");

                $("#link-read-more-all-chat").css("display", "inline-block");
                $(".read-more-all-chat-loader").css("display", "none");
            });
        });
});
// $(document).ready(function () {
//     $("#link-read-more-contactts")
//         .unbind("click")
//         .bind("click", function () {
//             let skipNumber = $("#contacts").find("li").length;

//             $("#link-read-more-contactts").css("display", "none");
//             $(".read-more-all-chat-loader").css("display", "inline-block");
//             $.get(`/contact/read-more-contacts?skipNumber=${skipNumber}`, function (newContactUser) {
//                 if (!newContactUser.length) {
//                     alertify.notify("Bạn không còn bạn bè nào để xem nữa cả.", "error", 7);
//                     $("#link-read-more-contactts").css("display", "inline-block");
//                     $(".read-more-all-chat-loader").css("display", "none");
//                     return false;
//                 }
//                 newContactUser.forEach(function (user) {
//                     $("#contacts").find("ul").append(`
//                 <li class="_contactList" data-uid="${user._id}">
//                     <div class="contactPanel">
//                         <div class="user-avatar">
//                             <img src="images/users/${user.avatar}" alt="" />
//                         </div>
//                         <div class="user-name">
//                             <p>
//                             ${user.username}
//                             </p>
//                         </div>
//                         <br />
//                         <div class="user-address">
//                             <span>&${user.address !== null ? user.address : ""}</span>
//                         </div>
//                         <div class="user-talk" data-uid="${user._id}">
//                             Trò chuyện
//                         </div>
//                         <div class="user-remove-contact action-danger" data-uid="${user._id}">
//                             Xóa liên hệ
//                         </div>
//                     </div>
//                 </li>`); //modal notif
//                 });
//                 removeContact();
//                 $("#link-read-more-contactts").css("display", "inline-block");
//                 $(".read-more-all-chat-loader").css("display", "none");
//             });
//         });
// });
