export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 1) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'video-text-layout';

  const videoCol = document.createElement('div');
  videoCol.className = 'video-text-video';

  const textCol = document.createElement('div');
  textCol.className = 'video-text-content';

  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      const link = cell.querySelector('a[href*="wistia"], a[href*="youtube"], a[href*="vimeo"], a[href*=".m3u8"]');
      if (link && videoCol.children.length === 0) {
        const iframe = document.createElement('div');
        iframe.className = 'video-text-player';
        const videoUrl = link.href;
        const embed = document.createElement('iframe');
        embed.src = videoUrl.replace('/embed/medias/', '/embed/iframe/').replace('.m3u8', '');
        embed.setAttribute('allowfullscreen', '');
        embed.setAttribute('allow', 'autoplay; fullscreen');
        embed.title = 'On the cutting edge of safety - UL Solutions video';
        iframe.append(embed);
        videoCol.append(iframe);
      } else {
        [...cell.childNodes].forEach((node) => textCol.append(node));
      }
    });
    row.remove();
  });

  wrapper.append(textCol, videoCol);
  block.textContent = '';
  block.append(wrapper);
}
