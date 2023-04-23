const axios = require("axios");

const validateHcaptcha = async (req, res, next) => {
  try {
    const data = new URLSearchParams();
    const { hCaptcha: token } = req.body;

    data.append("secret", process.env.HCAPTCHA_KEY);
    data.append("response", token);

    const response = await axios.post("https://hcaptcha.com/siteverify", data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.data.success) {
      req.hCaptchaValid = true;
    } else {
      req.hCaptchaValid = false;
    }
  } catch (error) {
    req.hCaptchaValid = false;
    console.log("error", error);
  }
  next();
};

module.exports = { validateHcaptcha };
