# Student photo sources

Drop the original photograph here named after the student, e.g.
`sonali-sahu.jpg`. The build does not read this folder — the cropped,
optimised `.webp` in `../students/` is what the site serves.

To convert one after adding it here:

    python3 -c "
    from PIL import Image; import sys
    n=sys.argv[1]; im=Image.open(f'public/assets/students-src/{n}.jpg').convert('RGB')
    w,h=im.size; ch=round(w*5/4)
    im.crop((0,0,w,min(ch,h))).resize((800,1000), Image.LANCZOS).save('/tmp/s.png')
    " <name> && cwebp -q 82 /tmp/s.png -o public/assets/students/<name>.webp

Then add `image` (and `focal` if the face sits off-centre) to that
student in `src/data/content.ts`.
