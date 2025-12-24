/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function floSearchUrl(artist, title) {
  const q = encodeURIComponent(`${artist} ${title} 캐롤`);
  return `https://www.music-flo.com/search/search?query=${q}`;
}

async function main() {
  const kpopArtists = [
    { slug: "exo", name: "EXO" },
    { slug: "taeyeon", name: "Taeyeon" },
    { slug: "twice", name: "TWICE" },
    { slug: "stray-kids", name: "Stray Kids" },
    { slug: "nct-dream", name: "NCT DREAM" },
    { slug: "iu", name: "IU" },
    { slug: "bts", name: "BTS" },
    { slug: "newjeans", name: "NewJeans" },
    { slug: "v", name: "V" },
    { slug: "btob", name: "BTOB" },
  ];

  const songs = [
    // POP (10)
    { genre: "POP", title: "All I Want for Christmas Is You", artist: "Mariah Carey" },
    { genre: "POP", title: "Last Christmas", artist: "Wham!", floUrl: "https://flomuz.io/s/b.CGn4M" },
    { genre: "POP", title: "Santa Tell Me", artist: "Ariana Grande" },
    { genre: "POP", title: "Mistletoe", artist: "Justin Bieber" },
    { genre: "POP", title: "Underneath the Tree", artist: "Kelly Clarkson" },
    { genre: "POP", title: "Santa Baby", artist: "Eartha Kitt" },
    { genre: "POP", title: "It's Beginning to Look a Lot Like Christmas", artist: "Michael Bublé" },
    { genre: "POP", title: "Jingle Bell Rock", artist: "Bobby Helms" },
    { genre: "POP", title: "Rockin' Around the Christmas Tree", artist: "Brenda Lee" },
    { genre: "POP", title: "Feliz Navidad", artist: "José Feliciano" },
    { genre: "POP", title: "Happy Xmas (War Is Over) (Ultimate Mix)", artist: "John Lennon & Yoko Ono", floUrl: "https://flomuz.io/s/b.wYlg" },
    { genre: "POP", title: "또다시 크리스마스", artist: "들국화", floUrl: "https://flomuz.io/s/b.rwT" },
    { genre: "POP", title: "Wonderful Christmastime", artist: "Paul McCartney" },
    { genre: "POP", title: "Driving Home for Christmas", artist: "Chris Rea" },
    { genre: "POP", title: "Step Into Christmas", artist: "Elton John" },
    { genre: "POP", title: "Merry Christmas Everyone", artist: "Shakin' Stevens" },
    { genre: "POP", title: "One More Sleep", artist: "Leona Lewis" },
    { genre: "POP", title: "Christmas (Baby Please Come Home)", artist: "Darlene Love" },
    { genre: "POP", title: "Holly Jolly Christmas", artist: "Burl Ives" },
    { genre: "POP", title: "Fairytale of New York", artist: "The Pogues" },
    { genre: "POP", title: "Run Rudolph Run", artist: "Chuck Berry" },
    { genre: "POP", title: "Please Come Home for Christmas", artist: "Eagles" },

    // JAZZ (22)
    { genre: "JAZZ", title: "The Christmas Song (Chestnuts Roasting on an Open Fire)", artist: "Nat King Cole" },
    { genre: "JAZZ", title: "Have Yourself a Merry Little Christmas", artist: "Ella Fitzgerald" },
    { genre: "JAZZ", title: "Winter Wonderland", artist: "Tony Bennett" },
    { genre: "JAZZ", title: "Let It Snow! Let It Snow! Let It Snow!", artist: "Dean Martin" },
    { genre: "JAZZ", title: "White Christmas", artist: "Bing Crosby" },
    { genre: "JAZZ", title: "I'll Be Home for Christmas", artist: "Frank Sinatra" },
    { genre: "JAZZ", title: "Sleigh Ride", artist: "The Ronettes" },
    { genre: "JAZZ", title: "Blue Christmas", artist: "Elvis Presley" },
    { genre: "JAZZ", title: "O Holy Night", artist: "Louis Armstrong" },
    { genre: "JAZZ", title: "What Are You Doing New Year's Eve?", artist: "Nancy Wilson" },
    { genre: "JAZZ", title: "Christmas Time Is Here (Vocal)", artist: "Vince Guaraldi Trio", floUrl: "https://flomuz.io/s/b.CRq7e" },
    { genre: "JAZZ", title: "잘 되길 바랄게", artist: "소수빈", floUrl: "https://flomuz.io/s/a.bwZSJ" },
    { genre: "JAZZ", title: "My Favorite Things", artist: "John Coltrane" },
    { genre: "JAZZ", title: "Santa Claus Is Coming To Town", artist: "Bill Evans" },
    { genre: "JAZZ", title: "I've Got My Love to Keep Me Warm", artist: "Billie Holiday" },
    { genre: "JAZZ", title: "Let It Snow", artist: "Diana Krall" },
    { genre: "JAZZ", title: "I'll Be Home for Christmas", artist: "Oscar Peterson" },
    { genre: "JAZZ", title: "Winter Weather", artist: "Benny Goodman" },
    { genre: "JAZZ", title: "The Christmas Waltz", artist: "Peggy Lee" },
    { genre: "JAZZ", title: "A Child Is Born", artist: "Thad Jones & Mel Lewis Orchestra" },
    { genre: "JAZZ", title: "Greensleeves", artist: "Vince Guaraldi Trio" },
    { genre: "JAZZ", title: "Silent Night", artist: "Chet Baker" },

    // KPOP (17)
    { genre: "KPOP", title: "Miracles in December", artist: "EXO", kpopArtistSlug: "exo" },
    { genre: "KPOP", title: "The First Snow", artist: "EXO", kpopArtistSlug: "exo" },
    { genre: "KPOP", title: "December, 2014 (The Winter's Tale)", artist: "EXO", kpopArtistSlug: "exo" },
    { genre: "KPOP", title: "Sing For You", artist: "EXO", kpopArtistSlug: "exo" },
    { genre: "KPOP", title: "Unfair", artist: "EXO", kpopArtistSlug: "exo" },
    { genre: "KPOP", title: "This Christmas", artist: "Taeyeon", kpopArtistSlug: "taeyeon" },
    { genre: "KPOP", title: "Candy Cane", artist: "Taeyeon", kpopArtistSlug: "taeyeon" },
    { genre: "KPOP", title: "Christmas Without You", artist: "Taeyeon", kpopArtistSlug: "taeyeon" },
    { genre: "KPOP", title: "Merry & Happy", artist: "TWICE", kpopArtistSlug: "twice" },
    { genre: "KPOP", title: "The Best Thing I Ever Did", artist: "TWICE", kpopArtistSlug: "twice" },
    { genre: "KPOP", title: "Heart Shaker", artist: "TWICE", kpopArtistSlug: "twice" },
    { genre: "KPOP", title: "Doughnut", artist: "TWICE", kpopArtistSlug: "twice" },
    { genre: "KPOP", title: "Christmas EveL", artist: "Stray Kids", kpopArtistSlug: "stray-kids" },
    { genre: "KPOP", title: "Winter Falls", artist: "Stray Kids", kpopArtistSlug: "stray-kids" },
    { genre: "KPOP", title: "24 to 25", artist: "Stray Kids", kpopArtistSlug: "stray-kids" },
    { genre: "KPOP", title: "Candle Light", artist: "NCT DREAM", kpopArtistSlug: "nct-dream" },
    { genre: "KPOP", title: "Joy", artist: "NCT DREAM", kpopArtistSlug: "nct-dream" },
    { genre: "KPOP", title: "Merry Christmas in Advance", artist: "IU", kpopArtistSlug: "iu" },
    { genre: "KPOP", title: "Butter (Holiday Remix)", artist: "BTS", kpopArtistSlug: "bts" },
    { genre: "KPOP", title: "Dynamite (Holiday Remix)", artist: "BTS", kpopArtistSlug: "bts" },
    { genre: "KPOP", title: "Ditto", artist: "NewJeans", kpopArtistSlug: "newjeans" },
    { genre: "KPOP", title: "Christmas Tree", artist: "V", kpopArtistSlug: "v" },
    { genre: "KPOP", title: "Snow Flower", artist: "V", kpopArtistSlug: "v" },
    { genre: "KPOP", title: "The Winter's Tale", artist: "BTOB", kpopArtistSlug: "btob" },
    { genre: "KPOP", title: "Because It's Christmas", artist: "BTOB", kpopArtistSlug: "btob" },
  ];

  console.log(`Seeding ${kpopArtists.length} KPOP artists and ${songs.length} songs...`);

  await prisma.card.deleteMany();
  await prisma.carolSong.deleteMany();
  await prisma.kpopArtist.deleteMany();

  await prisma.kpopArtist.createMany({ data: kpopArtists });
  // `createMany` doesn't return IDs; fetch mapping
  const artistRows = await prisma.kpopArtist.findMany({ select: { id: true, slug: true } });
  const artistIdBySlug = new Map(artistRows.map((a) => [a.slug, a.id]));

  const songRows = songs.map((s) => {
    const kpopArtistId = s.kpopArtistSlug ? artistIdBySlug.get(s.kpopArtistSlug) : undefined;
    return {
      genre: s.genre,
      title: s.title,
      artist: s.artist,
      floUrl: s.floUrl ?? floSearchUrl(s.artist, s.title),
      ...(kpopArtistId ? { kpopArtistId } : {}),
    };
  });

  await prisma.carolSong.createMany({ data: songRows });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
