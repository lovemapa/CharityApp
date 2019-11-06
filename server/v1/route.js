import express from 'express'

import application from './routes/applicationRoutes'
import user from './routes/userRoutes'
import chat from './routes/chatRoute'
import notification from './routes/notificationRoute'

const app = express.Router()

app.use('/application', application)
app.use('/user', user)
app.use('/chat', chat)
app.use('/chat', notification)

export default app