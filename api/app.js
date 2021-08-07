import express from 'express'
import readline from 'readline'
import fs from 'fs'
import cors from 'cors'

const app = express()
const router = express.Router()

app.use(cors())

const readable = fs.createReadStream('document.csv')
const rl = readline.createInterface({input:readable})
var data = []

rl.on('line', line => {
    const arr = line.split(';')    

    for (let index = 0; index < arr.length; index++) {
        arr[index] = arr[index].replace('\"', '').replace('\"', '')
    }
    //console.log(arr)

    data.push(
        {
            registroANS:arr[0],
            CNPJ:arr[1],
            razaoSocial:arr[2],
            nomeFantasia:arr[3],
            modalidade:arr[4],
            logradouro:arr[5],
            numero:arr[6],
            complemento:arr[7],
            bairro:arr[8],
            cidade:arr[9],
            UF:arr[10],
            CEP:arr[11],
            DDD:arr[12],
            telefone:arr[13],
            Fax:arr[14],
            email:arr[15],
            represetante:arr[16],
            cargoRpresentante:arr[17],
            dataRegistroANS:arr[18]
        }
    )
})

router.get('/', (req, res, next) => {
    console.log('GET\ntamanho de \"data\": ', data.length, '\n\n')
    res.send({msg:'UTILIZOU O GET', data})
})

router.post('/', (req, res, next) => {
    console.log(req.body)
    data.push(req.body);
   
    var txt = objToString()

    fs.writeFileSync('document.csv', txt)
    console.log('POST\ntamanho de \"data\": ', data.length, '\n\n')
    res.send({msg:'UTILIZOU O POST', data})
})

router.patch('/', (req, res, next) => {
    const target = req.body.CNPJ
    const elmt = req.body.changes
    const elmtKeys = Object.keys(elmt)
    console.log('keys ', elmtKeys)

    console.log(target)

    const pos = findElmt(target)

    if(pos >= 0){
        elmtKeys.forEach(e => {
            if(elmt[e] != ''){
                data[pos][e] = elmt[e]
            }
        })

        console.log('depois de editado\n', data[pos])
    }
    else{
        console.log('elemento nao encontrado\n')
    }

    var txt = objToString()
    fs.writeFileSync('document.csv', txt)

    console.log('PATCH\ntamanho de \"data\": ', data.length, '\n\n')
    res.send({msg:'UTILIZOU O PATCH', data})
})

router.delete('/', (req, res, next) => {
    console.log(req.body)
    const target = req.body.CNPJ

    console.log('vamos achar', target)
    const pos = findElmt(target)
    if(pos >= 0){
        data.splice(pos, 1)
    }
    else{
        console.log('elemento nao encontrado')
    }

    var txt = objToString()
    fs.writeFileSync('document.csv', txt)

    console.log('DELETE\ntamanho de \"data\": ', data.length, '\n\n')
    res.send({msg:'UTILIZOU O DELETE', data})    
})

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use('/', router)

app.use((req, res, next) => {
    const error = new Error('not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    return res.send({
        erro:{mensagem:error.message}
    })
})

function objToString(){
    let txt = ''
    data.forEach((element, i) => {
        let arr = []
        Object.keys(element).forEach(el => {
            arr.push(`"${element[el]}"`)
        })
        txt += arr.join(';')
        if(i < data.length-1){
            txt += '\n'
        }
    })

    return txt
}

function findElmt(param){
    let i, j, keys
    for (i = 0; i < data.length; i++) {
        if(data[i].CNPJ == param){
            console.log(data[i].CNPJ, 'com', param)
            return i
        }       
    }

    return -1
}

export {app, router}