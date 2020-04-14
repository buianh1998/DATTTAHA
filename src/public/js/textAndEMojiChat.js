function textAndEmojiChat(divId) {
    $(".emojionearea")
        .unbind("keyup")
        .bind("keyup", function (element) {
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
                    console.log(data.message);
                }).fail(function (response) {
                    console.log(response);

                    alertify.notify(response.responseText, "error", 7);
                });
            }
        });
}
