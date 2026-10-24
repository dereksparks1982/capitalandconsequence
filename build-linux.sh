#!/usr/bin/env bash
# Manual-only Linux packaging; source CI never creates or accepts desktop candidates.
set -euo pipefail
cd "$(dirname "$0")"

for cmd in node npm gcc tar sha256sum; do
  command -v "$cmd" >/dev/null 2>&1 || { printf 'Missing required command: %s\n' "$cmd" >&2; exit 1; }
done

node -e 'if (Number(process.versions.node.split(".")[0]) < 22) { console.error("Capital & Consequence requires Node.js 22 or newer to package."); process.exit(1); }'

npm run test:source
npm install --no-audit --no-fund
npm run prepare:runtime
npm run audit:offline
npm run pack:linux

binary="dist/linux-unpacked/capital-consequence"
test -x "$binary" || { echo "Missing Electron binary after packaging." >&2; exit 1; }
mv "$binary" "dist/linux-unpacked/capital-consequence-bin"

cat > /tmp/capital-consequence-launcher.c <<'EOF'
#define _GNU_SOURCE
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
int main(int argc, char **argv) {
  char self[PATH_MAX];
  ssize_t n=readlink("/proc/self/exe",self,sizeof(self)-1);
  if(n<0){perror("Capital & Consequence launcher");return 1;}
  self[n]='\0';
  char *slash=strrchr(self,'/');
  if(!slash)return 1;
  *slash='\0';
  char target[PATH_MAX];
  if(snprintf(target,sizeof(target),"%s/capital-consequence-bin",self)>=(int)sizeof(target))return 1;
  char **next=calloc((size_t)argc+2,sizeof(char*));
  if(!next)return 1;
  next[0]=target;next[1]="--no-sandbox";
  for(int i=1;i<argc;i++)next[i+1]=argv[i];
  next[argc+1]=NULL;
  execv(target,next);
  perror("Capital & Consequence");
  free(next);
  return 1;
}
EOF

gcc -Wall -Wextra -Werror -O2 -s /tmp/capital-consequence-launcher.c -o "$binary"
chmod 0755 "$binary"
ln -sfn capital-consequence "dist/linux-unpacked/Capital & Consequence"
rm -rf "dist/Capital & Consequence Standalone"
mv dist/linux-unpacked "dist/Capital & Consequence Standalone"

archive="dist/Capital-and-Consequence-0.6.85-linux-x64.tar.gz"
tar -C dist -czf "$archive" "Capital & Consequence Standalone"
(cd dist && sha256sum "Capital-and-Consequence-0.6.85-linux-x64.tar.gz" > "Capital-and-Consequence-0.6.85-linux-x64.tar.gz.sha256")

printf '\nBuild complete: %s\nSHA-256: %s.sha256\n' "$archive" "$archive"
printf 'To launch: extract the archive and double-click Capital & Consequence.\n'
