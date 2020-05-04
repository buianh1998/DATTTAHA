import { notifycation, contact, message } from "./../services/index.service";
import { bufferBase64, lastItemOfArray, convertTimestampToHumanTime } from "./../helpers/client.heplers";
import request from "request";
let getICETurnServer = () => {
    return new Promise(async (resolve, reject) => {
        // let o = {
        //     format: "urls",
        // };

        // let bodyString = JSON.stringify(o);
        // let options = {
        //     url: "https://global.xirsys.net/_turn/H-Chat",
        //     // host: "global.xirsys.net",
        //     // path: "/_turn/H-Chat",
        //     method: "PUT",
        //     headers: {
        //         Authorization: "Basic " + Buffer.from("buitheanh:84ab0412-8dc2-11ea-9fdf-0242ac150002").toString("base64"),
        //         "Content-Type": "application/json",
        //         "Content-Length": bodyString.length,
        //     },
        // };
        // //Call a request to get ICE turn server
        // request(options, (error, response, body) => {
        //     if (error) {
        //         log("Error when get Ice error");
        //         return reject(error);
        //     }
        //     let bodyJson = JSON.parse(body);
        //     console.log(bodyJson);
        //     resolve(bodyJson.v.iceServers);
        // });
        resolve([]);
    });
};
module.exports.getHomeChat = async (req, res, next) => {
    let notifications = await notifycation.getNotifycations(req.user._id);
    //get amount notifications unread
    let countNotifiUnread = await notifycation.countNotifiUnread(req.user._id);
    //get contact  (10 item one time)
    let contacts = await contact.getContacts(req.user._id);
    //get contact sent(10 item one time)
    let contactsSent = await contact.getContactsSent(req.user._id);

    //get contact received (10 item one time)
    let contactsReceived = await contact.getContactsReceived(req.user._id);
    //countAllcontacts
    let countAllcontacts = await contact.countAllcontacts(req.user._id);
    let countAllContactsSent = await contact.countAllContactsSent(req.user._id);
    let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);
    let getAllConvensationItems = await message.getAllConvensationItems(req.user._id);
    let allConversationswithMessages = getAllConvensationItems.allConversationswithMessages;
    //get ICE list from xirsys turn server
    let getICEServerList = await getICETurnServer();
    return res.render("main/home/home", {
        errors: req.flash("errors"),
        success: req.flash("success"),
        user: req.user,
        notifications: notifications,
        countNotifiUnread: countNotifiUnread,
        contacts: contacts,
        contactsSent: contactsSent,
        contactsReceived: contactsReceived,
        countAllcontacts: countAllcontacts,
        countAllContactsSent: countAllContactsSent,
        countAllContactsReceived: countAllContactsReceived,
        allConversationswithMessages: allConversationswithMessages,
        bufferBase64: bufferBase64,
        lastItemOfArray: lastItemOfArray,
        convertTimestampToHumanTime: convertTimestampToHumanTime,
        getICEServerList: JSON.stringify(getICEServerList),
    });
};
