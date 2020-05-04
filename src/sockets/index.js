import addNewContact from "./contact/addNewContact";
import removeRequestContactSent from "./contact/removeRequestContactSent";
import removeRequestContactRecieved from "./contact/removeRequestContactRecieved";
import approveRequestContactRecieved from "./contact/approveRequestContactRecieved";
import removeContact from "./contact/removeContact";
import chatTextEmoji from "./chat/chatTextMoji";
import typingOn from "./chat/typingOn";
import typingOff from "./chat/typingOff";
import chatImage from "./chat/chatImage";
import chatAttachment from "./chat/chatAttachment";
import chatVideo from "./chat/chatVideo";
import userOnlineOffline from "./status/userOnlineOffline";
import newGroupChat from "./group/newGroupChat";
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
    chatAttachment(io);
    chatVideo(io);
    userOnlineOffline(io);
    newGroupChat(io);
};
module.exports = initSocket;
