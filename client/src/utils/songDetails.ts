interface Song {
  attributes: {
    artwork: {
      url: string;
    };

    name: string;
    key: number;
    artistName: string;
  };
}

export const getSongDetails = (song: any) => {
  if (!song || !song.attributes) return {};

  const songKey = song.key;
  const coverArtUrl = song.attributes.artwork.url
    .replace("{w}", "250")
    .replace("{h}", "250");
  const songTitle = song.attributes.name;
  const artistName = song.attributes.artistName;

  return { coverArtUrl, songTitle, artistName, songKey };
};

interface DifferentSong {
  track: {
    artists: Array<{ adamid: string }>;
    id: string;
    hub: {
      type: string;
      image: string;
      actions: Array<any>;
    };
    images: {
      background: string;
      coverart: string;
      coverarthq: string;
    };
    key: string;
    subtitle: string;
    title: string;
    url: string;
  };
}

export const getDifferentSongDetails = (song: DifferentSong) => {
  if (!song || !song.track) return {};

  const songKey = song.track.key;
  const coverArtUrl = song.track.images.coverart;
  const songTitle = song.track.title;
  const artistName = song.track.subtitle;

  return { coverArtUrl, songTitle, artistName, songKey };
};
