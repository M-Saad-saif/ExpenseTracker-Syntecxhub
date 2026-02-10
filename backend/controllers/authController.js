const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
// @param {string} id - User ID
// @returns {string} JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        },
        message: "User registered successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid user data",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        },
        message: "Login successful",
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    set user profile
// @route   POST /api/auth/uploadprofilepic
// @access  Private
const setProfilePic = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res
        .status(400)
        .json({ success: false, error: "Failed to upload profile picture" });
    }

    const userId = req.user.id;
    const profilePicPath = req.file.path;
    const user = await User.findByIdAndUpdate(
      userId, 
      { profileImage: profilePicPath },
      { new: true },
    );
    
    console.log({message:"find the user "});
    if (!user) {
      return res
      .status(404)
      .json({ success: false, message: "User not found try again" });
    }
    console.log({message:"find the user "});

    res.json({
      success: true,
      message: "Profile pic updated",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        monthlyBudget: user.monthlyBudget,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      error: "Cannot upload profile picture due to internal issues",
      message: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.monthlyBudget = req.body.monthlyBudget || user.monthlyBudget;

    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        monthlyBudget: updatedUser.monthlyBudget,
        token: generateToken(updatedUser._id),
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  setProfilePic,
};
