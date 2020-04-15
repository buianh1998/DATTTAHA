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
                    let messageOfMe = $(`
                    <div class="bubble me" data-mess-id="${data.message._id}">
                    </div>
                    `);
                    if (dataTextEmoijiForSend.isChatGroup) {
                        messageOfMe.html(
                            `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`
                        );
                        messageOfMe.text(data.message.text);
                        increaseNumberMessageGroup(divId);
                    } else {
                        messageOfMe.text(data.message.text);
                        increaseNumberMessageGroup(divId);
                    }
                    $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
                    nineScrollRight(divId);
                    //remove all data input
                    $(`#write-chat-${divId}`).val("");
                    currentEmojoneArea.find(".emojionearea-editor").text("");
                    //Change data preview  & time in leftsite
                    $(`.person[data-chat=${divId}]`)
                        .find("span.time")
                        .html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
                    $(`.person[data-chat=${divId}]`).find("span.preview").html(data.message.text);
                    $(`.person[data-chat=${divId}]`).on("click.moveConversationToTheTop", function () {
                        let dataToMove = $(this).parent();
                        $(this).closest("ul").prepend(dataToMove);
                        $(this).off("click.moveConversationToTheTop");
                    });
                    $(`.person[data-chat=${divId}]`).click();
                    //emit readltime
                }).fail(function (response) {
                    console.log(response);
                    alertify.notify(response.responseText, "error", 7);
                });
            }
        });
}
