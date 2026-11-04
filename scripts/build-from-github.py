#!/usr/bin/env python3
"""Update the EXISTING Ubuntu game directory directly from verified GitHub blobs.
No Git authentication, source ZIP, backup copies, duplicated project folder or sudo.
Every changed file is staged and hash-checked before any installed source is replaced.
"""
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tarfile
import tempfile
import urllib.parse
import urllib.request
from pathlib import Path, PurePosixPath

ROOT = Path.home() / "DKLab" / "Projects" / "Capital&Consequence"
TREE_URL = "https://api.github.com/repos/dereksparks1982/capitalandconsequence/git/trees/main?recursive=1"
RAW_URL = "https://raw.githubusercontent.com/dereksparks1982/capitalandconsequence/"
KEEP_LOCAL = {"assets/artwork/maps/title-map-1938.jpg", "assets/title-map-1938.jpg"}
SKIP_DIRS = {".git", "node_modules", "resources", "locales", "linux-unpacked", "dist"}
REQUIRED = {"index.html", "package.json", "scripts/build-root-linux.cjs"}

def info(msg):
    print(msg, flush=True)

def fetch(url, output):
    req = urllib.request.Request(url, headers={"User-Agent": "CapitalConsequenceLocalBuilder"})
    with urllib.request.urlopen(req, timeout=120) as incoming, open(output, "wb") as dest:
        shutil.copyfileobj(incoming, dest, length=1024 * 1024)

def source_manifest():
    req = urllib.request.Request(TREE_URL, headers={
        "User-Agent": "CapitalConsequenceLocalBuilder",
        "Accept": "application/vnd.github+json"
    })
    with urllib.request.urlopen(req, timeout=120) as response:
        payload = json.load(response)
    if payload.get("truncated") or not isinstance(payload.get("tree"), list):
        raise RuntimeError("GitHub's source manifest was incomplete; installed files were not changed.")
    sha = payload.get("sha")
    if not isinstance(sha, str) or len(sha) != 40:
        raise RuntimeError("GitHub returned no valid source tree identity.")
    files = {}
    for entry in payload["tree"]:
        name = entry.get("path", "")
        parts = PurePosixPath(name).parts
        if (not parts or name.startswith("/") or any(p in (".", "..") for p in parts)
                or any(p in SKIP_DIRS for p in parts)):
            continue
        if entry.get("type") == "blob" and entry.get("mode") == "120000":
            raise RuntimeError("Unexpected tracked symlink: " + name)
        if entry.get("type") != "blob":
            continue
        if entry.get("mode") not in ("100644", "100755"):
            raise RuntimeError("Unexpected source type: " + name)
        if not isinstance(entry.get("sha"), str) or len(entry["sha"]) != 40:
            raise RuntimeError("Invalid source hash: " + name)
        files[name] = {"sha": entry["sha"], "size": entry["size"]}
    if not REQUIRED.issubset(files):
        raise RuntimeError("Required game/build files are missing from GitHub.")
    info("Verified source manifest: " + str(len(files)) + " tracked files.")
    return files

