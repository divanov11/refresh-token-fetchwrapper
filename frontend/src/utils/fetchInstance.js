import jwt_decode from "jwt-decode";
import dayjs from 'dayjs'

let baseURL = 'http://127.0.0.1:8000'

let originalRequest = async (url, config)=> {
    url = `${baseURL}${url}`
    let response = await fetch(url, config)
    let data = await response.json()
    console.log('REQUESTING:', data)
    return {response, data}
}

let refreshToken = async (authTokens) => {

    let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({'refresh':authTokens.refresh})
    })
    let data = await response.json()
    localStorage.setItem('authTokens', JSON.stringify(data))
    return data
}


let customFetcher = async (url, config={}) => {
    let authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
    
    // const user = jwt_decode(authTokens.access)
    // const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    // if(isExpired){
    //     authTokens = await refreshToken(authTokens)
    // }

    //Proceed with request

    config['headers'] = {
        Authorization:`Bearer ${authTokens?.access}`
    }


    console.log('Before Request')
    let {response, data} = await originalRequest(url, config)
    console.log('After Request')

    if (response.statusText === 'Unauthorized'){
        authTokens = await refreshToken(authTokens)

        config['headers'] = {
            Authorization:`Bearer ${authTokens?.access}`
        }

        let newResponse = await originalRequest(url, config)
        response = newResponse.response
        data = newResponse.data

    }

    return {response, data}
}
export default customFetcher;