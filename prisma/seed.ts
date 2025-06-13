import prismaClient from '../src/prisma/index'

async function main() {
  await prismaClient.category.upsert({
    where: { name: 'Curso Online' },
    update: {},
    create: { name: 'Curso Online' }
  })
}

main()
  .catch((e) => {
    console.error('❌ Erro ao rodar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prismaClient.$disconnect()
  })