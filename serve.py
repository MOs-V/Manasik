#!/usr/bin/env python3
"""Local test server for Manasik. Run:  python3 serve.py   then open http://localhost:8000/
Also checks that all Quran files are in place."""
import http.server,socketserver,os,sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
miss=[f'quran/img/{i:03d}.webp' for i in range(1,605) if not os.path.exists(f'quran/img/{i:03d}.webp')]
for f in ('quran/data/quran.json','quran/fonts/UthmanicHafs-v-3.0.ttf'):
    if not os.path.exists(f):miss.append(f)
print('Quran files: OK (604 images, data, font)' if not miss else f'MISSING {len(miss)} Quran files, first: {miss[:5]}\nUnzip the image zips into this folder so they land in quran/img/')
port=int(sys.argv[1]) if len(sys.argv)>1 else 8000
socketserver.TCPServer.allow_reuse_address=True
print(f'Open http://localhost:{port}/  (Ctrl+C to stop)')
socketserver.TCPServer(('',port),http.server.SimpleHTTPRequestHandler).serve_forever()
