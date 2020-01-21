'use strict'

const axios = require('axios')

const api = axios.create({
    baseURL: 'http://www.siepe.educacao.pe.gov.br',
    headers:{
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0',
        'Accept-Language':'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': '*/*',
        'Sec-Fetch-Site':'same-origin',
        'Sec-Fetch-Mode':'cors',
        'Referer':'https://www.siepe.educacao.pe.gov.br/',
        'DNT':'1',
        'Connection':   'keep-alive'
    },
    withCredentials: true
})

module.exports = api