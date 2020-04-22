function textAndEmojiChat(divId) {
    $(".emojionearea")
        .unbind("keyup")
        .bind("keyup", function (element) {
            let currentEmojoneArea = $(this);
            if (element.which === 13) {
                let targetId = $(`#write-chat-${divId}`).data("chat");
                let messageVal = $(`#write-chat-${divId}`).val();
                if (!targetId.length || !messageVal.length) {
                    return false;
                }
                let dataTextEmoijiForSend = {
                    uid: targetId,
                    messageVal: messageVal,
                };
                if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
                    dataTextEmoijiForSend.isChatGroup = true;
                }
                $.post("/message/add-new-text-emoji", dataTextEmoijiForSend, function (data) {
                    ///success4
                    let dataToEmit = {
                        message: data.message,
                    };
                    let messageOfMe = $(`
                    <div class="bubble me" data-mess-id="${data.message._id}">
                    </div>
                    `);
                    messageOfMe.text(data.message.text);
                    let converEmojiMessage = messageOfMe.html();

                    if (dataTextEmoijiForSend.isChatGroup) {
                        let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`;
                        messageOfMe.html(`${senderAvatar}${converEmojiMessage}`);
                        dataToEmit.groupId = targetId;
                        increaseNumberMessageGroup(divId);
                    } else {
                        dataToEmit.contactId = targetId;
                    }
                    $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
                    nineScrollRight(divId);
                    //remove all data input
                    $(`#write-chat-${divId}`).val("");
                    currentEmojoneArea.find(".emojionearea-editor").text("");
                    //Change data preview  & time in leftsite
                    $(`.person[data-chat=${divId}]`)
                        .find("span.time")
                        .removeClass("color")
                        .html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
                    $(`.person[data-chat=${divId}]`).find("span.preview").html(data.message.text);
                    $(`.person[data-chat=${divId}]`).on("chatOn.moveConversationToTheTop", function () {
                        let dataToMove = $(this).parent();
                        $(this).closest("ul").prepend(dataToMove);
                        $(this).off("chatOn.moveConversationToTheTop");
                    });
                    $(`.person[data-chat=${divId}]`).trigger("chatOn.moveConversationToTheTop");

                    socket.emit("chat-text-emoji", dataToEmit);
                    //Emit remove typing real-time
                    typingOff(divId);
                    // if this has typing, remove chat immediate
                    let checkTyping = $(`.chat[data-chat = ${divId}]`).find("div.bubble-typing-gif");
                    if (checkTyping.length) {
                        checkTyping.remove();
                    }
                }).fail(function (response) {
                    alertify.notify(response.responseText, "error", 7);
                });
            }
        });
}

$(document).ready(function () {
    socket.on("response-chat-text-emoji", function (response) {
        console.log(response.currentGroupId);
        let divId = "";
        let messageOfYou = $(`
        <div class="bubble you" data-mess-id="${response.message._id}">
        </div>
        `);
        messageOfYou.text(response.message.text);
        let converEmojiMessage = messageOfYou.html();
        if (response.currentGroupId) {
            let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`;
            messageOfYou.html(`${senderAvatar}${converEmojiMessage}`);

            divId = response.currentGroupId;
            if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
                increaseNumberMessageGroup(divId);
            }
        } else {
            divId = response.currentUserId;
        }
        if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
            $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
            nineScrollRight(divId);
            $(`.person[data-chat=${divId}]`).find("span.time").addClass("color");
        }
        $(`.person[data-chat=${divId}]`)
            .find("span.time")
            .html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html(response.message.text);
        $(`.person[data-chat=${divId}]`).on("chatOn.moveConversationToTheTop", function () {
            let dataToMove = $(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off("chatOn.moveConversationToTheTop");
        });
        $(`.person[data-chat=${divId}]`).trigger("chatOn.moveConversationToTheTop");
    });
});
