/**
 *
 * @param  io from socket.io lib
 */
import { pushSocketIdToArray, emitNotyfyToArray, removeSocketIdFromArray } from "../../helpers/socket.helper";
let userOnlineOffline = (io) => {
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
        socket.on("check-status", () => {
            let listUserOnline = Object.keys(clients);
            //Step 01: Emit to user after login or f5 web page
            socket.emit("server-send-list-user-online", listUserOnline);
            //Step 02: Emit to all another users when has new user online
            socket.broadcast.emit("server-send-when-new-user-online", socket.request.user._id);
        });

        socket.on("disconnect", () => {
            // trả ra mảng mới với cái socket.id khác cái socketid đã disconnect
            clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
            socket.request.user.chatGroupIds.forEach((group) => {
                clients = removeSocketIdFromArray(clients, group._id, socket);
            });
            // Step 03: Emit to all another users when has new user offline
            socket.broadcast.emit("server-send-when-new-user-offline", socket.request.user._id);
        });
    });
};
module.exports = userOnlineOffline;
