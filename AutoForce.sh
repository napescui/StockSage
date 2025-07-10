#!/bin/bash

# Rename branch jadi main (kalau belum)
git branch -M main

# Atur remote ke repo yang bener (ganti kalau repo lu pindah)
git remote set-url origin https://github.com/napescui/stocksage.git

# Pastikan autoforce.sh di-ignore
echo "autoforce.sh" >> .gitignore

# Hapus dari tracking kalau udah sempat ke-commit sebelumnya
git rm --cached autoforce.sh 2> /dev/null

# Tambahkan semua perubahan (termasuk file yg dihapus)
git add -A

# Commit dengan pesan
git commit -m "sync full local to remote" 2> /dev/null

# Force push ke remote
git push -f origin main
