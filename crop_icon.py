from PIL import Image

def find_inner_square(img_path):
    img = Image.open(img_path).convert('RGB')
    w, h = img.size
    pixels = img.load()
    
    top = 0
    for y in range(h):
        r,g,b = pixels[w//2, y]
        if max(r,g,b) > 40:
            top = y
            break
            
    bottom = h - 1
    for y in range(h-1, -1, -1):
        r,g,b = pixels[w//2, y]
        if max(r,g,b) > 40:
            bottom = y
            break
            
    left = 0
    for x in range(w):
        r,g,b = pixels[x, h//2]
        if max(r,g,b) > 40:
            left = x
            break
            
    right = w - 1
    for x in range(w-1, -1, -1):
        r,g,b = pixels[x, h//2]
        if max(r,g,b) > 40:
            right = x
            break

    print(f"Bounds: Left={left}, Top={top}, Right={right}, Bottom={bottom}")
    
    # Square has rounded corners. To get a perfect square without any dark blue corners,
    # we need to crop slightly inward from the bounding box of the rounded square.
    # The bounding box is around (204, 204, 819, 819).
    # Center is (512, 512). Width is ~615.
    # A circle with radius 307 inscribed in the rounded square would have no corners.
    # Actually, we can just crop out a square of size 512x512 from the center and it will surely not contain corners.
    # And then resize to 1024x1024.
    crop_size = 560 # Guessing this is large enough to get the otter but small enough to miss corners
    cx, cy = w//2, h//2
    
    cropped = img.crop((cx - crop_size//2, cy - crop_size//2, cx + crop_size//2, cy + crop_size//2))
    
    # Save a preview 
    cropped.save('/Users/furkanahi/.gemini/antigravity/brain/fe8dae17-4d69-41b4-b8ad-21338fd1501d/icon_cropped_preview.png')
    
    # Create the 1024x1024 version
    final_icon = cropped.resize((1024, 1024), Image.Resampling.LANCZOS)
    
    # Remove alpha channel if it exists (apple requirement)
    if final_icon.mode in ('RGBA', 'LA') or (final_icon.mode == 'P' and 'transparency' in final_icon.info):
        final_icon = final_icon.convert('RGB')
        
    final_icon.save('/Users/furkanahi/Desktop/Rheo-MVP-main2/rheo_app/ios/Runner/Assets.xcassets/AppIcon.appiconset/AppIcon_1024.png', format='PNG')
    final_icon.save('/Users/furkanahi/.gemini/antigravity/brain/fe8dae17-4d69-41b4-b8ad-21338fd1501d/AppIcon_1024.png', format='PNG')
    
    print(f"Cropped square {crop_size}x{crop_size} from center, resized to 1024x1024")

find_inner_square('/Users/furkanahi/.gemini/antigravity/brain/fe8dae17-4d69-41b4-b8ad-21338fd1501d/media__1774010336085.png')
