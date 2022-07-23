import axios, { AxiosError, AxiosResponse } from 'axios'
import { NamedEntity } from '@/types/NamedEntity'
import Settings from '@/types/Settings'
import SettingsManager from './SettingsManager'
import NameReducer from './NameReducer'

export default class ScheduleApi {
  private settings: Settings

  constructor () {
    this.settings = SettingsManager.getOrCreateSettings()
  }

  async getScheduleByGroup (groupId: number, date: string) {
    return await axios.get(`https://sgk-schedule-api.vercel.app/api/schedule/${groupId}/${date}`)
      .then(this.handleResponse)
      .catch(this.handleError)
  }

  async getScheduleByUser (userId: number, date: string) {
    return await axios.get(`https://sgk-schedule-api.vercel.app/api/schedule/teacher/${date}/${userId}`)
      .then(this.handleResponse)
      .catch(this.handleError)
  }

  async getGroups () {
    return await axios.get('https://sgk-schedule-api.vercel.app/api/groups')
      .then(this.handleResponse)
      .catch(this.handleError)
  }

  async getTeachers () {
    return await axios.get('https://sgk-schedule-api.vercel.app/api/teachers')
      .then(this.handleResponse)
      .then((teachers: NamedEntity[]) =>
        this.settings.abbreviation ? teachers.map(NameReducer.reduce) : teachers)
      .catch(this.handleError)
  }

  private handleResponse (response: AxiosResponse) {
    if (process.env.NODE_ENV === 'development') {
      console.log(response)
    }

    return response.data
  }

  private handleError (error: AxiosError) {
    if (process.env.NODE_ENV === 'development') {
      console.error(error)
    }
    return error
  }
}
