import buildApp from './app'

async function start() {
  const app = await buildApp()

  const port = Number(process.env.PORT) || 3000
  const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'

  try {
    await app.listen({ port, host })
    console.log(`Server running at http://${host}:${port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()