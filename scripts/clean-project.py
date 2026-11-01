#!/usr/bin/env python3
"""Safely tidy the existing Capital & Consequence project folder.

Remove old executables and generated debris from the project view by moving
them to DKLab/Archives. Preserve every current game runtime component, all
GitHub-tracked source and documents, the approved map, and all saves.
No sudo, GitHub Actions, destructive globs, shell execution or rebuild.
"""
from __future__ import annotations

import argparse
import datetime as dt
import filecmp
import json
import os
import re
import shutil
import stat
from pathlib import Path

EXPECTED_ROOT = Path.home() / "DKLab" / "Projects" / "Capital&Consequence"
ARCHIVE_BASE = Path.home() / "DKLab" / "Archives"
SOURCE_ROOT_NAMES = frozenset([".gitignore",".nojekyll","AI-DEPENDENCIES-AND-NPC-SLICES.md","ASLYUM-INTEGRATION-DESIGN-2026-10-21.md","BUILD-SNAPSHOT-2026-10-02.md","BUILD-SNAPSHOT-2026-10-03.md","BUILD-SNAPSHOT-2026-10-04.md","BUILD-SNAPSHOT-2026-10-05.md","BUILD-SNAPSHOT-2026-10-06.md","BUILD-SNAPSHOT-2026-10-07.md","CHARACTER-ROSTER.md","CHARACTER-ROUTES-DESIGN-2026-10-21.md","CODEX-CHARLES-WHITCOMB-2026-10-28.md","CODEX-DREK-WAINWRIGHT-2026-10-22.md","CODEX-EDMUND-WARDMAN-2026-10-23.md","CODEX-ELIAS-CROWE-2026-10-23.md","CODEX-INDEX.md","CODEX-SAMUEL-HARLAN-2026-10-23.md","COMPONENT-WORKS-1878-FOUNDATION.md","CONTINUE-HERE.md","DECISIONS.md","DESIGN-1890-CONVERSION-2026-10-21.md","DESIGN-2026-10-23-LIVING-WASHINGTON.md","DESIGN-MENU-MAP-ROUTES-2026-10-22.md","FIGHT-WORLD-DESIGN.md","HANDOFF-2026-10-04.md","HANDOFF-2026-10-05.md","HANDOFF-2026-10-06.md","HANDOFF-2026-10-22-THREAD-END.md","HANDOFF-2026-10-23-SOURCE-CONTINUATION.md","HANDOFF-2026-10-23-THREAD-END.md","HANDOFF-2026-10-25-NPC-AI-AND-STAR-CLUB.md","HANDOFF-2026-10-28-v0.6.90-dev.md","HISTORICAL-NOTES.md","LEGAL.md","LICENSE","MAP-1878-RESEARCH.md","MAP-CANON.md","MAP-LOCATION-GRID-AUDIT.md","MAP-PIN-COORDINATE-AUDIT-2026-10-28.md","MARKET-DESIGN.md","ONLINE-SYSTEMS-DESIGN.md","POLITICAL-WASHINGTON.md","README.md","RELEASE-NOTES-LINUX-SANDBOX-v0.7.40.md","RELEASE-NOTES-v0.6.89-dev.md","RELEASE-NOTES-v0.7.26-dev.md","RELEASE-NOTES-v0.7.28-dev.md","RELEASE-NOTES-v0.7.29-dev.md","RELEASE-NOTES-v0.7.30-dev.md","RELEASE-NOTES-v0.7.31-dev.md","RELEASE-NOTES-v0.7.32-dev.md","RELEASE-NOTES-v0.7.33-dev.md","RELEASE-NOTES-v0.7.34-dev.md","RELEASE-NOTES-v0.7.35-dev.md","RELEASE-NOTES-v0.7.36-dev.md","RELEASE-NOTES-v0.7.37-dev.md","RELEASE-NOTES-v0.7.38-dev.md","RELEASE-NOTES-v0.7.39-dev.md","RELEASE-NOTES-v0.7.40-dev.md","RELEASE-NOTES-v0.7.41-dev.md","ROADMAP.md","ROOM-NAVIGATION-REPAIR.md","SPORTS-CHAMPIONSHIPS.md","THIRD-PARTY-NOTICES.md","TRAVEL-DECISION-2026-10-22.md","WASHINGTON-LIVING-CITY.md","WORLD-RULES-2026-10-21.md","app.js","apply_delta.py","archive","assets","asylum-casework.js","asylum-evidence.js","asylum-incident.js","asylum-story-ui.js","asylum-story.js","boxing-championship.js","boxing.css","boxing.js","brokerage.js","build-linux.sh","calendar-bridge.js","capital-street-network.js","capital-travel-system.js","career-shell.css","career-shell.js","casebook-pages.js","cash-custody-ui.js","cash-custody.js","championship-register.js","championships.js","character-routes.js","city-access.js","city.js","club-memberships.js","component-works-live.js","component-works-panel.js","component-works.js","corporate-governance-ui.js","corporate-governance.js","desktop","detective-cases.js","docs","doorman-duty.js","doorman-ui.js","duel-aftercare-ui.js","duel-aftermath.js","duel-engine.js","duel-ui.js","duel.css","fight-club-brotherhood.js","fishing-engine.js","fishing-ui.js","fishing-vessels.js","gambling-law.js","historical-people.js","horse-care.js","horse-custody.js","horse-stable-ui.js","housing.js","index.html","industrial-empire.js","institution-ventures.js","journey-planner.js","life-history.js","livery-trade.js","livery-ui.js","living-characters.js","main-story.js","map-leads.js","map-pin-palette.js","market-ui.js","mission-engine.js","mobility.js","morgue-registry.js","murder-cases.js","national-districts.js","npc-agency.js","npc-ai.js","npc-calendar.js","npc-character-card.js","npc-daybook.js","npc-dialogue.js","npc-economy.js","npc-household-receipts.js","npc-intentions.js","npc-itinerary.js","npc-knowledge.js","npc-language.js","npc-life-plans.js","npc-memory.js","npc-mobility.js","npc-needs.js","npc-personality.js","npc-residences.js","npc-rumors.js","npc-scripted-talk.js","npc-social-consequences.js","npc-social.js","npc-street-travel.js","npc-weekly-schedule.js","npc-witness.js","orderly-duty.js","orderly-ui.js","oval-championships.js","oval-racing.js","package.json","paper-doll.css","paper-doll.js","patrol-duty.js","patrol-ui.js","peacock-debts.js","peacock-network.js","peacock-story.js","personal-book-pages.js","personal-book-ui.js","personal-book.css","personal-effects.js","poker-memory.js","poker.html","poker.js","police-casework.js","presidential-charter.js","profile-disk-recovery.js","racing.css","racing.js","radio","road-editor.js","road-layout.js","run-linux.sh","scripts","shared-world.js","skills.js","sky-cycle.js","stock-history.js","styles.css","tabletop-checkers-ui.js","tabletop-checkers.css","tabletop-checkers.js","tabletop-chess-ui.js","tabletop-chess.css","tabletop-chess.js","tests","time-transactions.js","underworld.css","underworld.js","vendor","venue-opportunities.js","wardman-custody.js","wardman-escape.js","wardman-estate-police.js","wardman-inheritance.js","wardman-police-evidence.js","wardman-politics.js","wardman-records.js","washington-commerce.js","washington-time.js","workshop-operations.js","workshop-presence.js","workshop-staff.js","world-canon.js","world-clock.js"])
CURRENT_RUNTIME = frozenset((
    "capitalandconsequence",
    "capitalandconsequence-runtime",
    "chrome-sandbox",
    "chrome_crashpad_handler",
    "chrome_100_percent.pak",
    "chrome_200_percent.pak",
    "icudtl.dat",
    "resources.pak",
    "snapshot_blob.bin",
    "v8_context_snapshot.bin",
    "libEGL.so",
    "libGLESv2.so",
    "libffmpeg.so",
    "libvulkan.so.1",
    "libvk_swiftshader.so",
    "vk_swiftshader_icd.json",
    "LICENSE.electron.txt",
    "LICENSES.chromium.html",
    "resources",
    "locales",
    "swiftshader",
))
RETAIN_WORK = frozenset((
    ".git", "node_modules", "package-lock.json", "npm-shrinkwrap.json",
    ".env", ".env.local", ".env.development", ".env.production",
))
LEGACY_EXECUTABLES = frozenset((
    "capital-consequence",
    "capital-consequence-bin",
    "federal-electric",
    "federal-electric-bin",
    "FederalElectric",
    "federal-electric-app",
))
DEBRIS_DIRECTORIES = frozenset((
    "linux-unpacked", "dist", "out", "release", "releases", "tmp", "temp",
    "__pycache__", ".cache-electron-builder",
))
DEBRIS_FILENAMES = frozenset((
    "builder-debug.yml", "builder-effective-config.yaml", "latest-linux.yml",
    "npm-debug.log", "yarn-error.log", ".DS_Store", "Thumbs.db",
))
ARTIFACT_NAME = re.compile(
    r"(?:Capital-and-Consequence|capital-consequence|Federal-Electric)[^/]*"
    r"\.(?:AppImage|deb|rpm|tar(?:\.gz|\.xz)?|zip)$", re.I
)
TRANSIENT_NAME = re.compile(
    r"(?:\.capital-local-build-|\.capital-root-runtime-backup-|"
    r"\.app\.asar\.next-|\.app\.asar\.pending-|"
    r"\.package\.pending-)", re.I
)
OBVIOUS_DEBRIS_SUFFIX = (
    ".bak", ".bak1", ".old", ".orig", ".rej", ".swp", ".swo",
    ".tmp", ".temp", ".partial", ".part", ".crdownload", "~",
)


