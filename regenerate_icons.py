#!/usr/bin/env python3
"""Regenerate app_icon.png from improved Wargaja logo SVG."""
import struct
import zlib
import math

def create_wargaja_logo_hq(width=256, height=256):
    """Generate Wargaja shield-with-house logo with improved geometry."""
    
    # Canvas: RGBA pixels (white background)
    pixels = []
    for y in range(height):
        row = []
        for x in range(width):
            row.append([255, 255, 255, 255])
        pixels.append(row)
    
    center_x = width // 2
    center_y = height // 2
    
    # Colors
    primary_blue = [37, 99, 235, 255]
    dark_blue = [29, 78, 216, 255]
    white = [255, 255, 255, 255]
    light_blue = [29, 78, 216, 50]
    
    # Draw shield with gradient effect (primary → dark blue)
    shield_points = [
        (center_x, 30),        # top point
        (center_x + 80, 60),   # top right
        (center_x + 80, 130),  # right before curve
        (center_x, 175),       # bottom point
        (center_x - 80, 130),  # left before curve
        (center_x - 80, 60),   # top left
    ]
    
    # Rasterize shield (simple polygon fill)
    for y in range(height):
        for x in range(width):
            # Check if point is inside shield
            if is_inside_shield(x, y, center_x, center_y, shield_points):
                # Gradient: top to bottom
                progress = (y - 30) / (175 - 30) if y > 30 else 0
                progress = max(0, min(1, progress))
                # Interpolate between primary and dark blue
                r = int(primary_blue[0] * (1 - progress) + dark_blue[0] * progress)
                g = int(primary_blue[1] * (1 - progress) + dark_blue[1] * progress)
                b = int(primary_blue[2] * (1 - progress) + dark_blue[2] * progress)
                pixels[y][x] = [r, g, b, 255]
    
    # Draw white house inside shield
    roof_top_y = center_y - 55
    roof_base_y = center_y - 20
    body_base_y = center_y + 25
    
    # Roof triangle
    for y in range(roof_top_y, roof_base_y):
        progress = (y - roof_top_y) / (roof_base_y - roof_top_y)
        half_width = 50 * (1 - progress)
        for x in range(int(center_x - half_width), int(center_x + half_width)):
            if is_inside_shield(x, y, center_x, center_y, shield_points):
                pixels[y][x] = white
    
    # House body (rectangle)
    for y in range(roof_base_y, body_base_y):
        for x in range(center_x - 48, center_x + 48):
            if is_inside_shield(x, y, center_x, center_y, shield_points):
                pixels[y][x] = white
    
    # Door (subtle blue tint)
    for y in range(center_y - 5, body_base_y):
        for x in range(center_x - 12, center_x + 12):
            if is_inside_shield(x, y, center_x, center_y, shield_points):
                pixels[y][x] = light_blue
    
    # Windows with better contrast
    win_size = 16
    # Left window
    for y in range(roof_base_y, roof_base_y + win_size):
        for x in range(center_x - 40, center_x - 40 + win_size):
            if is_inside_shield(x, y, center_x, center_y, shield_points):
                pixels[y][x] = light_blue
    
    # Right window
    for y in range(roof_base_y, roof_base_y + win_size):
        for x in range(center_x + 24, center_x + 24 + win_size):
            if is_inside_shield(x, y, center_x, center_y, shield_points):
                pixels[y][x] = light_blue
    
    return pixels_to_png(pixels, width, height)

def is_inside_shield(x, y, cx, cy, shield_pts):
    """Point-in-polygon test for shield shape."""
    # Simplified: check if within bounding shield area
    # Top section (tapering trapezoid)
    if y >= 30 and y < 60:
        progress = (y - 30) / 30
        left_bound = cx - 80 + (80 - 80) * progress
        right_bound = cx + 80 - (80 - 80) * progress
        return x >= left_bound and x <= right_bound
    # Middle section (rectangle)
    elif y >= 60 and y < 130:
        return x >= (cx - 80) and x <= (cx + 80)
    # Bottom section (converging)
    elif y >= 130 and y <= 175:
        progress = (y - 130) / 45
        left_bound = cx - 80 + 80 * progress
        right_bound = cx + 80 - 80 * progress
        return x >= left_bound and x <= right_bound
    return False

def pixels_to_png(pixels, width, height):
    """Convert pixel array to PNG bytes."""
    png = b'\x89PNG\r\n\x1a\n'
    
    # IHDR
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data) & 0xffffffff
    png += struct.pack('>I', 13) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # IDAT
    scanlines = b''
    for y in range(height):
        scanlines += b'\x00'
        for x in range(width):
            r, g, b, a = pixels[y][x]
            scanlines += bytes([r, g, b, a])
    
    compressed = zlib.compress(scanlines, 9)
    idat_crc = zlib.crc32(b'IDAT' + compressed) & 0xffffffff
    png += struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', idat_crc)
    
    # IEND
    iend_crc = zlib.crc32(b'IEND') & 0xffffffff
    png += struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    return png

if __name__ == '__main__':
    # Generate 256x256 version (for app_icon.png)
    png_256 = create_wargaja_logo_hq(256, 256)
    with open(r'D:\Wargaja\assets\icons\app_icon.png', 'wb') as f:
        f.write(png_256)
    print('Created: app_icon.png (256x256)')
    
    # Generate 1024x1024 version (for web/app_icon_r.png)
    png_1024 = create_wargaja_logo_hq(1024, 1024)
    with open(r'D:\Wargaja\assets\icons\app_icon_r.png', 'wb') as f:
        f.write(png_1024)
    print('Created: app_icon_r.png (1024x1024)')
