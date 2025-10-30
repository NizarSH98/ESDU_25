"""
Extract text and images from PDFs in assets/files.

Usage:
  py -3.12 scripts/extract_esdu.py

Requires:
  pip install pymupdf
"""
from pathlib import Path
import sys

try:
    import fitz  # type: ignore[import] # PyMuPDF
except Exception:
    sys.stderr.write("PyMuPDF is required. Install with: py -3.12 -m pip install pymupdf\n")
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
FILES_DIR = ROOT / "assets" / "files"
OUT_DIR = FILES_DIR / "extracted"

def extract_pdf(pdf_path: Path):
    stem = pdf_path.stem
    out_txt = OUT_DIR / f"{stem}.txt"
    img_dir = OUT_DIR / stem / "images"
    img_dir.mkdir(parents=True, exist_ok=True)
    print(f"Processing: {pdf_path.name}")

    doc = fitz.open(pdf_path)
    try:
        # Text
        with out_txt.open("w", encoding="utf-8") as f:
            for i, page in enumerate(doc, start=1):
                text = page.get_text("text")
                f.write(f"\n\n===== Page {i} =====\n\n")
                f.write(text)
        # Images
        img_count = 0
        unsupported_count = 0
        for page_index, page in enumerate(doc):
            for img_index, img in enumerate(page.get_images(full=True)):
                xref = img[0]
                pix = fitz.Pixmap(doc, xref)
                try:
                    if pix.n >= 5:  # CMYK or with alpha
                        pix = fitz.Pixmap(fitz.csRGB, pix)
                    out_file = img_dir / f"img_{page_index+1}_{img_index+1}.png"
                    # Only save if colorspace is supported
                    if pix.colorspace:
                        pix.save(out_file)
                        img_count += 1
                    else:
                        unsupported_count += 1
                except Exception as e:
                    unsupported_count += 1
                    # Only log first few errors to avoid spam
                    if unsupported_count <= 3:
                        print(f"  Warning: Failed to extract image {img_index+1} on page {page_index+1}: {e}")
                finally:
                    pix = None
        if unsupported_count > 3:
            print(f"  Warning: {unsupported_count} additional images could not be extracted")
        print(f"  -> text: {out_txt}")
        print(f"  -> images: {img_count} files -> {img_dir}")
    finally:
        doc.close()

def main():
    if not FILES_DIR.exists():
        print(f"Not found: {FILES_DIR}")
        sys.exit(1)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    pdfs = sorted(FILES_DIR.glob("*.pdf"))
    if not pdfs:
        print("No PDFs in assets/files")
        return
    for pdf in pdfs:
        extract_pdf(pdf)
    print("\nDone. Extracted content is under assets/files/extracted/")

if __name__ == "__main__":
    main()

