const core = require('@actions/core')
const github = require('@actions/github')

try {
    const notionToken = core.getInput('notion-token')
    const notionDb = core.getInput('notion-db')
    const outputFile = core.getInput('output-file')


    console.log(`Hello ${outputFile}!`)
    const time = (new Date()).toTimeString()
    core.setOutput("time", time)

    //const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`Event payload: ${payload}`)
} catch (error) {
    core.setFailed(error.message)
}