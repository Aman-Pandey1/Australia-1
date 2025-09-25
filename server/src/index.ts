import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { router } from './routes'

dotenv.config()

const app = express()
const port = process.env.PORT ? Number(process.env.PORT) : 4000
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173'

app.use(cors({ origin: corsOrigin, credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use('/api', router)

app.get('/api/health', (_req, res) => {
	res.json({ ok: true })
})

app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`)
})