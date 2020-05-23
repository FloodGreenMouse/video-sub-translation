import axios from 'axios'
const apiKey = process.env.VUE_APP_TRANSLATE_API_KEY

class API {
  getTranslate = (word) => {
    return axios.get(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${apiKey}&lang=en-ru&text=${word}`)
  }
}

export { API }
export default new API()
