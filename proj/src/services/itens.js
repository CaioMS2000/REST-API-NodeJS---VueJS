import {http} from './config'

export default {
    listar: () => {
        const ret = http.get('/')
        //console.log(ret)
        return ret
    },

    add: (iten) =>{
        const ret = http.post('/', iten)
        return ret
    },

    del: (iten) => {
        console.log(iten)
        const ret = http.delete('/', iten)
        return ret
    },

    edit:(iten) => {
        console.log(iten)
        const ret = http.patch('/', iten)
        return ret
    }
}