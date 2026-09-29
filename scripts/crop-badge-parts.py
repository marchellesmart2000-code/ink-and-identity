from PIL import Image

path = r"C:\Users\User\.cursor\projects\d-Lowveldweb-Inkand-identity\assets\c__Users_User_AppData_Roaming_Cursor_User_workspaceStorage_a8d11f76794dddb1458f88ba6f8a1a7c_images_image-470f7068-c0cb-4a77-a2b9-4638c3a115be.png"
im = Image.open(path).convert("RGBA")
px = im.load()
w, h = im.size

def lit(x, y):
    r, g, b, a = px[x, y]
    return a > 40 and (r + g + b) > 140

minx, miny, maxx, maxy = w, h, 0, 0
for y in range(h):
    for x in range(w):
        if lit(x, y):
            minx, miny = min(minx, x), min(miny, y)
            maxx, maxy = max(maxx, x), max(maxy, y)
print("lit", minx, miny, maxx, maxy)

# circle is the left cluster
circle = im.crop((max(0, minx - 8), max(0, miny - 8), minx + 90, maxy + 8))
circle.resize((circle.width * 3, circle.height * 3), Image.Resampling.NEAREST).save(
    r"d:\Lowveldweb\Inkand identity\public\brand\_part-circle.png"
)
text = im.crop((minx + 70, max(0, miny - 6), min(w, maxx + 8), min(h, maxy + 8)))
text.resize((text.width * 3, text.height * 3), Image.Resampling.NEAREST).save(
    r"d:\Lowveldweb\Inkand identity\public\brand\_part-text.png"
)
print("saved", circle.size, text.size)