def git_blob_sha(path):
    size = path.stat().st_size
    digest = hashlib.sha1(b"blob " + str(size).encode("ascii") + b"\0")
    with open(path, "rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()

def safe_target(name):
    dest = ROOT / name
    parent = dest.parent
    while parent != ROOT:
        if parent.is_symlink() or (parent.exists() and not parent.is_dir()):
            raise RuntimeError("Unsafe existing source directory: " + str(parent))
        parent = parent.parent
    if dest.is_symlink() or (dest.exists() and not dest.is_file()):
        raise RuntimeError("Unsafe existing source path: " + str(dest))
    return dest

def stage_changes(manifest, staging):
    changed = []
    for name, entry in manifest.items():
        target = safe_target(name)
        if name in KEEP_LOCAL and target.exists():
            continue
        if target.is_file() and git_blob_sha(target) == entry["sha"]:
            continue
        changed.append(name)
    info("Fetching " + str(len(changed)) + " changed source files (no repository archive).")
    for index, name in enumerate(changed, 1):
        entry = manifest[name]
        destination = staging / name
        destination.parent.mkdir(parents=True, exist_ok=True)
        # A tree SHA cannot be used as a raw.githubusercontent.com revision;
        # main is hash-checked against the frozen manifest before installation.
        raw = RAW_URL + "main/" + urllib.parse.quote(name, safe="/")
        fetch(raw, destination)
        if destination.stat().st_size != entry["size"] or git_blob_sha(destination) != entry["sha"]:
            raise RuntimeError("GitHub file changed during download: " + name + "; nothing was installed.")
        if index % 50 == 0:
            info("Verified " + str(index) + " source files.")
    return changed

def synchronize(staging, changed):
    # No rollback copies by owner request. Full verification happens FIRST.
    for name in changed:
        target = safe_target(name)
        target.parent.mkdir(parents=True, exist_ok=True)
        os.replace(staging / name, target)
    info("Updated " + str(len(changed)) + " files in the EXISTING project directory.")

def tools(temp):
    env = os.environ.copy()
    node, npm = shutil.which("node"), shutil.which("npm")
    if node and npm:
        try:
            major = int(subprocess.check_output([node, "--version"], text=True, timeout=15).strip()[1:].split(".")[0])
            if major >= 20:
                return npm, env
        except (ValueError, OSError, subprocess.SubprocessError):
            pass
    name = "node-v22.13.1-linux-x64"
    cache = Path.home() / ".cache" / "capitalandconsequence" / "build-tools"
    nodefile = cache / name / "bin" / "node"
    npmfile = cache / name / "bin" / "npm"
    if not nodefile.is_file() or not npmfile.is_file():
        cache.mkdir(parents=True, exist_ok=True)
        archive = temp / (name + ".tar.xz")
        fetch("https://nodejs.org/dist/v22.13.1/" + archive.name, archive)
        with tarfile.open(archive, "r:xz") as package:
            for member in package.getmembers():
                path = PurePosixPath(member.name)
                if path.parts[:1] != (name,) or ".." in path.parts or path.is_absolute():
                    raise RuntimeError("Unexpected Node tool entry")
            try:
                package.extractall(cache, filter="data")
            except TypeError:
                package.extractall(cache)
    if not nodefile.is_file() or not npmfile.is_file():
        raise RuntimeError("Could not prepare portable Node.js.")
    env["PATH"] = str(nodefile.parent) + os.pathsep + env.get("PATH", "")
    info("Using portable Node.js v22.13.1.")
    return str(npmfile), env

def main():
    if sys.platform != "linux":
        raise RuntimeError("This update supports Linux only.")
    if not ROOT.is_dir() or not (ROOT / "index.html").is_file():
        raise RuntimeError("Original project folder not found: " + str(ROOT))
    os.chdir(ROOT)
    info("Updating Capital & Consequence in " + str(ROOT))
    manifest = source_manifest()
    with tempfile.TemporaryDirectory(prefix=".capital-local-build-", dir=ROOT) as directory:
        temp = Path(directory)
        npm, env = tools(temp)
        staging = temp / "stage"
        staging.mkdir()
        changed = stage_changes(manifest, staging)
        package_file = staging / "package.json" if "package.json" in changed else ROOT / "package.json"
        package = json.loads(package_file.read_text(encoding="utf-8"))
        if package.get("scripts", {}).get("build:root:linux") != "node scripts/build-root-linux.cjs":
            raise RuntimeError("GitHub source lacks the actual Linux executable builder.")
        info("Verified GitHub version " + str(package.get("version", "unknown")) + ".")
        synchronize(staging, changed)
        # Source QA follows the SHA-verified GitHub source tree, not obsolete
        # tests retained locally from previously deleted tracked files.
        # Never delete or overwrite untracked local tests.
        tracked_tests = sorted(name.removeprefix("tests/") for name in manifest
                               if name.startswith("tests/") and name.endswith(".cjs")
                               and name != "tests/run-all.cjs")
        if not tracked_tests or "merchant-mitchell-chart.cjs" not in tracked_tests:
            raise RuntimeError("Tracked source-test list is incomplete.")
        registered = safe_target("tests/.github-managed-tests.json")
        temp_manifest = temp / "managed-tests.json"
        temp_manifest.write_text(json.dumps(tracked_tests, indent=2)+"\\n", encoding="utf-8")
        registered.parent.mkdir(parents=True, exist_ok=True)
        os.replace(temp_manifest, registered)
        info("Registered " + str(len(tracked_tests)) + " current GitHub source tests.")
        env["GIT_TERMINAL_PROMPT"] = "0"
        env["npm_config_audit"] = "false"
        env["npm_config_fund"] = "false"
        info("Installing dependencies locally.")
        subprocess.run([npm, "install", "--no-audit", "--no-fund"], cwd=ROOT, env=env, check=True)
        info("Building and smoke-testing the existing Linux game.")
        result = subprocess.run([npm, "run", "build:root:linux"], cwd=ROOT, env=env, check=False)
        if result.returncode not in (0, 2):
            raise RuntimeError("Linux game build or smoke test failed (" + str(result.returncode) + ").")
        if result.returncode == 2:
            info("WARNING: Native build reported a nonfatal distribution validation warning.")
    executable = ROOT / "capitalandconsequence"
    if not executable.is_file() or not os.access(executable, os.X_OK):
        raise RuntimeError("No executable produced.")
    info("SUCCESS: " + str(executable))
    info("Launch the existing capitalandconsequence executable from your project directory.")

if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print("UPDATE FAILED: " + str(error), file=sys.stderr, flush=True)
        sys.exit(1)
