'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8');
const main=read('desktop/main.cjs'),runner=read('scripts/build-root-linux.cjs'),
 updater=read('scripts/build-from-github.py'),native=read('scripts/linux-root-launcher.c');
assert(main.includes("const sixCareerTest=await win.webContents.executeJavaScript("));
assert(main.includes("expectedCareerIds=['industrialist','investigator','criminal','wardman','proprietor','mariner']"));
assert(!main.includes("fourCareerTest")&&!main.includes("routeCount!==4"),
 'Packaged Electron startup may never reject the approved six-character roster');
assert(main.includes('fairPublicApproachAvailable')&&
       main.includes('fairEventLockedBefore1878')&&
       main.includes('fairEventEligibleLate1878'),
 'Native smoke must test both open mapped approach and the protected late-1878 Fair event');
assert(!main.includes("notice.textContent.includes('1893')"),
 'A superseded 1893 exposition date must not invalidate packaged startup');
assert(native.includes('"--disable-vulkan"')&&native.includes('"--disable-features=Vulkan,VulkanFromANGLE,DefaultANGLEVulkan"'),
 'Native graphics fix must reach Chromium before Electron JavaScript starts');
assert(!native.includes('ozone-platform=x11'),
 'Native Wayland must not be replaced by a compatibility-only forced X11 backend');
const smoke=runner.indexOf('try{smoke(dir)}'),install=runner.indexOf('install(dir);');
assert(smoke>0&&install>smoke,'Packaged smoke must precede installing root executable');
assert(runner.includes('throw Error(\'PACKAGED SMOKE FAILED: existing installed game preserved.'),
 'Smoke failures must abort installation without replacing the existing game');
assert(!runner.includes('clean-project.py'),
 'Normal update must not archive or relocate any owner files');
assert(!runner.includes('process.exitCode=2;'),
 'The GitHub ZIP size limit is not a local native game failure');
assert(updater.includes('if result.returncode != 0:'),
 'Updater must not accept failed smoke or any nonzero native build');
console.log('PASS six-character native smoke, no manual Vulkan arguments, mandatory acceptance, no automatic archives');
assert(main.includes('remoteOfficeTeleportBlocked=returned===false'),
 'Packaged navigation must reject unauthorized zero-time return to distant office');
assert(!main.includes('context.officeRestored='),
 'Removed old travel-bypass expectation cannot reappear in packaged checks');

assert(main.includes('show:SMOKE_TEST'),'CI smoke window must map under native Wayland for animation frame callbacks');
assert(main.includes('backgroundThrottling:!(SMOKE_TEST||GRAPHICS_BOOT_TEST)'),
 'Both test windows must keep Chromium animations and initialization active');

assert(main.includes("const GRAPHICS_BOOT_TEST = process.argv.includes('--graphics-smoke')"),
 'Wayland-focused smoke mode must be independent of full animated gameplay smoke');
assert(main.includes("console.log('CAPITAL_WAYLAND_BOOT_OK')"),
 'Native Wayland renderer boot must acknowledge success explicitly');
assert(main.includes("!view.butcherUiReady"),
 'Wayland boot verifies the real Crowe shop UI rather than only its JavaScript syntax');
assert(main.includes('show:SMOKE_TEST||GRAPHICS_BOOT_TEST'),
 'Native Wayland test must map its compositor window');
