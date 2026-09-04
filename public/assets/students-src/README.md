# Student portraits

The site serves the cropped, optimised `.webp` files in `../students/`.
Original photographs are **not** committed — they are children's photos and
add weight for nothing once cropped.

## Adding a student

1. Get the original from the academy and note where the face sits.
2. Crop to 4:5 and convert. `TOP` is the vertical offset of the 4:5 window in
   source pixels: `0` crops from the very top, which suits a photo where the
   head is already high in frame. Raise it when the subject stands lower.

   ```
   python3 - <<'PY'
   from PIL import Image; import subprocess
   SRC, SLUG, TOP = "/path/to/photo.jpg", "student-name", 0
   im = Image.open(SRC).convert("RGB"); w, h = im.size
   ch = round(w * 5 / 4); top = max(0, min(TOP, max(0, h - ch)))
   im.crop((0, top, w, min(top + ch, h))).resize((800, 1000), Image.LANCZOS).save("/tmp/s.png")
   subprocess.run(["cwebp", "-q", "82", "/tmp/s.png", "-o", f"public/assets/students/{SLUG}.webp"])
   PY
   ```

3. Look at the result. If the face is low or the chin is clipped, raise `TOP`
   and run it again — there is no face detection here, it is eyes on the crop.
4. Add `image: "/assets/students/<slug>.webp"` to that student in
   `src/data/content.ts`. Leave it off and the card shows initials instead,
   which is the correct state for a student whose photo we cannot publish.

## Offsets used for the current set

| Student           | Source   | Size      | TOP |
| ----------------- | -------- | --------- | --- |
| pratika-panwar    | 17.44.26 | 619x1179  | 0   |
| sonali-sahu       | 17.43.20 | 576x1216  | 0   |
| akshita-goswami   | 17.30.25 | 720x1600  | 378 |
| yashvardan-rajput | 17.34.02 | 720x1600  | 333 |
| varsha-goswami    | 17.36.38 | 720x1280  | 333 |
| bhavesh-sarthe    | 17.37.45 | 1185x1600 | 0   |
| vihaan-rajput     | 17.38.34 | 1228x1600 | 0   |
| yash-maheswari    | 17.39.15 | 900x1350  | 0   |
| ayushi-goswami    | 17.40.00 | 720x1280  | 0   |
| apeksha-pandey    | 17.40.57 | 517x1156  | 110 |
