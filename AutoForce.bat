git branch -M main

git remote set-url origin https://github.com/napescui/stocksage.git

git add -A
git commit -m "sync full local to remote"
-A = tambah semua, termasuk file yang dihapus.

git push -f origin main