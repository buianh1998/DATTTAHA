import addNewContact from "./contact/addNewContact";
import removeRequestContactSent from "./contact/removeRequestContactSent";
import removeRequestContactRecieved from "./contact/removeRequestContactRecieved";
import approveRequestContactRecieved from "./contact/approveRequestContactRecieved";
import removeContact from "./contact/removeContact";
/**
 * @param io form socket.io
 */
let initSocket = (io) => {
    addNewContact(io);
    removeRequestContactSent(io);
    removeRequestContactRecieved(io);
    approveRequestContactRecieved(io);
    removeContact(io);
};
module.exports = initSocket;
