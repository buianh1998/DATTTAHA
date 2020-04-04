let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};
let userUpdatePassword = {};
function callLogout() {
    let timerInterval;
    Swal.fire({
        position: "top-end",
        title: "Tự động đăng xuất sau 5 giây",
        html: "Thời gian: <strong></strong>",
        timer: 5000,
        onBeforeOpen: () => {
            Swal.showLoading();
            timerInterval = setInterval(() => {
                Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
            }, 1000);
        },
        onClose: () => {
            clearInterval(timerInterval);
        }
    }).then(result => {
        $.get("/logout", function() {
            location.reload();
        });
    });
}
function updateUserInfo() {
    $("#input-change-avatar").bind("change", function() {
        let fileData = $(this).prop("files")[0];
        let math = ["image/png", "image/jpg", "image/jpeg"];
        let limit = 1048576; //byte = 1 mb
        if ($.inArray(fileData.type, math) === -1) {
            alertify.notify("Kiểu file không hợp lệ, chỉ có thể là png hoặc jpg hoặc jpeg ", "error", 7);
            $(this).val(null);
            return false;
        }
        if (fileData.size > limit) {
            alertify.notify("Ảnh upload tối đa 1mb ", "error", 7);
            $(this).val(null);
            return false;
        }

        if (typeof FileReader != "undefined") {
            let imagePrevew = $("#image-edit-profile");
            imagePrevew.empty();

            let fileReader = new FileReader();
            fileReader.onload = function(element) {
                $("<img>", {
                    src: element.target.result,
                    class: "avatar img-circle",
                    id: "user-modal-avatar",
                    alt: "avatar"
                }).appendTo(imagePrevew);
            };
            imagePrevew.show();
            fileReader.readAsDataURL(fileData);
            let formData = new FormData();
            formData.append("avatar", fileData);
            userAvatar = formData;
        } else {
            alertify.notify("Trình duyệt của bạn không hỗ trợ file FileReader", "error", 7);
        }
    });
    $("#input-change-username").bind("change", function() {
        let username = $(this).val();
        let regexUsername = new RegExp(
            /^[s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
        );
        if (!regexUsername.test(username) || username.length < 3 || username.length > 18) {
            alertify.notify("Username giới hạn từ 3 tới 17 ký tự và không có ký tự đặc biệt", "error");
            $(this).val(originUserInfo.username);
            delete userInfo.username;
            return false;
        }
        userInfo.username = $(this).val();
    });
    $("#input-change-gender-male").bind("click", function() {
        let gender = $(this).val();
        if (gender !== "male") {
            alertify.notify("Đề nghị không chỉnh sửa dữ liệu nếu không sẽ bị khóa tài khoản", "error");
            $(this).val(originUserInfo.gender);
            delete userInfo.gender;
            return false;
        }
        userInfo.gender = gender;
    });
    $("#input-change-gender-female").bind("click", function() {
        let gender = $(this).val();
        if (gender !== "female") {
            alertify.notify("Đề nghị không chỉnh sửa dữ liệu nếu không sẽ bị khóa tài khoản", "error");
            $(this).val(originUserInfo.gender);
            delete userInfo.gender;
            return false;
        }
        userInfo.gender = gender;
    });
    $("#input-change-address").bind("change", function() {
        let address = $(this).val();
        if (address.length < 3 || address.length > 40) {
            alertify.notify("Địa chỉ tối đa 40 ký tự", "error");
            $(this).val(originUserInfo.gender);
            delete userInfo.address;
            return false;
        }
        userInfo.address = address;
    });
    $("#input-change-phone").bind("change", function() {
        let phone = $(this).val();
        let regexPhone = new RegExp(/^(0)[0-9]{9,10}$/);
        if (!regexPhone.test(phone)) {
            alertify.notify("Số điện thoại Việt Nam bắt đầu bằng số 0, giới hạn từ 10 tới 11 ký tự", "error");
            $(this).val(originUserInfo.phone);
            delete userInfo.phone;
            return false;
        }
        userInfo.phone = phone;
    });
    $("#input-change-current-password").bind("change", function() {
        let curentPassword = $(this).val();
        let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);
        if (!regexPassword.test(curentPassword)) {
            alertify.notify("Password phải có ít nhất 8 ký tự, chữ hoa chữ thường dấu ký tự đặc biệt!", "error");
            $(this).val(null);
            delete userUpdatePassword.curentPassword;
            return false;
        }
        userUpdatePassword.curentPassword = curentPassword;
    });
    $("#input-change-new-password").bind("change", function() {
        let newPassword = $(this).val();
        let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);
        if (!regexPassword.test(newPassword)) {
            alertify.notify("Password phải có ít nhất 8 ký tự, chữ hoa chữ thường dấu ký tự đặc biệt!", "error");
            $(this).val(null);
            delete userUpdatePassword.newPassword;
            return false;
        }
        userUpdatePassword.newPassword = newPassword;
    });
    $("#input-change-confirm-new-password").bind("change", function() {
        let confirmnewPassword = $(this).val();
        if (!userUpdatePassword.newPassword) {
            alertify.notify("Bạn chưa nhập mật khẩu mới", "error", 7);
            $(this).val(null);
            delete userUpdatePassword.confirmnewPassword;
            return false;
        }
        if (confirmnewPassword !== userUpdatePassword.newPassword) {
            alertify.notify("Mật khẩu nhập lại chưa chính xác", "error", 7);
            $(this).val(null);
            delete userUpdatePassword.confirmnewPassword;
            return false;
        }
        userUpdatePassword.confirmnewPassword = confirmnewPassword;
    });
}
function callUpdateAvatar() {
    $.ajax({
        url: "/user/update-avatar",
        type: "put",
        cache: false,
        contentType: false,
        processData: false,
        data: userAvatar,
        success: function(result) {
            //display success
            $(".user-model-aleat-success")
                .find("span")
                .text(result.message);
            $(".user-model-aleat-success").css("display", "block");
            // update avatar navbar
            $("#navbar-avatar").attr("src", result.imageSrc);
            //update origin avarta Src
            originAvatarSrc = result.imageSrc;

            $("#input-btn-cancel-update-user").click();
        },
        error: function(error) {
            $(".user-model-aleat-error")
                .find("span")
                .text(error.responseText);
            $(".user-model-aleat-error").css("display", "block");
            $("#input-btn-cancel-update-user").click();
        }
    });
}
function callUpdateUserInfo() {
    $.ajax({
        url: "/user/update-infouser",
        type: "put",
        data: userInfo,
        success: function(result) {
            //display success
            $(".user-model-aleat-success")
                .find("span")
                .text(result.message);
            $(".user-model-aleat-success").css("display", "block");
            // update username info

            originUserInfo = Object.assign(originUserInfo, userInfo);
            // thay vi if else thì có thể sài Onject.assign
            // nó sẽ thay toàn bộ dữ liệu của userInfo vô originUserInfo nếu 2 thằng Object này cùng key username, phone, adress, gender
            //update username navbar
            $("#navbar-username").text(originUserInfo.username);
            $("#input-btn-cancel-update-user").click();
        },
        error: function(error) {
            $(".user-model-aleat-error")
                .find("span")
                .text(error.responseText);
            $(".user-model-aleat-error").css("display", "block");
            $("#input-btn-cancel-update-user").click();
        }
    });
}
function callUpdateUserPassword() {
    $.ajax({
        url: "/user/update-password",
        type: "put",
        data: userUpdatePassword,
        success: function(result) {
            //display success
            $(".user-model-password-aleat-success")
                .find("span")
                .text(result.message);
            $(".user-model-password-aleat-success").css("display", "block");
            // update username info

            $("#input-btn-cancel-update-user-password").click();
            callLogout();
        },
        error: function(error) {
            $(".user-model-password-aleat-error")
                .find("span")
                .text(error.responseText);
            $(".user-model-password-aleat-error").css("display", "block");
            $("#input-btn-cancel-update-user").click();
        }
    });
}
$(document).ready(function() {
    originAvatarSrc = $("#user-modal-avatar").attr("src");
    originUserInfo = {
        username: $("#input-change-username").val(),
        gender: $("#input-change-gender-male").is(":checked")
            ? $("#input-change-gender-male").val()
            : $("#input-change-gender-female").val(),
        address: $("#input-change-address").val(),
        phone: $("#input-change-phone").val()
    };
    updateUserInfo();

    $("#input-btn-update-user").bind("click", function() {
        if ($.isEmptyObject(userInfo) && !userAvatar) {
            alertify.notify("Bạn phải thay đổi thông tin trước khi cập nhật tài khoản ", "error", 7);
            return false;
        }
        if (userAvatar) {
            callUpdateAvatar();
        }
        if (!$.isEmptyObject(userInfo)) {
            callUpdateUserInfo();
        }
    });
    $("#input-btn-cancel-update-user").bind("click", function() {
        userInfo = {};
        userAvatar = null;
        $("#input-change-avatar").val(null);
        $("#user-modal-avatar").attr("src", originAvatarSrc);
        $("#input-change-username").val(originUserInfo.username);
        originUserInfo.gender === "male" ? $("#input-change-gender-male").click() : $("#input-change-gender-demale").click();
        $("#input-change-address").val(originUserInfo.address);
        $("#input-change-phone").val(originUserInfo.phone);
    });
    $("#input-btn-update-user-password").bind("click", function() {
        if (!userUpdatePassword.curentPassword || !userUpdatePassword.newPassword || !userUpdatePassword.confirmnewPassword) {
            alertify.notify("Bạn phải thay đổi đầy đủ thông tin trước khi cập nhật mật khẩu ", "error", 7);
            return false;
        }
        Swal.fire({
            title: "Bạn có chắc chắn muốn thay đổi mật khẩu?",
            text: "Bạn không thể hoàn tác lại quá trình này!",
            icon: "Info",
            showCancelButton: true,
            confirmButtonColor: "#2ECC71",
            cancelButtonColor: "#ff7675",
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Hủy"
        }).then(result => {
            if (!result.value) {
                $("#input-btn-cancel-update-user-password").click();
                return false;
            }
            callUpdateUserPassword();
        });
    });
    $("#input-btn-cancel-update-user-password").bind("click", function() {
        userUpdatePassword = {};
        $("#input-change-current-password").val(null);
        $("#input-change-new-password").val(null);
        $("#input-change-confirm-new-password").val(null);
    });
});
