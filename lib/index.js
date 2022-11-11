const core = require('@actions/core')
const path = require('path')
const { Client } = require('@notionhq/client')
const YAML = require('yaml')
const safeStableStringify = require('safe-stable-stringify')
const JSON5 = require('json5')
const fs = require('fs')
import camelcaseKeys from 'camelcase-keys'

try {
  const notionToken = core.getInput('notion-token')
  const notionDb = core.getInput('notion-db')
  const outputFile = core.getInput('output-file')
  const outputFileExt = path.extname(outputFile).substring(1)
  const outputFormat = core.getInput('output-format').length === 0 ? outputFileExt : core.getInput('output-format')
  const ignoreColumns = core.getInput('ignore-columns') || []
  const camelcaseKeysEnabled = core.getBooleanInput('camelcase-keys')

  if (notionToken.length === 0) {
    core.error('You need to specify a notion-token')
  }

  if (notionDb.length === 0) {
    core.error('You need to specify a notion-db')
  }

  if (outputFile.length === 0) {
    core.error('You need to specify a output-file')
  }

  core.debug(`notionDb: ${notionDb}`)
  core.debug(`notionToken: ${notionToken}`)
  core.debug(`Output file: ${outputFile}`)
  core.debug(`Output file extension: ${outputFileExt}`)
  core.debug(`Output file format: ${outputFormat}`)
  core.debug(`Ignore Columns: ${ignoreColumns}`)
  core.debug(`camelCase Keys: ${camelcaseKeysEnabled}`)

  const notion = new Client({
    auth: notionToken
  })

  const run = async () => {
    const pages = await notion.databases.query({
      database_id: notionDb
    })

    const finalPage = {}

    // TODO: loop if there is nextCursor

    pages.results.forEach((pageResult) => {
      const currentPage = pageResult.properties

      const entries = Object.entries(currentPage)
      let currentTitle = ''
      const currentChild = {}

      for (const [key, value] of entries) {
        if (ignoreColumns.includes(key)) { continue }

        switch (value.type) {
          case 'multi_select':
            if (value?.multi_select !== null) {
              const elements = []
              value.multi_select.forEach((element) => {
                elements.push(element.name)
              })
              currentChild[key] = elements
            }
            break
          case 'select':
            if (value?.select !== null && value.select.name.length !== 0) {
              currentChild[key] = value.select.name
            }
            break
          case 'rich_text':
            if (value?.rich_text.length !== 0) {
              currentChild[key] = value?.rich_text[0]?.plain_text
            }
            break
          case 'checkbox':
            if (value?.checkbox !== null) {
              currentChild[key] = value.checkbox
            }
            break
          case 'title':
            if (value?.title.length !== 0) {
              currentTitle = value?.title[0]?.plain_text
            }
            break
          case 'number':
            if (value?.number !== null) {
              currentChild[key] = value?.number
            }
            break
          case 'date':
            if (value?.date !== null) {
              currentChild[key] = value?.date
            }
            break
          case 'url':
            if (value?.url !== null) {
              currentChild[key] = value?.url
            }
            break
          case 'status':
            if (value?.status?.name?.length !== 0) {
              currentChild[key] = value?.status?.name
            }
            break
          default:
            core.error(`Current value.type ${value.type} not yet supported`)
        }
      }
      finalPage[currentTitle] = currentChild
    })

    let processedPage = finalPage
    if (camelcaseKeysEnabled) {
      processedPage = camelcaseKeys(finalPage, { deep: true })
    }

    let outputContent = null
    switch (outputFormat) {
      case 'yml':
      case 'yaml':
        outputContent = YAML.stringify(JSON.parse(safeStableStringify(processedPage)))
        break
      case 'json':
        outputContent = safeStableStringify(processedPage, null, 2)
        break
      case 'json5':
        outputContent = JSON5.stringify(JSON5.parse(safeStableStringify(processedPage)), null, 2)
        break
      default:
        core.error(`Format ${outputFormat} not yet supported`)
        break
    }

    // Save to file
    fs.writeFileSync(outputFile, outputContent)

    // Debug
    // console.log(outputContent)
    // core.debug(`File contents: \n${outputContent}`)
  }
  run()
} catch (error) {
  core.setFailed(error.message)
}
