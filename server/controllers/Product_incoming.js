const express = require('express');
const Product_incoming = require('../models/Product_incoming');
const routerProduct_incomings = express.Router();

routerProduct_incomings.post('/', async (req, res) => {
  try {
    const { courseId, title, options, correctAnswerIndex } = req.body;

    const newProduct_incoming = new Product_incoming({
      courseId,
      title,
      options, // Đảm bảo model Product_incoming của bạn có trường options để lưu mảng các lựa chọn
      correctAnswerIndex,
    });

    await newProduct_incoming.save();

    res.json({ message: 'Product_incoming created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


routerProduct_incomings.get('/', async (req, res) => {
  try {
    const { courseId } = req.query;

    if (courseId) {
      // If courseId is provided, filter Product_incomings based on courseId
      const Product_incomings = await Product_incoming.find({ courseId });
      res.json(Product_incomings);
    } else {
      // If courseId is not provided, fetch all Product_incomings
      const Product_incomings = await Product_incoming.find();
      res.json(Product_incomings);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
routerProduct_incomings.delete('/:id', async (req, res) => {
  try {
    const Product_incomingId = req.params.id;

    // Check if the Product_incoming exists
    const existingProduct_incoming = await Product_incoming.findById(Product_incomingId);
    if (!existingProduct_incoming) {
      return res.status(404).json({ message: 'Product_incoming not found' });
    }

    // Delete the Product_incoming
    await Product_incoming.findByIdAndDelete(Product_incomingId);

    res.json({ message: 'Product_incoming deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
module.exports = routerProduct_incomings;