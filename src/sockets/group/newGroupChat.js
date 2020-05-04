/**
 *
 * @param  io from socket.io lib
 */
import { pushSocketIdToArray, emitNotyfyToArray, removeSocketIdFromArray } from "../../helpers/socket.helper";
let newGroupChat = (io) => {
    let clients = {};
    io.on("connection", (socket) => {
        // client ở đây là 1 object chứa id của người dùng tương ứng với 1 mảng id socket
        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
        socket.request.user.chatGroupIds.forEach((group) => {
            clients = pushSocketIdToArray(clients, group._id, socket.id);
        });
        socket.on("new-group-created", (data) => {
            clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);
            let response = {
                groupChat: data.groupChat,
            };
            data.groupChat.menbers.forEach((menber) => {
                if (clients[menber.userId] && menber.userId != socket.request.user._id) {
                    emitNotyfyToArray(clients, menber.userId, io, "response-new-group-created", response);
                }
            });
        });
        socket.on("member-received-group-chat", (data) => {
            clients = pushSocketIdToArray(clients, data.groupChatId, socket.id);
        });
        socket.on("disconnect", () => {
            // trả ra mảng mới với cái socket.id khác cái socketid đã disconnect
            clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
            socket.request.user.chatGroupIds.forEach((group) => {
                clients = removeSocketIdFromArray(clients, group._id, socket);
            });
        });
    });
};
module.exports = newGroupChat;
