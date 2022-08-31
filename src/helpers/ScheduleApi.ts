import axios, { AxiosError, AxiosResponse } from 'axios'
import { NamedEntity } from '@/types/NamedEntity'
import Settings from '@/types/Settings'
import SettingsManager from './SettingsManager'
import NameReducer from './NameReducer'

const groupsRoute = () => 'https://mfc.samgk.ru/api/groups'
const teachersRoute = () => 'https://asu.samgk.ru/api/teachers'
const scheduleByGroupRoute = (groupId: number, date: string) =>
  `https://asu.samgk.ru/api/schedule/${groupId}/${date}`
const scheduleByUserRoute = (userId: number, date: string) =>
  `https://asu.samgk.ru/api/schedule/teacher/${date}/${userId}`

export default class ScheduleApi {
  private settings: Settings

  constructor () {
    this.settings = SettingsManager.getOrCreateSettings()
  }

  async getScheduleByGroup (groupId: number, date: string) {
    return await axios.get(scheduleByGroupRoute(groupId, date))
      .then(this.handleResponse)
      .catch(this.handleError)
  }

  async getScheduleByUser (userId: number, date: string) {
    return await axios.get(scheduleByUserRoute(userId, date))
      .then(this.handleResponse)
      .catch(this.handleError)
  }

  async getGroups () {
    return await axios.get(groupsRoute())
      .then(this.handleResponse)
      .catch(this.handleError)
  }

  async getTeachers () {
    return await axios.get(teachersRoute())
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
