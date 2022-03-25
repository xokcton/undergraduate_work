const crypto = require('crypto')
const { connect } = require('getstream')
const bcrypt = require('bcrypt')
const StreamChat = require('stream-chat').StreamChat

require('dotenv').config()
const { API_KEY, API_SECRET, APP_ID } = process.env

const signup = async (req, res) => {
  try {
    const { fullName, username, password, phoneNumber } = req.body
    const userId = crypto.randomBytes(16).toString('hex')
    const serverClient = connect(API_KEY, API_SECRET, APP_ID)
    const hashedPassword = await bcrypt.hash(password, 10)
    const token = serverClient.createUserToken(userId)

    res.status(201).json({ token, fullName, username, userId, phoneNumber, hashedPassword })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error })
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body
    const serverClient = connect(API_KEY, API_SECRET, APP_ID)
    const client = StreamChat.getInstance(API_KEY, API_SECRET)
    const { users } = await client.queryUsers({ name: username })

    if (!users.length) return res.status(400).json({ message: 'User not found!' })

    const success = bcrypt.compare(password, users[0].hashedPassword)
    const token = serverClient.createUserToken(users[0].id)

    if (success) res.status(200).json({ token, username, fullName: users[0].fullName, userId: users[0].id })
    else res.status(500).json({ message: 'Incorrect Password!' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error })
  }
}

module.exports = { login, signup }