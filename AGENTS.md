# Repository Guidelines

## Project Structure & Module Organization
- Root files are small, standalone automations and scripts.
- `luci_presenza.yaml` is the Home Assistant blueprint.
- `luci_presenza` is a concrete automation example derived from the blueprint.
- `tv-on.sh`, `tv-off.sh`, `tv-on.js`, and `tv-screensaver.py` are helper scripts for TV control and screensaver integration.

## Build, Test, and Development Commands
- No build system is defined; changes are edited directly.
- Example local runs:
  - `node tv-on.js` to set the TV input.
  - `node tv-off.sh` to power off the TV via IP control.
  - `bash tv-on.sh` to wake the TV and set input (uses `wakeonlan`).
  - `python3 tv-screensaver.py` to listen for GNOME screensaver events.

## Coding Style & Naming Conventions
- YAML uses 2-space indentation.
- Shell scripts are Bash with `#!/bin/bash`.
- Node scripts use CommonJS (`require`) and async/await.
- Python scripts follow standard PEP 8 layout; keep functions short and explicit.
- Use descriptive Italian names when matching existing entities (e.g., `luci_presenza`, `luminosita_pensili_cucina`).

## Testing Guidelines
- No automated tests or frameworks are present.
- Validate changes by running the relevant script or importing the blueprint into Home Assistant.
- For automations, confirm entity IDs match your HA instance before deploying.

## Commit & Pull Request Guidelines
- Commit messages are short and descriptive, often in Italian or English without a strict convention (e.g., `HAOS e TV`, `Update blueprint name...`).
- Prefer one logical change per commit.
- PRs should describe the automation or script change, list affected entities, and note any required dependencies (e.g., `lgtv-ip-control`, `wakeonlan`).

## Configuration & Environment Notes
- TV control scripts assume a fixed IP, MAC, and PIN inside the files; update these for new environments.
- `tv-screensaver.py` expects GNOME and `gi` bindings available on the host.
