#!/usr/bin/env bash
# Manual-only Ubuntu build. NEVER create a dist folder or backups.
set -euo pipefail
cd "$(dirname "$0")"
project="$PWD"
for cmd in node npm gcc tar sha256sum; do
  command -v "$cmd" >/dev/null 2>&1 || { printf 'Missing: %s\n' "$cmd" >&2; exit 1; }
done
node -e 'if(Number(process.versions.node.split(".")[0])<22)process.exit(1)'
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
npm install --no-audit --no-fund
npm run prepare:runtime
npm run audit:offline
./node_modules/.bin/electron-builder --linux dir --x64 --publish never "--config.directories.output=$work/pack"
binary="$work/pack/linux-unpacked/capital-consequence"
test -x "$binary" || { echo "Missing compiled Electron binary" >&2; exit 1; }
mv "$binary" "$work/pack/linux-unpacked/capital-consequence-bin"
cat > "$work/launcher.c" <<'EOF'
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
gcc -Wall -Wextra -Werror -O2 -s "$work/launcher.c" -o "$work/pack/linux-unpacked/capital-consequence"
chmod 0755 "$work/pack/linux-unpacked/capital-consequence"
output="$project/Capital & Consequence Standalone"
rm -rf "$output"
mv "$work/pack/linux-unpacked" "$output"
ln -sfn 'Capital & Consequence Standalone/capital-consequence' "$project/Capital & Consequence"
version="$(node -p "require('./package.json').version")"
archive="$project/Capital-and-Consequence-$version-linux-x64.tar.gz"
tar -C "$project" -czf "$archive" "Capital & Consequence Standalone"
sha256sum "$archive" > "$archive.sha256"
printf 'Build complete: %s\nExecutable: %s\n' "$archive" "$project/Capital & Consequence"
