# Capital & Consequence 0.7.39-dev | Install the entire current game in place

Eli's fourth chapter, Debts Come Due, adds three nights of witnessed action and three choices: settle a contested $3 debt, refuse, or disclose the dispute to the nightclub manager.

The former build-linux.sh updated only six old source files inside the installed game and did not include the new story systems. The replacement updates all root JavaScript/HTML/CSS, desktop runtime entry files, package and legal text, bundled media, audio and vendor resources inside the existing resources/app.asar. It first validates every local renderer script reference, builds a candidate ASAR in temporary storage, verifies all critical packed files against the repository and atomically replaces just the app.asar.

This preserves the root-level executable at Capital&Consequence/capital-consequence and does not create a new launcher, second project folder, dist directory, or request GitHub Actions or credentials. The original map artwork is not edited.

On the user's Ubuntu desktop, apply with:
`cd "$HOME/DKLab/Projects/Capital&Consequence" && GIT_TERMINAL_PROMPT=0 git pull --ff-only origin main && bash build-linux.sh`

The existing local @electron/asar Node package is required. The GitHub connector cannot itself write into the user's private Ubuntu filesystem. Graphical Linux acceptance remains to be done after the local installation.
