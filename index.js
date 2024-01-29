const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')

const getDirectories = (source) => {
    return fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
}

const folders = getDirectories(path.resolve(__dirname, './messages'))

const messageList = []

folders.forEach(async (folder, index) => {
    const filePath = path.resolve(__dirname, `./messages/${folder}/messages.csv`)

    const csvData = []
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (result) => {
            // console.log(result)
            if (result.Timestamp == '2020-12-24 13:04:06.483000+00:00') {
                console.log(folder)
            }
            csvData.push(result)
        })
        .on('end', () => {
            messageList.push(csvData)
        })
})

setTimeout(() => {
    const data = messageList.filter((item) => item.length > 0)

    data.forEach((item) => {
        item.sort((a, b) => {
            const aDate = new Date(a.Timestamp)
            const bDate = new Date(b.Timestamp)
            return aDate - bDate
        })
    })

    fs.writeFileSync(path.resolve(__dirname, './data.json'), JSON.stringify(data))
}, 5000)