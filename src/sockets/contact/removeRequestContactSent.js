import { pushSocketIdToArray, emitNotyfyToArray, removeSocketIdFromArray } from "../../helpers/socket.helper";

/**
 *
 * @param  io from socket.io lib
 */
let removeRequestContactSent = io => {
    let clients = {};

    io.on("connection", socket => {
        // client ở đây là 1 object chứa id của người dùng tương ứng với 1 mảng id socket
        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

        socket.on("remove-request-contact-sent", data => {
            // console.log(data);
            // console.log(socket.request.user);

            let currentUser = {
                id: socket.request.user._id
            };
            // sự kiện nếu thằng contactId ở đây là thằng được kết bạn mình sẽ gửi cho nó 1 cái thông báo rằng nó được yêu cầu kết bạn từ socket id
            if (clients[data.contactId]) {
                emitNotyfyToArray(clients, data.contactId, io, "response-remove-request-contact-sent", currentUser);
            }
        });
        socket.on("disconnect", () => {
            // trả ra mảng mới với cái socket.id khác cái socketid đã disconnect
            clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
        });
    });
};
module.exports = removeRequestContactSent;
