import prismaClient from '.'
import { FIXED_CATEGORIES } from '../@types/types'

async function main() {
  await prismaClient.category.upsert({
    where: { name: FIXED_CATEGORIES.CURSO_ONLINE.name },
    update: {},
    create: { name: FIXED_CATEGORIES.CURSO_ONLINE.name }
  })
}

main()
  .catch(e => {
    console.error('❌ Erro ao rodar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prismaClient.$disconnect()
  })
