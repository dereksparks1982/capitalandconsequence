#!/usr/bin/env python3
"""Fetch GitHub's current source, preserve the map, and locally build the game.
No Git, sudo, GitHub Actions, AppImage, or second project folder.
"""
import filecmp
import io
import json
import os
import shutil
import subprocess
import sys
import tarfile
import tempfile
import urllib.request
import zipfile
from datetime import datetime
from pathlib import Path, PurePosixPath

ROOT = Path.home() / "DKLab" / "Projects" / "Capital&Consequence"
ARCHIVES = Path.home() / "DKLab" / "Archives"
ZIP_URL = "https://github.com/dereksparks1982/capitalandconsequence/archive/refs/heads/main.zip"
MAPS = {"assets/artwork/maps/title-map-1938.jpg", "assets/title-map-1938.jpg"}


def info(msg):
    print(msg, flush=True)


def fetch(url, output):
    info("Fetching " + url)
    req = urllib.request.Request(url, headers={"User-Agent": "CapitalConsequenceLocalBuilder"})
    with urllib.request.urlopen(req, timeout=120) as incoming, open(output, "wb") as dest:
        shutil.copyfileobj(incoming, dest, length=1024 * 1024)
    if output.stat().st_size < 1024:
        raise RuntimeError("Downloaded archive is empty.")


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
        tgz = temp / (name + ".tar.xz")
        fetch("https://nodejs.org/dist/v22.13.1/" + tgz.name, tgz)
        with tarfile.open(tgz, "r:xz") as package:
            for member in package.getmembers():
                path = PurePosixPath(member.name)
                if path.parts[:1] != (name,) or ".." in path.parts or path.is_absolute():
                    raise RuntimeError("Unexpected Node archive entry")
            try:
                package.extractall(cache, filter="data")
            except TypeError:
                package.extractall(cache)
    if not nodefile.is_file() or not npmfile.is_file():
        raise RuntimeError("Could not prepare local Node.js build tools.")
    env["PATH"] = str(nodefile.parent) + os.pathsep + env.get("PATH", "")
    info("Using portable Node.js v22.13.1 (no system installation).")
    return str(npmfile), env


def prepare_zip(zip_path, staging):
    paths = []
    with zipfile.ZipFile(zip_path) as archive:
        for item in archive.infolist():
            if item.is_dir():
                continue
            parts = PurePosixPath(item.filename).parts[1:]
            if not parts or any(part in (".", "..") for part in parts):
                continue
            if parts[0] in (".git", "node_modules", "resources", "locales", "linux-unpacked", "dist"):
                continue
            rel = "/".join(parts)
            if rel in MAPS and (ROOT / rel).exists():
                continue
            if ((item.external_attr >> 16) & 0o170000) == 0o120000:
                raise RuntimeError("Unexpected symlink in source ZIP: " + rel)
            destination = staging.joinpath(*parts)
            destination.parent.mkdir(parents=True, exist_ok=True)
            with archive.open(item) as source, open(destination, "wb") as output:
                shutil.copyfileobj(source, output, length=1024 * 1024)
            paths.append(rel)
    if not {"index.html", "package.json", "scripts/build-root-linux.cjs"}.issubset(paths):
        raise RuntimeError("GitHub ZIP is missing required game/build files.")
    package = json.loads((staging / "package.json").read_text())
    if package.get("scripts", {}).get("build:root:linux") != "node scripts/build-root-linux.cjs":
        raise RuntimeError("GitHub source lacks the real Linux executable builder.")
    info("Verified GitHub source v" + str(package["version"]) + " (" + str(len(paths)) + " files).")
    return paths


def synchronize(staging, paths, temp):
    changed = []
    for name in paths:
        target = ROOT / name
        if target.is_file() and filecmp.cmp(target, staging / name, shallow=False):
            continue
        if target.is_symlink() or (target.exists() and not target.is_file()):
            raise RuntimeError("Unsafe existing source path: " + str(target))
        changed.append(name)
    old = temp / "old-source"
    replaced = [name for name in changed if (ROOT / name).exists()]
    if replaced:
        ARCHIVES.mkdir(parents=True, exist_ok=True)
        backup = ARCHIVES / ("capital-source-before-build-" + datetime.now().strftime("%Y%m%d-%H%M%S") + ".tar.gz")
        info("Saving original source backup: " + str(backup))
        with tarfile.open(backup, "w:gz") as archive:
            for name in replaced:
                archive.add(ROOT / name, arcname=name, recursive=False)
    installed = []
    try:
        for name in changed:
            target = ROOT / name
            target.parent.mkdir(parents=True, exist_ok=True)
            if target.exists():
                saved = old / name
                saved.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(target, saved)
            os.replace(staging / name, target)
            installed.append(name)
    except BaseException:
        info("Source copy failed; restoring original source.")
        for name in reversed(installed):
            saved = old / name
            target = ROOT / name
            if saved.exists():
                os.replace(saved, target)
            else:
                target.unlink(missing_ok=True)
        raise
    info("Updated " + str(len(changed)) + " source files in the EXISTING project folder.")


def main():
    if sys.platform != "linux":
        raise RuntimeError("This build supports Linux only.")
    if not ROOT.is_dir() or not (ROOT / "index.html").is_file():
        raise RuntimeError("Original project folder not found: " + str(ROOT))
    os.chdir(ROOT)
    info("Building Capital & Consequence in " + str(ROOT))
    with tempfile.TemporaryDirectory(prefix=".capital-local-build-", dir=ROOT) as directory:
        temp = Path(directory)
        npm, env = tools(temp)
        source_zip = temp / "github-main.zip"
        fetch(ZIP_URL, source_zip)
        stage = temp / "stage"
        stage.mkdir()
        paths = prepare_zip(source_zip, stage)
        synchronize(stage, paths, temp)
        env["GIT_TERMINAL_PROMPT"] = "0"
        env["npm_config_audit"] = "false"
        env["npm_config_fund"] = "false"
        info("Installing build dependencies locally.")
        subprocess.run([npm, "install", "--no-audit", "--no-fund"], cwd=ROOT, env=env, check=True)
        info("Building AND smoke-testing real Linux game.")
        subprocess.run([npm, "run", "build:root:linux"], cwd=ROOT, env=env, check=True)
    executable = ROOT / "capitalandconsequence"
    if not executable.is_file() or not os.access(executable, os.X_OK):
        raise RuntimeError("No executable produced; build is not complete.")
    info("SUCCESS: " + str(executable))
    info("Double-click capitalandconsequence in your main project folder.")
    info("This builds locally; pushing the bundled runtime back to GitHub is separate.")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print("BUILD FAILED: " + str(error), file=sys.stderr, flush=True)
        sys.exit(1)
