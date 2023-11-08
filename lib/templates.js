import Handlebars from 'handlebars'
import fs from 'fs'
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'

const compiledTemplates = {}

function getTemplate (name) {
  if (compiledTemplates[name]) {
    return compiledTemplates[name]
  }

  const templateFilePath = 'templates/' + name

  if (!fs.existsSync(templateFilePath)) {
    throw new Error('Template file does not exist: ' + templateFilePath)
  }

  const insecureHandlebars = allowInsecurePrototypeAccess(Handlebars)
  const template = insecureHandlebars.compile(fs.readFileSync(templateFilePath).toString('utf8'))
  compiledTemplates[name] = template

  return template
}

function renderTemplate (name, data) {
  const template = getTemplate(name)
  return template(data, { allowedProtoProperties: true, allowedProtoMethods: true })
}

export {
  renderTemplate
}
