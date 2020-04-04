import { notifycation } from "./../services/index.service";
module.exports.readMore = async (req, res) => {
    try {
        //get skip Number from query param
        let skipNumberNotification = +req.query.skipNumber;
        let newNotification = await notifycation.readMore(req.user._id, skipNumberNotification);
        //get more Item
        return res.status(200).send(newNotification);
    } catch (error) {
        return res.status(500).send(error);
    }
};

module.exports.markAllAsRead = async (req, res) => {
    try {
        let mark = await notifycation.markAllAsRead(req.user._id, req.body.targetUsers);
        return res.status(200).send(mark);
    } catch (error) {
        return res.status(500).send(error);
    }
};
