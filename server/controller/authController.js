const pool = require("../database");

const signup = async (req, res) => {
  const { username, phone } = req.body;

  try {
    const response = await pool.query(
      "INSERT INTO users (username, phone, created_date ) VALUES ($1, $2, CURRENT_DATE) RETURNING *",
      [username, phone]
    );

    return res.status(200).json({
      success: true,
      message: "User signed up successfully",
      userId: response.rows[0].id,
    });
  } catch (error) {
    console.error(error);
    // if (error.constraint === "users_phone_key") {
    //   return res.status(409).json({
    //     success: false,
    //     message: "User already exists, please try a different phone number.",
    //   });
    // } else {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
    // }
  }
};

//login route
const login = async (req, res) => {
  const { phone } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE phone = $1", [
      phone,
    ]);

    if (user.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    console.log(user.rows[0]);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      userId: user.rows[0].id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  signup,
  login,
};
