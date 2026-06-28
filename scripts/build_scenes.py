#!/usr/bin/env python3
"""Construye el manifiesto de escenas del tour a partir de public/scenes/.

Para cada subdirectorio de public/scenes/ (una "escena"):
  - lista sus imágenes (png/jpg) en orden natural,
  - genera una miniatura liviana `_thumb.jpg` (~480px de ancho) a partir de la
    primera imagen, para la tira de habitaciones (evita cargar imágenes 4K como
    thumbnails),
  - registra rutas relativas a /public (servidas en la raíz del sitio).

Salida: src/scenes-manifest.json  ->  { scene: { images: [...], thumb } }

Regenerar cuando agregues o quites imágenes:  npm run scenes
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCENES_DIR = ROOT / "public" / "scenes"
MANIFEST = ROOT / "src" / "scenes-manifest.json"

IMAGE_EXT = {".png", ".jpg", ".jpeg", ".webp"}
THUMB_NAME = "_thumb.jpg"
THUMB_WIDTH = 480


def natural_key(name):
    """Orden natural: frame_0002 antes que frame_0010."""
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", name)]


def scene_images(scene_dir):
    files = [
        p
        for p in scene_dir.iterdir()
        if p.is_file()
        and p.suffix.lower() in IMAGE_EXT
        and not p.name.startswith("_")  # excluye miniaturas
    ]
    return sorted(files, key=lambda p: natural_key(p.name))


def make_thumb(src, dst):
    from PIL import Image

    im = Image.open(src).convert("RGB")
    w, h = im.size
    if w > THUMB_WIDTH:
        im = im.resize((THUMB_WIDTH, round(h * THUMB_WIDTH / w)), Image.LANCZOS)
    im.save(dst, "JPEG", quality=80, optimize=True)


def main():
    manifest = {}
    for scene_dir in sorted(SCENES_DIR.iterdir(), key=lambda p: p.name):
        if not scene_dir.is_dir():
            continue
        images = scene_images(scene_dir)
        if not images:
            manifest[scene_dir.name] = {"images": [], "thumb": None}
            print(f"{scene_dir.name}: (vacío) — pendiente de imágenes")
            continue

        thumb_path = scene_dir / THUMB_NAME
        make_thumb(images[0], thumb_path)

        rel = lambda p: f"scenes/{scene_dir.name}/{p.name}"
        manifest[scene_dir.name] = {
            "images": [rel(p) for p in images],
            "thumb": rel(thumb_path),
        }
        print(f"{scene_dir.name}: {len(images)} imágenes, thumb {THUMB_NAME}")

    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    print(f"\nEscrito {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
