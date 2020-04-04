export let pushSocketIdToArray = (clients, userId, socketId) => {
    // client ở đây là 1 object chứa id của người dùng tương ứng với 1 mảng id socket
    if (clients[userId]) {
        clients[userId].push(socketId);
    } else {
        clients[userId] = [socketId];
    }
    return clients;
};
export let emitNotyfyToArray = (clients, userId, io, eventName, data) => {
    clients[userId].forEach(socketId => io.sockets.connected[socketId].emit(eventName, data));
};
export let removeSocketIdFromArray = (clients, userId, socket) => {
    clients[userId] = clients[userId].filter(socketId => socketId !== socket.id);
    if (!clients[userId].length) {
        delete clients[userId];
    }
    return clients;
};
