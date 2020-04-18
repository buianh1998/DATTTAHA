import addNewContact from "./contact/addNewContact";
import removeRequestContactSent from "./contact/removeRequestContactSent";
import removeRequestContactRecieved from "./contact/removeRequestContactRecieved";
import approveRequestContactRecieved from "./contact/approveRequestContactRecieved";
import removeContact from "./contact/removeContact";
import chatTextEmoji from "./chat/chatTextMoji";
/**
 * @param io form socket.io
 */
let initSocket = (io) => {
    addNewContact(io);
    removeRequestContactSent(io);
    removeRequestContactRecieved(io);
    approveRequestContactRecieved(io);
    removeContact(io);
    chatTextEmoji(io);
};
module.exports = initSocket;
