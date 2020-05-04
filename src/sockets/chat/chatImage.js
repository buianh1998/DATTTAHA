/**
 *
 * @param  io from socket.io lib
 */
import { pushSocketIdToArray, emitNotyfyToArray, removeSocketIdFromArray } from "../../helpers/socket.helper";
let chatImage = (io) => {
    let clients = {};
    io.on("connection", (socket) => {
        // client ở đây là 1 object chứa id của người dùng tương ứng với 1 mảng id socket
        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
        socket.request.user.chatGroupIds.forEach((group) => {
            clients = pushSocketIdToArray(clients, group._id, socket.id);
        });
        // When has new group chat
        socket.on("new-group-created", (data) => {
            clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);
        });
        socket.on("member-received-group-chat", (data) => {
            clients = pushSocketIdToArray(clients, data.groupChatId, socket.id);
        });
        socket.on("chat-image", (data) => {
            if (data.groupId) {
                let response = {
                    currentGroupId: data.groupId,
                    currentUserId: socket.request.user._id,
                    message: data.message,
                };
                if (clients[data.groupId]) {
                    emitNotyfyToArray(clients, data.groupId, io, "response-chat-image", response);
                }
            }
            if (data.contactId) {
                let response = {
                    currentUserId: socket.request.user._id,
                    message: data.message,
                };
                if (clients[data.contactId]) {
                    emitNotyfyToArray(clients, data.contactId, io, "response-chat-image", response);
                }
            }
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
module.exports = chatImage;
