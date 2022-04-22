const ScheduleApi = {
  getScheduleByGroup (groupId: number, date: string) {
    return fetch(`https://asu.samgk.ru/api/schedule/${groupId}/${date}`, { method: 'GET' })
      .then(response => response.json())
      .catch(error => console.log('error', error))
  },
  getScheduleByUser (userId: number, date: string) {
    return fetch(`https://asu.samgk.ru/api/schedule/teacher/${date}/${userId}`, { method: 'GET' })
      .then(response => response.json())
      .catch(error => console.log('error', error))
  }
}

export default ScheduleApi
