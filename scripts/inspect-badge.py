from PIL import Image

path = r"C:\Users\User\.cursor\projects\d-Lowveldweb-Inkand-identity\assets\c__Users_User_AppData_Roaming_Cursor_User_workspaceStorage_a8d11f76794dddb1458f88ba6f8a1a7c_images_image-470f7068-c0cb-4a77-a2b9-4638c3a115be.png"
im = Image.open(path).convert("RGBA")
px = im.load()
w, h = im.size
print("size", w, h)

def kind(r, g, b, a):
    if a < 40:
        return " "
    if r > 160 and r > g + 40 and r > b + 40:
        return "R"
    if r > 200 and g > 200 and b > 200:
        return "W"
    if r > 90 and g > 70 and b < 90 and r > b + 20:
        return "G"
    if r + g + b > 80:
        return "."
    return " "

for y in range(0, h, 4):
    row = "".join(kind(*px[x, y]) for x in range(0, w, 3))
    print(f"{y:03d}|{row}")
