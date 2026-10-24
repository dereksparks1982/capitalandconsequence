# One-time cleanup of superseded failed Capital & Consequence Source QA runs

The active v0.6.88 source suite passed in GitHub Actions run 40069611982. Prior failed runs from old, now-fixed source commits produce pages of obsolete red activity. Delete only these historical failed Source QA *run records* dated before that pass. Preserve all successful run history, Linux packaging failures for diagnosis, commits, artifacts, releases, backups, and source files. This is an explicitly owner-authorized cleanup. The temporary request and workflow must be removed afterward.
