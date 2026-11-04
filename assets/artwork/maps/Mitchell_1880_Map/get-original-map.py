#!/usr/bin/env python3
"""Download the ORIGINAL 9664x5944 Mitchell 1880 map to this directory.

Pure Python 3 standard library, no sudo, no browser popup, no installed packages.
Only writes its own files, never touches the Capital & Consequence repo.
"""
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from contextlib import closing
import os
import struct
import tempfile
import zipfile

HERE = Path(__file__).resolve().parent
OUTPUT = HERE / 'mitchell-world-1880.jpg'
SOURCE = ('https://upload.wikimedia.org/wikipedia/commons/c/c6/'
    'Map_of_the_World_on_the_Mercator_projection%2C_exhibiting_the_American_Continent_as_its_centre._Entered_..._1879_by_S._Augustus_'
    '%28IA_dr_map-of-the-world-on-the-mercator-projection-exhibiting-the-american-contin-0586004%29.jpg')
FALLBACK = 'https://archive.org/download/dr_map-of-the-world-on-the-mercator-projection-exhibiting-the-american-contin-0586004/0586004.jpg'
EXPECTED = (9664, 5944)

# Parse JPEG SOF markers without PIL, ImageMagick or a network call.
def jpeg_dimensions(path):
    with open(path, 'rb') as f:
        if f.read(2) != b'\xff\xd8':
            raise ValueError('File is not a JPEG image')
        while True:
            lead = f.read(1)
            if not lead:
                raise ValueError('Could not find JPEG dimensions')
            if lead != b'\xff':
                raise ValueError('Invalid JPEG marker')
            marker = f.read(1)
            while marker == b'\xff':
                marker = f.read(1)
            if not marker:
                raise ValueError('Incomplete JPEG')
            code = marker[0]
            if code == 0xD9 or code == 0xDA:
                raise ValueError('JPEG missing frame header')
            if code in [0x01] + list(range(0xD0, 0xD9)):
                continue
            length = int.from_bytes(f.read(2), 'big')
            if length < 2:
                raise ValueError('Bad JPEG segment')
            if code in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                data = f.read(5)
                if len(data) != 5:
                    raise ValueError('Short JPEG frame')
                return (int.from_bytes(data[3:5], 'big'), int.from_bytes(data[1:3], 'big'))
            f.seek(length-2, 1)


def fetch():
    if OUTPUT.is_file() and jpeg_dimensions(OUTPUT) == EXPECTED:
        print('Full-resolution map already exists:', OUTPUT)
        return
    errors = []
    for url in (SOURCE, FALLBACK):
        name = 'Wikimedia Commons' if url == SOURCE else 'Internet Archive'
        print('Fetching the unmodified original from '+name+'…', flush=True)
        tempname = None
        try:
            req = Request(url, headers={'User-Agent': 'CapitalConsequenceMapFetcher/1.0 (historical-map-personal-download) Mozilla/5.0'})
            with closing(urlopen(req, timeout=90)) as response:
                with tempfile.NamedTemporaryFile(mode='wb', prefix='.mitchell-map-', suffix='.jpg', dir=HERE, delete=False) as out:
                    tempname = Path(out.name)
                    size=0
                    while chunk := response.read(1024*1024):
                        size += len(chunk)
                        if size > 60*1024*1024:
                            raise ValueError('Download exceeds 60 MB safety ceiling')
                        out.write(chunk)
            actual = jpeg_dimensions(tempname)
            if actual != EXPECTED:
                raise ValueError(f'Got {actual[0]} × {actual[1]} pixels, not 9,664 × 5,944')
            tempname.replace(OUTPUT)
            print(f'Verified full scan: {actual[0]} × {actual[1]} pixels, {size:,} bytes')
            print('Ready for the zoomable map:', OUTPUT)
            return
        except (HTTPError, URLError, OSError, ValueError) as exc:
            errors.append(f'{name}: {exc}')
            if tempname and tempname.exists():
                tempname.unlink()
    raise SystemExit('Neither source delivered the original high-resolution JPEG.\n'+'\n'.join(errors))


if __name__ == '__main__':
    fetch()
    # Make a single ZIP for easy upload to GitHub or inclusion in the game.
    bundle = HERE.parent / 'mitchell-world-1880-FULL-resolution-GitHub.zip'
    with zipfile.ZipFile(bundle, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=2) as z:
        for file in sorted(HERE.iterdir()):
            if file.is_file() and file.name != '__pycache__':
                z.write(file, 'mitchell-world-1880/'+file.name)
    print('Upload package:', bundle)
