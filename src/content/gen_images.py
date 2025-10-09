from pathlib import Path

images_ts = open('images.ts', 'w', newline='\n')
p = Path("./assets")
names = []
ALLOWED_FILETYPES = {'.png', '.gif', '.bmp'}
for f in p.glob("*"):
    if f.suffix not in ALLOWED_FILETYPES:
        continue
    var = f.name.lower().replace('-', '_').replace('.', '_')
    export = var.upper()
    images_ts.write(f"import {var} from './{str(f).replace("\\", "/")}';\n")
    names.append((var.upper(), var))

images_ts.write("const images = {\n")
images_ts.writelines([
    f'    {name}: {var},\n'
    for name, var in names
])
images_ts.write("};\n")
images_ts.write("export default images;\n")