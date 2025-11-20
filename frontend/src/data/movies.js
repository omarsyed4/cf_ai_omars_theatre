const R2_PUBLIC_URL = 'https://pub-04a0de5f81b649f9abb5465eb19addbd.r2.dev'

export const movies = [
  {
    id: 'black-hole',
    title: 'The Black Hole',
    description: 'A tired office worker discovers a mysterious black hole that can penetrate any surface. But greed has consequences.',
    duration: '2:30',
    durationSeconds: 150,
    videoUrl: `${R2_PUBLIC_URL}/black-hole/video.mp4`,
    scriptUrl: `${R2_PUBLIC_URL}/black-hole/script.json`,
    thumbnailUrl: 'https://via.placeholder.com/1280x720/1a1a1a/ffffff?text=The+Black+Hole',
    year: 2008
  },
  {
    id: 'alma',
    title: 'Alma',
    description: 'A curious young girl enters a mysterious toy shop and discovers that some toys are not what they seem.',
    duration: '5:30',
    durationSeconds: 330,
    videoUrl: `${R2_PUBLIC_URL}/alma/video.mp4`,
    scriptUrl: `${R2_PUBLIC_URL}/alma/script.json`,
    thumbnailUrl: 'https://via.placeholder.com/1280x720/1a1a1a/ffffff?text=Alma',
    year: 2009
  },
  {
    id: 'cargo',
    title: 'Cargo',
    description: 'A father infected with a zombie virus must get his baby to safety before he transforms, using his last moments to ensure his child survives.',
    duration: '7:00',
    durationSeconds: 420,
    videoUrl: `${R2_PUBLIC_URL}/cargo/video.mp4`,
    scriptUrl: `${R2_PUBLIC_URL}/cargo/script.json`,
    thumbnailUrl: 'https://via.placeholder.com/1280x720/1a1a1a/ffffff?text=Cargo',
    year: 2013
  }
]
