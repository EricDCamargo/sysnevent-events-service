import { Location } from '@prisma/client'

enum Role {
  DOCENT_ASSISTANT = 'DOCENT_ASSISTANT',
  COORDINATOR = 'COORDINATOR',
  ADMIN = 'ADMIN'
}

const FIXED_CATEGORIES = {
  CURSO_ONLINE: {
    name: 'Curso Online',
    enforcedLocation: Location.OUTROS,
    customLocation: 'EAD'
  }
}

export { Role, FIXED_CATEGORIES }
