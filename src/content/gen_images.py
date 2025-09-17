from pathlib import Path

images_ts = open('images.ts', 'w', newline='\n')
p = Path("./assets")
names = []
for f in p.glob("*"):
    var = f.name.lower().replace('-', '_').replace('.', '_')
    export = var.upper()
    images_ts.write(f"import {var} from './{str(f).replace("\\", "/")}';\n")
    names.append((f.name, var))

images_ts.write("const images = {\n")
images_ts.writelines([
    f'\t"{name}": {var},\n'
    for name, var in names
])
images_ts.write("};\n")
images_ts.write("export type IMAGES = keyof typeof images;\n")
images_ts.write("export default images as {[p: string]: string};\n")