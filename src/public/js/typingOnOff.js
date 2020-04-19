function typingOn(divId) {
    let tagerId = $(`#write-chat-${divId}`).data("chat");
    if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
        socket.emit("user-is-typing", { groupId: tagerId });
    } else {
        socket.emit("user-is-typing", { contactId: tagerId });
    }
}
function typingOff(divId) {
    let tagerId = $(`#write-chat-${divId}`).data("chat");
    if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
        socket.emit("user-is-not-typing", { groupId: tagerId });
    } else {
        socket.emit("user-is-not-typing", { contactId: tagerId });
    }
}

$(document).ready(function () {
    //Listen typing On
    socket.on("response-user-is-typing", function (response) {
        let messageTyping = `<div class="bubble you bubble-typing-gif">
            <img src="/images/chat/typing.gif">
        </div>`;

        if (response.currentGroupId) {
            if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
                console.log(messageTyping);

                let checkTyping = $(`.chat[data-chat = ${response.currentUserId}]`).find("div.bubble-typing-gif");
                if (checkTyping.length) {
                    return false;
                }
                $(`.chat[data-chat = ${response.currentGroupId}]`).append(messageTyping);
                nineScrollRight(response.currentGroupId);
            }
        } else {
            let checkTyping = $(`.chat[data-chat = ${response.currentUserId}]`).find("div.bubble-typing-gif");
            if (checkTyping.length) {
                return false;
            }
            $(`.chat[data-chat = ${response.currentUserId}]`).append(messageTyping);
            nineScrollRight(response.currentUserId);
        }
    });
    socket.on("response-user-is-not-typing", function (response) {
        if (response.currentGroupId) {
            if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
                $(`.chat[data-chat = ${response.currentGroupId}]`).find("div.bubble-typing-gif").remove();
                nineScrollRight(response.currentGroupId);
            }
        } else {
            $(`.chat[data-chat = ${response.currentUserId}]`).find("div.bubble-typing-gif").remove();
            nineScrollRight(response.currentUserId);
        }
    });
});
