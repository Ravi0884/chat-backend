const Messages = require("../models/messageModel");
// ---------------------------Creating modules for getting messages from DB-------------------
module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    // ---------Getting all the users from db and sort them with time----------------
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    // ----------Applying map function on all users and getting messge from them-------------------
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};


// ------------------------Creating modules for adding messages to dataBase-----------------
module.exports.addMessage = async (req, res, next) => {

  // --------------Message will save inside "message", inside users there is information about who meaasge to whome,
  // inside sender there is information abot sender------------------------------------
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};
