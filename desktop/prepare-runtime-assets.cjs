const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const assets = [
  {
    path: path.join(root, 'assets', 'artwork', 'maps', 'title-map-1938.jpg'),
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/1938_Pictorial_Map_of_Washington_D.C._-_Geographicus_-_WashingtonDC-traster-1938.jpg'
  },
  {
    path: path.join(root, 'assets', 'audio', 'title-day-ambience.mp3'),
    url: 'https://cdn.freesound.org/previews/479/479574_2524442-lq.mp3'
  }
];

async function ensureAsset(asset) {
  try {
    const stat = fs.statSync(asset.path);
    if (stat.size > 0) {
      console.log('Runtime asset ready:', path.relative(root, asset.path));
      return;
    }
  } catch (e) {}

  fs.mkdirSync(path.dirname(asset.path), { recursive: true });
  const tmp = asset.path + '.download';

  console.log('Fetching runtime asset:', path.relative(root, asset.path));
  const response = await fetch(asset.url, {
    redirect: 'follow',
    headers: { 'User-Agent': 'Federal-Electric-build/0.5' }
  });
  if (!response.ok) {
    throw new Error('HTTP ' + response.status + ' for ' + asset.url);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  if (!bytes.length) throw new Error('Empty download for ' + asset.url);

  fs.writeFileSync(tmp, bytes);
  fs.renameSync(tmp, asset.path);
}

(async () => {
  for (const asset of assets) await ensureAsset(asset);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
