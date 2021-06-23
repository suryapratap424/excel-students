const fs = require('fs')
const http = require('http')
var file = fs.readFileSync('./public/login.html', 'utf-8')
var form = fs.readFileSync('./public/form.html', 'utf-8')
http.createServer((req, res) => {

    let str = (req.url).substr(0, 5)
    if (str == '/') {
        res.end(file)
    } else if (str == '/form') {
        var mo = req.url.substr(11, 10)
        let faram = form.replace(/{mono}/g, mo)
        res.end(faram)
    } else if (str == '/admi') {
        //parsing url
        var mo = req.url.substr(6, req.url.length - 6)
        mo = mo.replace(/=/g, '":"')
        mo = mo.replace(/&/g, '","')
        mo = mo.replace(/\+/g, ' ')
        mo = '{"' + mo + '"}'
        obj = JSON.parse(mo)

        fs.access(`./data/${obj.mono}`, (err) => {
            if (err) {
                var mainfile = fs.readFileSync('./main.csv', 'utf-8')
                let data = `${obj.name},${obj.fname},${obj.mname},${obj.sr},${obj.dob},${obj.sAdhar},${obj.ifsc},${obj.hname},${obj.accno},${obj.phone},${obj.hAdhar},,,,\n`
                fs.mkdirSync(`./data/${obj.mono}`)
                for (let i = 1; i <= 5; i++) {
                    if (obj.class == i) {
                        fs.appendFileSync(`./data/${obj.mono}/class${obj.class}.csv`, mainfile + data)
                    } else {
                        fs.writeFile(`./data/${obj.mono}/class${i}.csv`, mainfile, (err) => {
                            if (err)
                                res.end(err)
                        })
                    }
                }

            } else {
                let data = `${obj.name},${obj.fname},${obj.mname},${obj.sr},${obj.dob},${obj.sAdhar},${obj.ifsc},${obj.hname},${obj.accno},${obj.phone},${obj.hAdhar},,,,\n`
                fs.appendFileSync(`./data/${obj.mono}/class${obj.class}.csv`, data)
            }
        })
        res.end(`<h1>uploaded succesfully</h1><a href="/" style="margin:20px">logout</a><a href="/form?name=${obj.mono}">upload another student</a>`)
    } else {
        console.log(req.url)
        try {
            studentslist = fs.readFileSync(`.${req.url}`)
            res.writeHead(200, {
                'Content-Type': 'text/csv'
            })
            res.end(studentslist)
        } catch (error) {
            res.end('some error occured')
        }

    }

}).listen('80')