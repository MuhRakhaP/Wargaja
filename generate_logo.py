#!/usr/bin/env python3
import struct
import zlib

def create_wargaja_logo(width=256, height=256):
    """Generate Wargaja shield-with-house logo as PNG"""
    
    # Canvas: RGBA pixels
    pixels = []
    for y in range(height):
        row = []
        for x in range(width):
            row.append([0, 0, 0, 0])  # Transparent by default
        pixels.append(row)
    
    # Colors
    blue = [37, 99, 235, 255]
    white = [255, 255, 255, 255]
    blue_light = [37, 99, 235, 40]
    
    # Draw shield (blue background)
    center_x, center_y = width // 2, height // 2
    shield_top = 30
    shield_left = 50
    shield_right = width - 50
    shield_bottom = height - 40
    
    # Fill shield area
    for y in range(shield_top, shield_bottom):
        for x in range(shield_left, shield_right):
            rel_y = y - shield_top
            total_height = shield_bottom - shield_top
            
            if rel_y < total_height * 0.3:  # Top taper
                progress = rel_y / (total_height * 0.3)
                left_bound = shield_left + (center_x - shield_left) * (1 - progress)
                right_bound = shield_right - (shield_right - center_x) * (1 - progress)
            elif rel_y < total_height * 0.8:  # Main body
                left_bound = shield_left
                right_bound = shield_right
            else:  # Bottom taper
                progress = (rel_y - total_height * 0.8) / (total_height * 0.2)
                left_bound = shield_left + (center_x - shield_left) * progress
                right_bound = shield_right - (shield_right - center_x) * progress
            
            if x >= left_bound and x <= right_bound:
                pixels[y][x] = blue
    
    # Draw white house inside shield
    house_x = center_x
    house_y = center_y
    roof_height = 40
    body_height = 60
    body_width = 50
    
    # Roof (triangle)
    for y in range(house_y - roof_height, house_y):
        progress = (y - (house_y - roof_height)) / roof_height
        half_width = body_width * (1 - progress)
        for x in range(int(house_x - half_width), int(house_x + half_width)):
            if 0 <= x < width and 0 <= y < height:
                pixels[y][x] = white
    
    # House body
    for y in range(house_y, house_y + body_height):
        for x in range(house_x - body_width, house_x + body_width):
            if 0 <= x < width and 0 <= y < height:
                pixels[y][x] = white
    
    # Door (subtle)
    door_width = 20
    for y in range(house_y + 15, house_y + body_height - 5):
        for x in range(house_x - door_width // 2, house_x + door_width // 2):
            if 0 <= x < width and 0 <= y < height:
                pixels[y][x] = blue_light
    
    # Windows
    win_size = 12
    for y in range(house_y + 5, house_y + 5 + win_size):
        for x in range(house_x - 35, house_x - 35 + win_size):
            if 0 <= x < width and 0 <= y < height:
                pixels[y][x] = blue_light
        for x in range(house_x + 23, house_x + 23 + win_size):
            if 0 <= x < width and 0 <= y < height:
                pixels[y][x] = blue_light
    
    # Convert to PNG
    return pixels_to_png(pixels, width, height)

def pixels_to_png(pixels, width, height):
    """Convert pixel array to PNG bytes"""
    
    # PNG signature
    png = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png += struct.pack('>I', 13) + b'IHDR' + ihdr_data
    png += struct.pack('>I', zlib.crc32(b'IHDR' + ihdr_data) & 0xffffffff)
    
    # IDAT chunk (compressed image data)
    scanlines = b''
    for y in range(height):
        scanlines += b'\x00'  # filter type: none
        for x in range(width):
            r, g, b, a = pixels[y][x]
            scanlines += bytes([r, g, b, a])
    
    compressed = zlib.compress(scanlines, 9)
    png += struct.pack('>I', len(compressed)) + b'IDAT' + compressed
    png += struct.pack('>I', zlib.crc32(b'IDAT' + compressed) & 0xffffffff)
    
    # IEND chunk
    png += struct.pack('>I', 0) + b'IEND'
    png += struct.pack('>I', zlib.crc32(b'IEND') & 0xffffffff)
    
    return png

if __name__ == '__main__':
    png_data = create_wargaja_logo(256, 256)
    with open(r'D:\Wargaja\assets\icons\app_icon.png', 'wb') as f:
        f.write(png_data)
    print('Logo created: app_icon.png')
    
    # Also create web version at higher resolution
    png_data_large = create_wargaja_logo(1024, 1024)
    with open(r'D:\Wargaja\assets\icons\app_icon_r.png', 'wb') as f:
        f.write(png_data_large)
    print('Logo created: app_icon_r.png (1024x1024)')
