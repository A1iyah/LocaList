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
