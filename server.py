#!/usr/bin/env python3
import http.server
import os

APP_DIR = os.path.dirname(os.path.abspath(__file__))

class AcidBaseHandler(http.server.SimpleHTTPRequestHandler):
    """Static file server for the Acid Base app.

    Serves every file under APP_DIR (index.html at /, plus image/, sw.js,
    manifest.json ...) with no-cache and CORS headers for local testing.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=APP_DIR, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        # Quieter logs: one line per request, no DNS noise
        print(f"{self.address_string()} - {format % args}")

if __name__ == '__main__':
    port = 8000
    print(f"Starting Acid Base app server on port {port}")
    print(f"Access the app at: http://localhost:{port}")
    print("Keep server running in background...")

    try:
        httpd = http.server.HTTPServer(('localhost', port), AcidBaseHandler)
        print("Server started successfully!")
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"Failed to start server: {e}")
