import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Ball Intelligence database...');

  // Teams
  const celtics = await prisma.team.upsert({
    where: { slug: 'boston-celtics' },
    update: {},
    create: {
      name: 'Boston Celtics',
      slug: 'boston-celtics',
      abbreviation: 'BOS',
      city: 'Boston',
      league: 'NBA',
      conference: 'Eastern',
      division: 'Atlantic',
      primaryColor: '#007A33',
      secondaryColor: '#BA9653',
      wins: 52,
      losses: 18,
      record: '52-18',
      featured: true,
    },
  });

  const lakers = await prisma.team.upsert({
    where: { slug: 'los-angeles-lakers' },
    update: {},
    create: {
      name: 'Los Angeles Lakers',
      slug: 'los-angeles-lakers',
      abbreviation: 'LAL',
      city: 'Los Angeles',
      league: 'NBA',
      conference: 'Western',
      division: 'Pacific',
      primaryColor: '#552583',
      secondaryColor: '#FDB927',
      wins: 42,
      losses: 28,
      record: '42-28',
    },
  });

  const eagles = await prisma.team.upsert({
    where: { slug: 'philadelphia-eagles' },
    update: {},
    create: {
      name: 'Philadelphia Eagles',
      slug: 'philadelphia-eagles',
      abbreviation: 'PHI',
      city: 'Philadelphia',
      league: 'NFL',
      conference: 'NFC',
      division: 'NFC East',
      primaryColor: '#004C54',
      secondaryColor: '#A5ACAF',
      wins: 13,
      losses: 4,
      record: '13-4',
      featured: true,
    },
  });

  console.log('Teams seeded:', celtics.name, lakers.name, eagles.name);

  // Players
  await prisma.player.upsert({
    where: { slug: 'jayson-tatum' },
    update: {},
    create: {
      name: 'Jayson Tatum',
      slug: 'jayson-tatum',
      firstName: 'Jayson',
      lastName: 'Tatum',
      number: '0',
      position: 'SF',
      age: 26,
      teamId: celtics.id,
      league: 'NBA',
      seasonStats: { ppg: 27.1, rpg: 8.8, apg: 4.9, spg: 1.1, bpg: 0.6, fgPct: 47.1, threePct: 37.6, ftPct: 85.2, gamesPlayed: 68, minutesPerGame: 36.2 },
      bio: 'Jayson Tatum is the engine that drives the Celtics.',
      featured: true,
      trending: true,
    },
  });

  await prisma.player.upsert({
    where: { slug: 'jaylen-brown' },
    update: {},
    create: {
      name: 'Jaylen Brown',
      slug: 'jaylen-brown',
      firstName: 'Jaylen',
      lastName: 'Brown',
      number: '7',
      position: 'SG',
      age: 27,
      teamId: celtics.id,
      league: 'NBA',
      seasonStats: { ppg: 23.0, rpg: 5.9, apg: 3.6, spg: 1.2, bpg: 0.5, fgPct: 49.2, threePct: 35.4, ftPct: 71.2, gamesPlayed: 67, minutesPerGame: 34.5 },
      bio: 'Finals MVP Jaylen Brown is one of the most complete two-way players in the NBA.',
      featured: true,
      trending: true,
    },
  });

  await prisma.player.upsert({
    where: { slug: 'jalen-hurts' },
    update: {},
    create: {
      name: 'Jalen Hurts',
      slug: 'jalen-hurts',
      firstName: 'Jalen',
      lastName: 'Hurts',
      number: '1',
      position: 'QB',
      age: 25,
      teamId: eagles.id,
      league: 'NFL',
      seasonStats: { passingYards: 3858, passingTDs: 23, completionPct: 67.2, rushingYards: 605, rushingTDs: 15, gamesPlayed: 17 },
      bio: 'Jalen Hurts is the complete modern quarterback.',
      featured: true,
      trending: true,
    },
  });

  console.log('Players seeded');

  // Articles
  await prisma.article.upsert({
    where: { slug: 'jaylen-brown-mvp-conversation' },
    update: {},
    create: {
      title: 'Why Jaylen Brown Is Entering the MVP Conversation',
      slug: 'jaylen-brown-mvp-conversation',
      excerpt: 'Jaylen Brown has been playing at an elite level all season.',
      content: 'Jaylen Brown is having the best season of his career...',
      authorName: 'Ayaan Arif',
      category: 'Analysis',
      tags: ['NBA', 'Celtics', 'MVP Race'],
      readingTime: 5,
      featured: true,
      published: true,
    },
  });

  console.log('Articles seeded');
  console.log('Database seeding complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
