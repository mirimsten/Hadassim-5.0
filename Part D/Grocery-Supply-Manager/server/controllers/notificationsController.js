const Notification = require('../models/notificationModel');

const getAllNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;       
    const limit = parseInt(req.query.limit) || 10;    
    const skip = (page - 1) * limit;

    const totalNotifications = await Notification.countDocuments();

    const notifications = await Notification.find()
      .sort({read: 1, date: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
        notifications,
        currentPage: page,
        totalPages: Math.ceil(totalNotifications / limit),
        totalNotifications,
      });
  } catch (err) {
    res.status(500).json({ message: 'שגיאה בשליפת ההודעות', error: err.message });
  }
};


const markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findById(id);
    if (!notification) return res.status(404).json({ message: 'Not found' });

    notification.read = true;
    await notification.save();

    res.status(200).json({ message: 'ההודעה סומנה כנקראה' });
  } catch (err) {
    res.status(500).json({ message: 'שגיאה בעדכון ההודעה', error: err.message });
  }
};

module.exports = {
  getAllNotifications,
  markAsRead
};
