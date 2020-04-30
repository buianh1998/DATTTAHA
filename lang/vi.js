export const transValidation = {
    email_incorrect: "Email phải có dạng buianh@gmail.com!",
    gender_incorrect: "Gender phải có dạng nam hoặc nữ!",
    password_incorrect: "Password phải có ít nhất 8 ký tự, chữ hoa chữ thường dấu ký tự đặc biệt!",
    password_confirmation_incorrect: "password_confirmation phải giống password!",
    update_username: "Username giới hạn từ 3 tới 17 ký tự và không có ký tự đặc biệt",
    update_address: "Địa chỉ tối đa 40 ký tự",
    update_gender: "Đề nghị không chỉnh sửa dữ liệu nếu không sẽ bị khóa tài khoản",
    update_phone: "Số điện thoại Việt Nam bắt đầu bằng số 0, giới hạn từ 10 tới 11 ký tự",
    keyword_find_user: "Chỉ cho phép nhập chữ cái và số, và khoảng trống không được nhập ký tự.",
    message_text_emoji_incorrect: "Tin nhắn không hợp lệ. Ít nhất là 1 ký tự, tối đa 400 ký tự",
    add_new_group_users_incorrect: "Vui lòng chọn bạn bè vào nhóm, tối thiểu 2 người",
    add_new_group_name_incorrect: "Vui lòng nhập tên cuộc trò chuyện, giới hạn từ 5 tới 30 ký tự.",
};
export const transErr = {
    account_in_user: "Email đã tồn tại hãy sử dụng email khác",
    account_in_remove: "Tài khoản đã bị gỡ, vui lòng liên hệ lại vs bộ phận IT của H-Chat để được hỗ trợ",
    account_in_notactive: "Tài khoản chưa được kích hoạt, vui lòng vô Gmail của bạn để kích hoạt tài khoản trên",
    account_undefined: "Tài khoản không tồn tại.",
    token_undefined: "Token không tồn tại!",
    login_failed: "Sai tài khoản hoặc mật khẩu",
    server_error: "Có lỗi ở phía server, vui lòng thông báo cho H-Chat để được hỗ trợ",
    avatar_type: "Kiểu file hình ảnh không hợp lệ, chỉ chấp nhận png hoặc jpg",
    avatar_size: "Hình ảnh dung lượng được quá 1MB",
    user_current_password_failed: "Mật khẩu hiện tại không chính xác",
    conversation_not_found: "cuộc trò truyện không tồn tại",
    image_message_type: "Kiểu file hình ảnh không hợp lệ, chỉ chấp nhận png hoặc jpg",
    image_message_size: "Hình ảnh dung lượng được quá 1MB",
    file_message_size: "Tệp đính kèm dung lượng được quá 1MB",
};
export const tranSuccess = {
    userCeated: (userEmail) => {
        return `Tai khoang <strong>${userEmail}</strong> đã được tạo thành công, vui lòng vô Email kích hoạt tài khoản của H-Chat `;
    },
    account_active: "Tài khoản của bạn đã được kích hoạt, hãy đăng nhập vào H-Chat",
    loginSuccess: (user) => {
        return `Xin chào ${user}, H-Chat chúc các bạn 1 ngày tốt lành`;
    },
    logout_success: "Đăng xuất tài khoản thành công, Hẹn gặp lại bạn!",
    avatar_updated: "Cập nhật ảnh đại diện thành công.",
    user_info_updated: "Cập nhật thông tin người dùng thành công thành công.",
    user_password_updated: " Cập nhật mật khẩu thành công",
};

export const transMail = {
    subject: "H-Chat Xác nhận kích hoạt tài khoản",
    templeat: (linkVerify) => {
        return `
            <h2> Đây là Email được gửi từ H-Chat để kích hoạt tài khoản của bạn</h2>
            <h3>Vui lòng click vào đường dẫn để xác nhận kích hoạt tài khoản</h3>
            <h3><a href="${linkVerify}" target="blank">${linkVerify}</a></h3>
            <h4>Nếu cảm thấy có vấn đề gì về chúng tôi, hãy bỏ qua nó</h4>
        `;
    },
    send_failed: "Có lỗi trong quá trình gửi email, vui lòng liên hệ lại với bộ phận liên hệ của chúng tui",
};
