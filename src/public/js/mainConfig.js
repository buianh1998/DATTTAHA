/**
 * Created by https://trungquandev.com's author on 25/02/2018.
 */
const socket = io(); // biến toàn cục

function nineScrollLeft() {
    $(".left").niceScroll({
        smoothscroll: true,
        horizrailenabled: false,
        cursorcolor: "#ECECEC",
        cursorwidth: "7px",
        scrollspeed: 50,
    });
}
function resizeNiceScrollLeft() {
    $(".left").getNiceScroll().resize();
}
function nineScrollRight(divId) {
    $(`.right .chat[data-chat = ${divId}]`).niceScroll({
        smoothscroll: true,
        horizrailenabled: false,
        cursorcolor: "#ECECEC",
        cursorwidth: "7px",
        scrollspeed: 50,
    });
    $(`.right .chat[data-chat = ${divId}]`).scrollTop($(`.right .chat[data-chat = ${divId}]`)[0].scrollHeight);
}

function enableEmojioneArea(divId) {
    $(`#write-chat-${divId}`).emojioneArea({
        standalone: false,
        pickerPosition: "top",
        filtersPosition: "bottom",
        tones: false,
        autocomplete: false,
        inline: true,
        hidePickerOnBlur: true,
        search: false,
        shortnames: false,
        events: {
            keyup: function (editor, event) {
                // gán giá trị thay đổi vào thẻ input đã bi ẩn
                $(`#write-chat-${divId}`).val(this.getText());
            },
            click: function () {
                //Bật lắng nghe dom cho việc chat văn bản + emoji
                textAndEmojiChat(divId);
                typingOn(divId);
            },
            blur: function () {
                typingOff(divId);
            },
        },
    });
    $(".icon-chat").bind("click", function (event) {
        event.preventDefault();
        $(".emojionearea-button").click();
        $(".emojionearea-editor").focus();
    });
}

function spinLoaded() {
    $(".mastet-loader").css("display", "none");
}

function spinLoading() {
    $(".mastet-loader").css("display", "block");
}

function ajaxLoading() {
    $(document)
        .ajaxStart(function () {
            spinLoading();
        })
        .ajaxStop(function () {
            spinLoaded();
        });
}

function showModalContacts() {
    $("#show-modal-contacts").click(function () {
        $(this).find(".noti_contact_counter").fadeOut("slow");
    });
}

function configNotification() {
    $("#noti_Button").click(function () {
        $("#notifications").fadeToggle("fast", "linear");
        $(".noti_counter").fadeOut("slow");
        return false;
    });
    $(".main-content").click(function () {
        $("#notifications").fadeOut("fast", "linear");
    });
}

function gridPhotos(layoutNumber) {
    $(".show-images")
        .unbind("click")
        .on("click", function () {
            let href = $(this).attr("href");
            let modalImageId = href.replace("#", "");
            let originDataImage = $(`#${modalImageId}`).find("div.modal-body").html();
            let countRows = Math.ceil($(`#${modalImageId}`).find("div.all-images>img").length / layoutNumber);
            let layoutStr = new Array(countRows).fill(layoutNumber).join("");
            $(`#${modalImageId}`)
                .find("div.all-images")
                .photosetGrid({
                    highresLinks: true,
                    rel: "withhearts-gallery",
                    gutter: "2px",
                    layout: layoutStr,
                    onComplete: function () {
                        $(`#${modalImageId}`).find(".all-images").css({
                            visibility: "visible",
                        });
                        $(`#${modalImageId}`).find(".all-images a").colorbox({
                            photo: true,
                            scalePhotos: true,
                            maxHeight: "90%",
                            maxWidth: "90%",
                        });
                    },
                });
            //Bắt sự kiện đóng modal
            $(`#${modalImageId}`).on("hidden.bs.modal", function () {
                $(this).find("div.modal-body").html(originDataImage);
            });
        });
}

// function showButtonGroupChat() {
//     $("#select-type-chat").bind("change", function () {
//         if ($(this).val() === "group-chat") {
//             $(".create-group-chat").show();
//             // Do something...
//         } else {
//             $(".create-group-chat").hide();
//         }
//     });
// }

function flashMasterNotify() {
    let notify = $(".master-success-message").text();
    if (notify.length) {
        alertify.notify(notify, "success", 7);
    }
}
function changeTypeChat() {
    $("#select-type-chat").bind("change", function () {
        let optionSelected = $("option:selected", this);
        optionSelected.tab("show");

        if ($(this).val() === "user-chat") {
            $(".create-group-chat").hide();
        } else {
            $(".create-group-chat").show();
        }
    });
}
function changeScreenChat() {
    $(".room-chat")
        .unbind("click")
        .bind("click", function () {
            let divId = $(this).find("li").data("chat");

            $(".person").removeClass("active");
            $(`.person[data-chat = ${divId}]`).addClass("active");
            $(this).tab("show");
            // Config thanh cuộn bên box chat right bên rigthside.ejs
            nineScrollRight(divId);

            // Bật emoji, tham số truyền vào là id của box nhập nội dung tin nhắn
            enableEmojioneArea(divId);
            // Bật lắng nghe dom cho việc chat tin nhắn hình ảnh
            imageChat(divId);
            // Bật lắng nghe dom cho việc chat tệp file
            attachmentChat(divId);
            // Bật video Chat
            videoChat(divId);
        });
}
function bufferToBase64(buffer) {
    return btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ""));
}
$(document).ready(function () {
    // Hide số thông báo trên đầu icon mở modal contact
    showModalContacts();

    // Bật tắt popup notification
    configNotification();

    // Cấu hình thanh cuộn bên trái
    nineScrollLeft();

    // Icon loading khi chạy ajax
    ajaxLoading();

    // Hiển thị button mở modal tạo nhóm trò chuyện
    // showButtonGroupChat();

    // Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
    // Tham số chỉ được phép trong khoảng từ 1 đến 5
    gridPhotos(5);

    // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện

    // Flash message ở màn hình master
    flashMasterNotify();

    // Thay đổi kiểu trò truyện
    changeTypeChat();
    //Chuyển màn hình chat
    changeScreenChat();
    $("ul.people").find("a")[0].click();
    $("#video-chat-group").bind("click", function () {
        alertify.notify("Không khả dụng tính năng này với nhóm trò chuyện, chỉ có thể sử dụng với trò truyện cá nhân", "error", 7);
    });
});