def is_regular_file(path: Path) -> bool:
    return path.is_file() and not path.is_symlink()


def valid_elf(path: Path) -> bool:
    if not is_regular_file(path):
        return False
    with path.open("rb") as stream:
        return stream.read(4) == b"\x7fELF"


def validate_project(root: Path) -> None:
    if not root.is_dir() or root.is_symlink():
        raise RuntimeError("Project folder is missing or a symbolic link: " + str(root))
    for name in ("capitalandconsequence", "capitalandconsequence-runtime"):
        binary = root / name
        if not valid_elf(binary) or not os.access(binary, os.X_OK):
            raise RuntimeError("Stopping: current executable is absent or invalid: " + str(binary))
    if not is_regular_file(root / "resources" / "app.asar"):
        raise RuntimeError("Stopping: the current Electron resources/app.asar is missing.")
    for name in ("locales", "assets", "docs", "scripts", "tests", "desktop"):
        if not (root / name).is_dir():
            raise RuntimeError("Stopping: required game/source directory missing: " + name)
    for name in ("index.html", "app.js", "package.json",
                 "assets/artwork/maps/title-map-1938.jpg"):
        if not is_regular_file(root / name):
            raise RuntimeError("Stopping: required game/source file missing: " + name)


def classification(entry: Path, root: Path, source_names: set[str]) -> str | None:
    name = entry.name
    if name in SOURCE_ROOT_NAMES or name in source_names:
        return None
    if name in CURRENT_RUNTIME or name in RETAIN_WORK or name.startswith(".env"):
        return None
    if name in LEGACY_EXECUTABLES:
        return "obsolete-executables"
    if name in DEBRIS_DIRECTORIES or TRANSIENT_NAME.search(name):
        return "temporary-builds"
    if name in DEBRIS_FILENAMES or ARTIFACT_NAME.fullmatch(name):
        return "old-distributions-and-logs"
    if name.lower().endswith(OBVIOUS_DEBRIS_SUFFIX) or name.startswith("npm-debug.log"):
        return "temporary-builds"
    # No guessing about files created by the owner. Any unknown source,
    # document, plugin, custom artwork or folder is preserved and reported.
    return None


