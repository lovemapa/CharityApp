import express from 'express'

import application from './routes/applicationRoutes'
import user from './routes/userRoutes'
import chat from './routes/chatRoute'

const app = express.Router()

app.use('/application', application)
app.use('/user', user)
app.use('/chat', chat)

export default app