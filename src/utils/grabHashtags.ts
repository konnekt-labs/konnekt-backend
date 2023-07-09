export const grabHashtags = (title: string) => {
  const hashtags = title.match(/#[a-z]+/gi);
  return hashtags ? hashtags.map((hashtag) => hashtag.slice(1)) : [];
};
