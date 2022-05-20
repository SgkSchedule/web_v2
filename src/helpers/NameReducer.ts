import { NamedEntity } from '@/types/NamedEntity'

const NameReducer = {
  reduce (teacher: NamedEntity): NamedEntity {
    const splited = teacher.name.replace(/\s+/g, ' ').trim().split(' ')
    if (splited.length === 2) {
      const lastName = splited[0]
      const firstNameChar = splited[1][0]
      teacher.name = `${lastName} ${firstNameChar}.`
    }

    if (splited.length >= 3) {
      const lastName = splited[0]
      const firstNameChar = splited[1][0]
      const middleNameChar = splited[2][0]
      teacher.name = `${lastName} ${firstNameChar}. ${middleNameChar}.`
    }

    return teacher
  }
}

export default NameReducer
