from pathlib import Path

targets = list(Path("styles").glob("**/capture.mjs")) + list(Path("projects").glob("**/capture.mjs"))

for p in targets:
    text = p.read_text(encoding="utf-8")
    if "'--no-sandbox'" not in text:
        text = text.replace(
            "'--enable-unsafe-swiftshader'",
            "'--enable-unsafe-swiftshader', '--no-sandbox', '--disable-gpu'"
        )
        p.write_text(text, encoding="utf-8")
        print(f"Patched {p}")
    else:
        print(f"Already patched {p}")
