#!/usr/bin/env python3
"""Generate safe synthetic placeholder PNG images for KTP/KK demo assets."""
import struct
import zlib

def create_placeholder_png(width=200, height=280, label="PLACEHOLDER"):
    """Generate a synthetic placeholder PNG (no personal data)."""
    
    # Canvas: RGBA pixels
    pixels = []
    for y in range(height):
        row = []
        for x in range(width):
            row.append([255, 255, 255, 255])  # White background
        pixels.append(row)
    
    # Light gray border
    for y in range(height):
        for x in range(width):
            if y < 10 or y >= height - 10 or x < 10 or x >= width - 10:
                pixels[y][x] = [220, 220, 220, 255]
    
    # Add placeholder text (simplified: just colored regions)
    # Top section: blue header
    for y in range(30, 60):
        for x in range(15, width - 15):
            pixels[y][x] = [200, 220, 240, 255]
    
    # Middle section: light gray content area
    for y in range(70, height - 50):
        for x in range(30, width - 30):
            if (y - 70) % 30 < 3:
                pixels[y][x] = [150, 150, 150, 255]
    
    # Bottom section: ID-like pattern
    for y in range(height - 40, height - 15):
        for x in range(30, width - 30):
            if x % 20 < 15:
                pixels[y][x] = [240, 240, 240, 255]
    
    # Convert to PNG
    return pixels_to_png(pixels, width, height)

def pixels_to_png(pixels, width, height):
    """Convert pixel array to PNG bytes."""
    
    # PNG signature
    png = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data) & 0xffffffff
    png += struct.pack('>I', 13) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # IDAT chunk (compressed image data)
    scanlines = b''
    for y in range(height):
        scanlines += b'\x00'  # filter type: none
        for x in range(width):
            r, g, b, a = pixels[y][x]
            scanlines += bytes([r, g, b, a])
    
    compressed = zlib.compress(scanlines, 9)
    idat_crc = zlib.crc32(b'IDAT' + compressed) & 0xffffffff
    png += struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', idat_crc)
    
    # IEND chunk
    iend_crc = zlib.crc32(b'IEND') & 0xffffffff
    png += struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    return png

if __name__ == '__main__':
    import os
    
    ktp_dir = r'D:\Wargaja\assets\ktp'
    kk_dir = r'D:\Wargaja\assets\kk'
    
    # Create placeholder KTP images
    for i in range(1, 11):
        png_data = create_placeholder_png(200, 280, f"KTP_{i}")
        filepath = os.path.join(ktp_dir, f'ktp_{i}.png')
        with open(filepath, 'wb') as f:
            f.write(png_data)
        print(f'Created: {filepath}')
    
    # Create placeholder KK images (slightly larger)
    for i in range(1, 11):
        png_data = create_placeholder_png(250, 180, f"KK_{i}")
        filepath = os.path.join(kk_dir, f'kk_{i}.png')
        with open(filepath, 'wb') as f:
            f.write(png_data)
        print(f'Created: {filepath}')
    
    print('\nAll placeholder images created successfully.')
