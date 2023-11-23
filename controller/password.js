const sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require('uuid');
const forgotPassword = require('../model/forgotpassword');
const Users = require('../model/user');
const bcrypt = require('bcrypt');
require('dotenv').config();

exports.forgotPassword = async (req, res) => {
  try {
    console.log('i am in')
    const userEmail = req.params.email;
    const user = await Users.findOne({ where: { email: userEmail } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const uuid = uuidv4();

    await forgotPassword.create({
      userId: user.id,
      uuid: uuid,
      isActive: true,
    });

    const defaultClient = sib.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.API_KEY;

    const transEmailApi = new sib.TransactionalEmailsApi();
    
  
    const sender = {
      email: "malikibrah07@gmail.com",
      name: "Adnan",
    };

    const receiver = [
      {
        email: user.email,
      },
    ];
    
   
    const textContent = `<a href="http://localhost:3000/password/resetpassword/${uuid}">Click To Reset password</a>`;

    const emailRequest = {
      sender,
      to: receiver,
      subject: "Password Reset",
      textContent: textContent,
    };

    // Send the password reset email
   // await transEmailApi.sendTransacEmail(emailRequest);
   await transEmailApi.sendTransacEmail(emailRequest);
   


    res.status(200).json({ message: 'Link to reset password has been sent to your mail' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const forgotPasswordRequest = await forgotPassword.findOne({ where: { uuid: uuid, isActive: true } });

    if (forgotPasswordRequest) {
      // Deactivate the request
      await forgotPasswordRequest.update({ isActive: false });

      // Display a form to reset the password
      res.status(200).send(`
        <html>
          <form action="/password/updatepassword/${uuid}" method="post">
            <label for="password">Enter New Password</label>
            <input name="password" type="password" required></input>
            <button>Reset Password</button>
          </form>
        </html>
      `);
    } else {
      res.status(404).send('Password reset link is invalid or has already been used');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const newPassword = req.body.password;

    // Check if UUID is valid (you may want to add more validation)
    if (!uuid || !newPassword) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const request = await forgotPassword.findOne({ where: { uuid: uuid } });

    if (request) {
      const user = await Users.findOne({ where: { id: request.userId } });

      if (user) {
        const saltRounds = 10;
        const hash = await bcrypt.hash(newPassword, saltRounds);

        // Update the user's password in the database
        await user.update({ password: hash });

        // Deactivate the request, as it's used
        await request.update({ isActive: false });

        return res.status(200).json({ message: 'Password successfully updated' });
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    } else {
      return res.status(404).json({ error: 'Password reset request not found' });
    }
  } catch (err) {
    console.error('Password update error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
