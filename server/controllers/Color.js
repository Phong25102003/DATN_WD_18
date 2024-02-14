const express = require('express');
const mongoose = require('mongoose');
const Color = require("../models/Color");

const routerColors = express.Router();

// Create
routerColors.post("/", async (req, res) => {
  try {
    const newCourse = await Color.create(req.body);
    return res.status(201).json(newCourse);
  } catch (error) {
    return res.status(500).json({ error: "Could not create course" });
  }
});


routerColors.get("/", async (req, res) => {
  try {
    // Kiểm tra xem tham số email có được cung cấp trong URL không
    const userEmail = req.query.email;
    if (userEmail) {
      // Nếu email được cung cấp, lọc theo email
      const courses = await Color.find({ email: userEmail });
      return res.status(200).json(courses);
    } else {
      // Nếu không có email nào được cung cấp, lấy tất cả các khóa học
      const courses = await Color.find();
      return res.status(200).json(courses);
    }
  } catch (error) {
    return res.status(500).json({ error: "Không thể lấy danh sách khóa học" });
  }
});



// Read all
routerColors.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await Color.findOne({ userId: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Không thể lấy danh sách người dùng' });
  }
});



// Read all
routerColors.get('/', async (req, res) => {
  try {
    const users = await Color.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Không thể lấy danh sách người dùng' });
  }
});


// Read by ID
routerColors.get("/:id", async (req, res) => {
  try {
    const course = await Color.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ error: "Could not retrieve course" });
  }
});



// Update
routerColors.put("/:id", async (req, res) => {
  try {
    const updatedCourse = await Color.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.status(200).json(updatedCourse);
  } catch (error) {
    return res.status(500).json({ error: "Could not update course" });
  }
});



routerColors.put("/:userID", async (req, res) => {
  try {
    const { userID } = req.params;
    const updatedUserData = req.body;

    const existingUser = await Color.findById(userID);

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await Color.findByIdAndUpdate(
      userID,
      updatedUserData,
      { new: true }
    );

    return res.status(200).json(updatedUser);
} catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Could not update user data" });
  }
});



// Delete
routerColors.delete("/:id", async (req, res) => {
  try {
    const deletedCourse = await Color.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ error: "Could not delete course" });
  }
});




routerColors.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { lock, role } = req.body;

    const updatedUser = await Color.findByIdAndUpdate(
      id,
      { $set: { lock: lock, role: role } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: "Could not update user" });
  }
});

module.exports = routerColors;