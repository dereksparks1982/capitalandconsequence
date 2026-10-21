#!/usr/bin/env bash
# Build the same 1890 Linux desktop candidate locally when GitHub artifact storage is unavailable.
set -euo pipefail
cd "$(dirname "$0")"

for cmd in node npm gcc tar sha256sum; do
  command -v "$cmd" >/dev/null 2>&1 || { printf 'Missing required command: %s\n' "$cmd" >&2; exit 1; }
done

node -e 'if (Number(process.versions.node.split(".")[0]) < 22) { console.error("Federal Electric requires Node.js 22 or newer to package."); process.exit(1); }'

npm install --no-audit --no-fund
npm run prepare:runtime
npm run audit:offline
npm run pack:linux

binary="dist/linux-unpacked/federal-electric"
test -x "$binary" || { echo "Missing Electron binary after packaging." >&2; exit 1; }
mv "$binary" "dist/linux-unpacked/federal-electric-bin"

cat > /tmp/federal-electric-1890-launcher.c <<'EOF'
#define _GNU_SOURCE
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
int main(int argc, char **argv) {
  char self[PATH_MAX];
  ssize_t n=readlink("/proc/self/exe",self,sizeof(self)-1);
  if(n<0){perror("Federal Electric launcher");return 1;}
  self[n]='\0';
  char *slash=strrchr(self,'/');
  if(!slash)return 1;
  *slash='\0';
  char target[PATH_MAX];
  if(snprintf(target,sizeof(target),"%s/federal-electric-bin",self)>=(int)sizeof(target))return 1;
  char **next=calloc((size_t)argc+2,sizeof(char*));
  if(!next)return 1;
  next[0]=target;next[1]="--no-sandbox";
  for(int i=1;i<argc;i++)next[i+1]=argv[i];
  next[argc+1]=NULL;
  execv(target,next);
  perror("Federal Electric");
  free(next);
  return 1;
}
EOF

gcc -Wall -Wextra -Werror -O2 -s /tmp/federal-electric-1890-launcher.c -o "$binary"
chmod 0755 "$binary"
ln -sfn federal-electric "dist/linux-unpacked/Federal Electric"
rm -rf "dist/Federal Electric Standalone"
mv dist/linux-unpacked "dist/Federal Electric Standalone"

archive="dist/Federal-Electric-0.6.4-linux-x64.tar.gz"
tar -C dist -czf "$archive" "Federal Electric Standalone"
(cd dist && sha256sum "Federal-Electric-0.6.4-linux-x64.tar.gz" > "Federal-Electric-0.6.4-linux-x64.tar.gz.sha256")

printf '\nBuild complete: %s\nSHA-256: %s.sha256\n' "$archive" "$archive"
printf 'To launch: extract the archive and double-click Federal Electric.\n'
