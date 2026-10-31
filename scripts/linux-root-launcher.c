/* Capital & Consequence Linux x86_64 native entrypoint.
 * A real ELF bootstrap executes the bundled Electron game runtime with
 * --no-sandbox BEFORE Chromium starts, not from Electron's main script.
 * No shell, network, elevated privileges, installers or downloads.
 */
#define _POSIX_C_SOURCE 200809L
#include <errno.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

int main(int argc, char **argv) {
  char path[PATH_MAX];
  ssize_t len = readlink("/proc/self/exe", path, sizeof(path) - 1);
  if (len <= 0 || len >= (ssize_t)sizeof(path) - 1) {
    fprintf(stderr, "Capital & Consequence: cannot locate its game folder.\n");
    return 127;
  }
  path[len] = '\0';
  char *slash = strrchr(path, '/');
  if (slash == NULL) {
    fprintf(stderr, "Capital & Consequence: invalid launch path.\n");
    return 127;
  }
  size_t directory_len = (size_t)(slash - path) + 1;
  const char runtime[] = "capitalandconsequence-runtime";
  if (directory_len + sizeof(runtime) > sizeof(path)) {
    fprintf(stderr, "Capital & Consequence: game path is too long.\n");
    return 127;
  }
  memcpy(path + directory_len, runtime, sizeof(runtime));
  const int sandbox_enabled = getenv("CAPITAL_ENABLE_CHROMIUM_SANDBOX") != NULL &&
    strcmp(getenv("CAPITAL_ENABLE_CHROMIUM_SANDBOX"), "1") == 0;
  const int extra = sandbox_enabled ? 0 : 1;
  char **arguments = calloc((size_t)argc + (size_t)extra + 1, sizeof(*arguments));
  if (!arguments) {
    fprintf(stderr, "Capital & Consequence: out of memory.\n");
    return 127;
  }
  arguments[0] = path;
  if (extra) arguments[1] = (char *)"--no-sandbox";
  for (int i = 1; i < argc; i++) arguments[i + extra] = argv[i];
  arguments[argc + extra] = NULL;
  execv(path, arguments);
  int reason = errno;
  fprintf(stderr, "Capital & Consequence: cannot start bundled game runtime (%s): %s\n",
    path, strerror(reason));
  free(arguments);
  return reason == ENOENT ? 127 : 126;
}
