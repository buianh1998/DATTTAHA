import addNewContact from "./contact/addNewContact";
import removeRequestContactSent from "./contact/removeRequestContactSent";
import removeRequestContactRecieved from "./contact/removeRequestContactRecieved";
import approveRequestContactRecieved from "./contact/approveRequestContactRecieved";
import removeContact from "./contact/removeContact";
import chatTextEmoji from "./chat/chatTextMoji";
import typingOn from "./chat/typingOn";
import typingOff from "./chat/typingOff";
import chatImage from "./chat/chatImage";
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
    typingOn(io);
    typingOff(io);
    chatImage(io);
};
module.exports = initSocket;
