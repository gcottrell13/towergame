from collections import defaultdict
from pathlib import Path

images_ts = open('images.ts', 'w', newline='\n')
ROOT = Path("./assets")
ALLOWED_FILETYPES = {'.png', '.gif', '.bmp'}

def recdict():
    return defaultdict(recdict)

namespaces = recdict()

for f in ROOT.glob("**/*"):
    if f.suffix not in ALLOWED_FILETYPES:
        continue
    current = namespaces
    for p in f.parts[1:-1]:
        current = current[p]
    fname = f"./{str(f).replace("\\", "/")}"
    varname = fname.lower().replace('-', '_').replace('.', '_').replace("/", "__")
    current[f.parts[-1]] = varname
    images_ts.write(f"import {varname} from '{fname}';\n")

def recurse(current: dict, indent: int):
    t = '\t' * indent
    for key, value in current.items():
        if isinstance(value, dict):
            yield f"{t}export namespace {key} {{"
            yield from recurse(value, indent + 1)
            yield "}"
        else:
            yield f"{t}export const {value.rsplit('__')[-1].upper()} = {value};"

lines = list(recurse(namespaces, 0))

lines.append("const all = {")
for key in namespaces:
    lines.append(f'\t{key},')
lines.append('};')
lines.append('export default all;')

images_ts.write("\n".join(lines))