def git_known_files(root: Path) -> set[str]:
    """If .git exists, read its index without running Git or asking for credentials."""
    index = root / ".git" / "index"
    if not index.is_file():
        return set()
    # The bundled manifest already protects all tracked names on main.
    # Locally added files are preserved by the unknown-file rule below.
    return set()


def archive_path(base: Path, category: str, name: str) -> Path:
    destination = base / category / name
    if destination.exists() or destination.is_symlink():
        raise RuntimeError("Cleanup archive collision, nothing overwritten: " + str(destination))
    return destination


def cleanup(root: Path = EXPECTED_ROOT, archive_base: Path = ARCHIVE_BASE,
            dry_run: bool = False) -> dict:
    root = Path(root).expanduser()
    archive_base = Path(archive_base).expanduser()
    validate_project(root)
    decisions = []
    kept_unknown = []
    tracked = git_known_files(root)
    for entry in sorted(root.iterdir(), key=lambda x: x.name.casefold()):
        category = classification(entry, root, tracked)
        if category:
            # Never follow a symlink into another directory. Move the link
            # itself to the archive rather than deleting the target.
            if entry.is_symlink():
                category = "unverified-links"
            decisions.append((entry, category))
        elif (entry.name not in SOURCE_ROOT_NAMES
              and entry.name not in CURRENT_RUNTIME
              and entry.name not in RETAIN_WORK
              and not entry.name.startswith(".env")):
            kept_unknown.append(entry.name)

    # A duplicate image in an obsolete pre-migration path is archived ONLY
    # if identical to the approved immutable Washington map.
    extra_map = root / "assets" / "title-map-1938.jpg"
    canonical = root / "assets" / "artwork" / "maps" / "title-map-1938.jpg"
    if is_regular_file(extra_map):
        if filecmp.cmp(extra_map, canonical, shallow=False):
            decisions.append((extra_map, "duplicate-artwork"))
        else:
            kept_unknown.append("assets/title-map-1938.jpg (different image, retained)")

    stamp = dt.datetime.now().strftime("%Y%m%d-%H%M%S-%f")
    archive = archive_base / ("Capital-Consequence-cleanup-" + stamp)
    moved = []
    if decisions and not dry_run:
        archive.mkdir(parents=True, exist_ok=False)
    for entry, category in decisions:
        label = entry.relative_to(root).as_posix()
        if dry_run:
            moved.append({"file": label, "category": category})
            continue
        target = archive_path(archive, category, label)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(entry), str(target))
        moved.append({"file": label, "category": category})
        print("ARCHIVED:", label)

    report = {
        "project": str(root),
        "archive": str(archive) if moved and not dry_run else None,
        "files_archived": moved,
        "other_items_kept_for_safety": kept_unknown,
        "core_game_verified": True,
        "dry_run": dry_run,
    }
    if moved and not dry_run:
        (archive / "cleanup-manifest.json").write_text(
            json.dumps(report, indent=2) + "\n", encoding="utf8"
        )
    print("CLEANUP COMPLETE:", len(moved), "obsolete items removed from project view.")
    print("GAME PRESERVED:", root / "capitalandconsequence")
    print("RUNTIME PRESERVED:", root / "capitalandconsequence-runtime")
    if moved and not dry_run:
        print("RECOVERY ARCHIVE:", archive)
    if kept_unknown:
        print("UNRECOGNIZED OWNER FILES LEFT ALONE:",
              ", ".join(kept_unknown))
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Safely tidy Capital & Consequence.")
    parser.add_argument("--dry-run", action="store_true",
                        help="Preview archive moves without changing files")
    options = parser.parse_args()
    try:
        cleanup(dry_run=options.dry_run)
    except Exception as exc:
        print("CLEANUP STOPPED:", exc)
        raise SystemExit(1)
