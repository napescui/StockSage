#!/bin/bash
git branch -M main
git remote set-url origin https://github.com/napescui/stocksage.git

# Tambah semua perubahan, termasuk yang dihapus
git add -A

# Commit perubahan
git commit -m "sync full local to remote"

# Force push ke remote
git push -f origin main
