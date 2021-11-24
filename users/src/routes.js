const express = require("express");
const passport = require("passport");
const multer = require("multer");
const sharp = require("sharp");
const authToken = require("./auth/token");
const User = require("./model/user");

require("./auth/local");

const upload = multer({
  limits: {
    fileSize: 20000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Only images can be used as avatar"));
    }

    cb(undefined, true);
  },
});

const router = new express.Router();

router.get("/users/home", authToken, (req, res) => {
  res.send("home");
});

router.post("/users/register", async (req, res) => {
  try {
    const userData = req.body;
    const user = new User(userData);
    const sameMail = await User.findOne({ email: req.body.email });

    if (sameMail) {
      throw new Error("That e-mail is already registered");
    }
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    const strError = e.toString();
    res.status(400).send(strError);
  }
});

router.post("/users/login", passport.authenticate("local", { session: false }), async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send("Incorrect user or password");
  }
});

router.post("/users/logout", authToken, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});
router.post("/users/logoutAll", authToken, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/addContactNoConf", authToken, async (req, res) => {
  try {
    const loggedId = req.body.logged;
    const { searched } = req.body;
    const user = await User.findOne({ _id: loggedId });
    const { contacts } = user;

    const alreadyAddedList = contacts.filter((u) => u._id === searched._id);
    const alreadyAdded = alreadyAddedList.length > 0;
    if (alreadyAdded) {
      res.status(403);
      throw new Error("The user is already added");
    }

    searched.status = "pending";
    contacts.push(searched);
    user.contacts = contacts;
    await user.save();

    const searchedUser = await User.findOne({ _id: searched._id });
    const searchedContacts = searchedUser.contacts;
    const requester = {
      userName: user.userName,
      _id: user._id.toString(),
      email: user.email,
      newMsgs: false,
      status: "request",
    };
    searchedContacts.push(requester);
    searchedUser.contacts = searchedContacts;
    await searchedUser.save();

    res.send(user);
  } catch (error) {
    console.error(error.toString());
    res.send(error.toString());
  }
});

router.patch("/users/confirmAdding", authToken, async (req, res) => {
  try {
    const { participants } = req.body;

    const acceptedUser = await User.findById(participants[0]);
    const contactsOne = acceptedUser.contacts;
    contactsOne.map((c) => {
      if (c._id === participants[1]) {
        c.status = "accepted";
        c.newMsgs = true;
      }
      return c;
    });
    acceptedUser.contacts = contactsOne;
    acceptedUser.markModified("contacts");
    await acceptedUser.save();

    const acceptingUser = await User.findById(participants[1]);
    const contactsTwo = acceptingUser.contacts;
    contactsTwo.map((c) => {
      if (c._id === participants[0]) {
        c.status = "accepted";
        c.newMsgs = true;
      }
      return c;
    });
    acceptingUser.contacts = contactsTwo;
    acceptingUser.markModified("contacts");
    await acceptingUser.save();
    res.send();
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

router.get("/users/getUser", authToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email });

    if (!user) {
      throw new Error("No user was found");
    }

    if (req.query.selfUser) {
      res.send(user);
    } else {
      const userInfo = {
        userName: user.userName,
        _id: user._id,
        email: req.query.email,
      };
      res.send(userInfo);
    }
  } catch (e) {
    const strError = e.toString();
    res.status(404).send(strError);
  }
});

router.post("/users/changeLanguage", authToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    user.language = req.body.language;
    await user.save();
    res.send();
  } catch (e) {
    const strError = e.toString();
    console.error(strError);
    res.status(404).send(strError);
  }
});

router.post("/users/updateUser", async (req, res) => {
  try {
    const { receiver } = req.body.params;
    const user = await User.findById(receiver._id);
    if (receiver.individualRoom) {
      const { contacts } = user;
      contacts.forEach((c) => {
        if (c._id === req.body.params.senderId) {
          c.newMsgs = req.body.params.newStatus;
        }
      });
      user.contacts = contacts;
      user.markModified("contacts");
    } else { // It comes from group room.
      const { conversations } = user;
      conversations.forEach((c) => {
        if (c.roomId === req.body.params.roomId) {
          c.newMsgs = req.body.params.newStatus;
        }
      });
      user.conversations = conversations;
      user.markModified("conversations");
    }

    await user.save();
    res.send();
  } catch (e) {
    const strError = e.toString();
    console.error(strError);
    res.status(404).send(strError);
  }
});

router.post("/users/newRoom", authToken, async (req, res) => {
  try {
    const { participants } = req.body;
    participants.forEach(async (p) => {
      const user = await User.findById(p._id);
      let conversations;
      if (!user.conversations) {
        conversations = [];
      } else {
        conversations = user.conversations;
      }

      const conversationsIds = conversations.map((c) => c.roomId);
      if (!conversationsIds.includes(req.body.roomId)) {
        conversations.push(req.body);
        user.conversations = conversations;
      }
      await user.save();
    });
    res.send();
  } catch (error) {
    const strError = error.toString();
    console.error(strError);
    res.status(404).send(strError);
  }
});

router.post("/users/avatar", authToken, upload.single("avatar"), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
  req.user.avatar = buffer;
  req.user.hasAvatar = true;
  await req.user.save();
  res.send(req.user);
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message });
});

router.post("/users/avatar/check", upload.single("avatar"), async (req, res) => {
  res.send(true);
}, (error, req, res, next) => {
  error.toString();
  res.status(400).send(error.toString());
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = router;
