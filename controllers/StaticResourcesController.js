import fs from 'fs'

const backgroundsImages = async (req, res) => {
  const format = req.params.format
  const folder = `var/data/static/backgrounds/${format}`

  const files = fs.readdirSync(folder)

  res.status(200).json({
    images: files.map((file) => {
      return `/static/backgrounds/${format}/${file}`
    })
  })
}

export { backgroundsImages }
