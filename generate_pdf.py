"""
Generate a multi-page PDF using only Python stdlib.
Produces: Prompt-Skincare-Yanzy.pdf
"""
import zlib
import os

# ---------- PDF builder helpers ----------

class PDFBuilder:
    def __init__(self):
        self.objects = []  # list of (id, bytes)
        self.pages = []    # list of page object ids
        self.font_id = None
        self.font_bold_id = None
        self.font_mono_id = None

    def add_object(self, content_bytes):
        obj_id = len(self.objects) + 1
        self.objects.append((obj_id, content_bytes))
        return obj_id

    def add_font(self, base_font, name):
        font = (
            f"<< /Type /Font /Subtype /Type1 /BaseFont /{base_font} "
            f"/Encoding /WinAnsiEncoding >>"
        ).encode("latin-1")
        return self.add_object(font)

    def add_page(self, content_stream, parent_id, font_id, bold_id, mono_id, width, height):
        # compress content
        compressed = zlib.compress(content_stream.encode("latin-1", errors="replace"))
        stream_obj = (
            b"<< /Length " + str(len(compressed)).encode() +
            b" /Filter /FlateDecode >>\nstream\n" + compressed + b"\nendstream"
        )
        content_id = self.add_object(stream_obj)

        page = (
            f"<< /Type /Page /Parent {parent_id} 0 R "
            f"/MediaBox [0 0 {width} {height}] "
            f"/Resources << /Font << /F1 {font_id} 0 R /F2 {bold_id} 0 R /F3 {mono_id} 0 R >> >> "
            f"/Contents {content_id} 0 R >>"
        ).encode("latin-1")
        page_id = self.add_object(page)
        self.pages.append(page_id)
        return page_id

    def build(self):
        # finalize
        out = b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n"
        offsets = []
        for obj_id, content in self.objects:
            offsets.append(len(out))
            out += f"{obj_id} 0 obj\n".encode() + content + b"\nendobj\n"

        xref_offset = len(out)
        out += f"xref\n0 {len(self.objects) + 1}\n".encode()
        out += b"0000000000 65535 f \n"
        for off in offsets:
            out += f"{off:010d} 00000 n \n".encode()

        # find catalog id (last added)
        catalog_id = self.catalog_id
        out += b"trailer\n"
        out += f"<< /Size {len(self.objects) + 1} /Root {catalog_id} 0 R >>\n".encode()
        out += f"startxref\n{xref_offset}\n%%EOF\n".encode()
        return out


# ---------- Content escape ----------
def pdf_escape(text):
    # escape parens and backslashes for PDF text strings
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


# ---------- Page builder with text wrapping ----------

class PageWriter:
    """Helper that lays out text on pages, handling wrapping and pagination."""

    PAGE_W = 595  # A4 width in points
    PAGE_H = 842  # A4 height
    MARGIN_L = 50
    MARGIN_R = 50
    MARGIN_T = 60
    MARGIN_B = 60

    def __init__(self):
        self.pages_content = []  # list of strings (one per page)
        self.current = []  # current page content stream commands
        self.y = self.PAGE_H - self.MARGIN_T

    # Approximate char width factor for Helvetica (Type1) at given font size
    # average char width ratio ~0.5 of font size for Helvetica
    @staticmethod
    def char_width(font_size, mono=False):
        if mono:
            return font_size * 0.6
        return font_size * 0.5

    def new_page(self):
        if self.current:
            self.pages_content.append("\n".join(self.current))
        self.current = []
        self.y = self.PAGE_H - self.MARGIN_T

    def ensure_space(self, needed):
        if self.y - needed < self.MARGIN_B:
            self.new_page()

    def draw_rect_fill(self, x, y, w, h, r, g, b):
        self.current.append(f"{r:.3f} {g:.3f} {b:.3f} rg")
        self.current.append(f"{x} {y} {w} {h} re f")
        self.current.append("0 0 0 rg")  # reset to black

    def draw_line(self, x1, y1, x2, y2, r=0.7, g=0.7, b=0.7):
        self.current.append(f"{r:.3f} {g:.3f} {b:.3f} RG")
        self.current.append("0.5 w")
        self.current.append(f"{x1} {y1} m {x2} {y2} l S")
        self.current.append("0 0 0 RG")

    def text_at(self, x, y, text, font="F1", size=11, color=(0, 0, 0)):
        r, g, b = color
        cmd = (
            f"BT\n/{font} {size} Tf\n"
            f"{r:.3f} {g:.3f} {b:.3f} rg\n"
            f"{x} {y} Td\n"
            f"({pdf_escape(text)}) Tj\n"
            f"ET"
        )
        self.current.append(cmd)

    def wrap_text(self, text, font_size, max_width, mono=False):
        """Greedy word wrap returning list of lines."""
        words = text.split(" ")
        lines = []
        current = ""
        cw = self.char_width(font_size, mono)
        max_chars = int(max_width / cw)
        for w in words:
            candidate = (current + " " + w).strip()
            if len(candidate) <= max_chars:
                current = candidate
            else:
                if current:
                    lines.append(current)
                # If word itself is too long, hard-break
                while len(w) > max_chars:
                    lines.append(w[:max_chars])
                    w = w[max_chars:]
                current = w
        if current:
            lines.append(current)
        return lines

    def write_paragraph(self, text, font="F1", size=11, line_height=14,
                        color=(0, 0, 0), indent=0, max_width=None, mono=False,
                        space_after=4):
        if max_width is None:
            max_width = self.PAGE_W - self.MARGIN_L - self.MARGIN_R - indent
        # handle explicit \n
        for paragraph in text.split("\n"):
            if paragraph == "":
                self.y -= line_height // 2
                continue
            lines = self.wrap_text(paragraph, size, max_width, mono=mono)
            for line in lines:
                self.ensure_space(line_height)
                self.text_at(self.MARGIN_L + indent, self.y, line,
                             font=font, size=size, color=color)
                self.y -= line_height
        self.y -= space_after

    def write_code_block(self, text, size=9, line_height=11,
                         bg=(0.96, 0.96, 0.96)):
        """Render a monospace code-style block with light background."""
        max_width = self.PAGE_W - self.MARGIN_L - self.MARGIN_R - 16
        # Pre-wrap all lines first to know height
        all_lines = []
        for paragraph in text.split("\n"):
            if paragraph.strip() == "":
                all_lines.append("")
                continue
            wrapped = self.wrap_text(paragraph, size, max_width, mono=True)
            all_lines.extend(wrapped if wrapped else [""])

        # Render in chunks per page
        idx = 0
        while idx < len(all_lines):
            # how many lines fit on current page?
            available = self.y - self.MARGIN_B
            fit = max(1, int(available / line_height) - 1)
            chunk = all_lines[idx: idx + fit]
            block_h = len(chunk) * line_height + 10

            if available < block_h and idx > 0:
                self.new_page()
                continue
            if available < line_height * 3:
                self.new_page()
                continue

            # background rect
            top_y = self.y + 4
            bottom_y = top_y - block_h
            self.draw_rect_fill(
                self.MARGIN_L, bottom_y,
                self.PAGE_W - self.MARGIN_L - self.MARGIN_R, block_h,
                bg[0], bg[1], bg[2]
            )
            # left accent bar
            self.draw_rect_fill(
                self.MARGIN_L, bottom_y, 3, block_h,
                0.36, 0.50, 0.90
            )

            self.y -= 4
            for line in chunk:
                self.y -= line_height
                self.text_at(self.MARGIN_L + 10, self.y, line,
                             font="F3", size=size, color=(0.15, 0.15, 0.15))
            self.y -= 8
            idx += len(chunk)

    def heading(self, text, level=1):
        sizes = {1: 22, 2: 16, 3: 13}
        size = sizes.get(level, 13)
        line_height = size + 6
        self.ensure_space(line_height + 8)
        if level == 1:
            self.y -= 4
        self.write_paragraph(text, font="F2", size=size,
                             line_height=line_height, space_after=6)
        if level == 1:
            # underline
            y_line = self.y + line_height + 2
            self.draw_line(self.MARGIN_L, y_line,
                           self.PAGE_W - self.MARGIN_R, y_line,
                           r=0.36, g=0.50, b=0.90)
            self.y -= 4

    def bullet(self, text, size=11, line_height=14):
        max_width = self.PAGE_W - self.MARGIN_L - self.MARGIN_R - 20
        lines = self.wrap_text(text, size, max_width)
        for i, line in enumerate(lines):
            self.ensure_space(line_height)
            if i == 0:
                self.text_at(self.MARGIN_L + 4, self.y, "-",
                             font="F2", size=size)
            self.text_at(self.MARGIN_L + 16, self.y, line,
                         font="F1", size=size)
            self.y -= line_height
        self.y -= 2

    def finalize(self):
        if self.current:
            self.pages_content.append("\n".join(self.current))
        return self.pages_content


# ---------- Content ----------

TITLE = "Prompt Skincare - Set Lengkap"
SUBTITLE = "Template prompt AI image generator dengan referensi tangan + 10 background"
AUTHOR = "Yanzy"

PROMPTS = [
    {
        "title": "PROMPT 1 - Produk Tertutup (Botol/Tube/Jar)",
        "desc": "Untuk semua jenis produk skincare yang masih dalam kondisi tertutup (botol serum, tube cream, jar tertutup, dll).",
        "content": """Combine two reference images into one realistic photo:

IMAGE 1 = PRODUCT: Use the skincare product exactly as shown. Keep the packaging, label, text, logo, color, and design 100% identical and unchanged.

IMAGE 2 = HAND: Use the hand exactly as shown. Preserve the same skin tone, finger shape, nail style, skin texture, and natural details. Do not smooth, airbrush, or alter the hand.

COMPOSITION: The hand from image 2 holds the product from image 1 in a natural relaxed grip, gripping from the lower-middle area, thumb on the front, fingers curled comfortably around the back. Product held vertically, slightly tilted toward camera, label fully visible and not blocked by fingers.

BACKGROUND: plain pleated curtain in muted grey, soft vertical folds, slightly out of focus, no decoration, completely simple.

STYLE: Casual indoor photo shot on iPhone, soft natural indoor lighting from the side, slightly cool tone, candid amateur snapshot, raw unedited look, mild natural grain, looks like a real Pinterest lifestyle photo, NOT studio, NOT glossy, NOT professional.

OUTPUT: 3:4 portrait, photorealistic, authentic real-world feel, natural imperfections preserved.

Avoid: plastic skin, airbrushed hand, studio lighting, glamour shot, fake bokeh, 3D render, decorative props, busy background, altering the product or hand."""
    },
    {
        "title": "PROMPT 2 - Cream Jar Terbuka (Tutup Dipegang)",
        "desc": "Cream jar yang dibuka, tutup dipegang oleh tangan yang sama. Cocok untuk hero shot.",
        "content": """Combine two reference images into one realistic photo:

IMAGE 1 = PRODUCT: Use the skincare cream jar exactly as shown. Keep the packaging, label, text, logo, color, and design 100% identical and unchanged.

IMAGE 2 = HAND: Use the hand exactly as shown. Preserve the same skin tone, finger shape, nail style, skin texture, and natural details. Do not smooth, airbrush, or alter the hand.

COMPOSITION: The hand from image 2 is holding the opened cream jar from image 1. The lid is removed and held in the same hand using the thumb and index finger on the side, while the jar itself is held in the palm. The jar is tilted slightly toward the camera so the smooth glossy white cream texture inside is clearly visible. Natural relaxed grip, fingers not covering the product label.

BACKGROUND: plain pleated curtain in muted grey, soft vertical folds, slightly out of focus, no decoration, completely simple.

STYLE: Casual indoor photo shot on iPhone, soft natural indoor lighting from the side highlighting the creamy texture, slightly cool tone, candid amateur snapshot, raw unedited look, mild natural grain, looks like a real Pinterest lifestyle photo, NOT studio, NOT glossy, NOT professional.

OUTPUT: 3:4 portrait, slightly top-down angle so the cream inside is visible, photorealistic, authentic real-world feel, natural imperfections preserved, sharp focus on cream texture and label.

Avoid: plastic skin, airbrushed hand, studio lighting, glamour shot, fake bokeh, 3D render, decorative props, busy background, altering the product or hand, changing the cream texture."""
    },
    {
        "title": "PROMPT 3 - Cream Jar Terbuka (Dua Tangan)",
        "desc": "Dua tangan, satu pegang jar berisi cream, satu pegang tutup. Look paling premium.",
        "content": """Combine two reference images into one realistic photo:

IMAGE 1 = PRODUCT: Use the skincare cream jar exactly as shown. Keep the packaging, label, text, logo, color, and design 100% identical and unchanged.

IMAGE 2 = HAND: Use the hand exactly as shown. Preserve the same skin tone, finger shape, nail style, skin texture, and natural details. Do not smooth, airbrush, or alter the hand.

COMPOSITION: Both hands from image 2 hold the opened cream jar from image 1 - one hand holds the jar with the smooth glossy white cream visible inside, the other hand holds the lid showing its inner side. Both hands tilted toward the camera at a slight angle so the cream texture is clearly visible. Natural relaxed grip, fingers not covering the product label.

BACKGROUND: plain pleated curtain in muted grey, soft vertical folds, slightly out of focus, no decoration, completely simple.

STYLE: Casual indoor photo shot on iPhone, soft natural indoor lighting from the side highlighting the creamy texture, slightly cool tone, candid amateur snapshot, raw unedited look, mild natural grain, looks like a real Pinterest lifestyle photo, NOT studio, NOT glossy, NOT professional.

OUTPUT: 3:4 portrait, slightly top-down angle, photorealistic, authentic real-world feel, natural imperfections preserved, sharp focus on cream texture and label.

Avoid: plastic skin, airbrushed hand, studio lighting, glamour shot, fake bokeh, 3D render, decorative props, busy background, altering the product or hand, changing the cream texture."""
    },
    {
        "title": "PROMPT 4 - Jari Colek Cream (Swatch Style)",
        "desc": "Close-up jari mencolek cream dari jar. Cocok untuk konten reels/TikTok review tekstur.",
        "content": """Combine two reference images into one realistic photo:

IMAGE 1 = PRODUCT: Use the skincare cream jar exactly as shown. Keep the packaging, label, text, logo, color, and design 100% identical and unchanged.

IMAGE 2 = HAND: Use the hand exactly as shown. Preserve the same skin tone, finger shape, nail style, skin texture, and natural details. Do not smooth, airbrush, or alter the hand.

COMPOSITION: The hand from image 2 holds the opened cream jar from image 1 with the lid removed and placed beside it. The index finger of the other hand is gently scooping a small dollop of the rich creamy white texture from the jar, showing the smooth glossy consistency of the cream. Close-up macro angle on the finger and cream texture.

BACKGROUND: plain pleated curtain in muted grey, soft vertical folds, slightly out of focus, no decoration, completely simple.

STYLE: Casual indoor photo shot on iPhone, soft natural indoor lighting from the side, slightly cool tone, candid amateur snapshot, raw unedited look, mild natural grain, looks like a real Pinterest lifestyle photo, NOT studio, NOT glossy, NOT professional.

OUTPUT: 3:4 portrait, photorealistic, authentic real-world feel, natural imperfections preserved, sharp focus on the cream texture and finger.

Avoid: plastic skin, airbrushed hand, studio lighting, glamour shot, fake bokeh, 3D render, decorative props, busy background, altering the product or hand, changing the cream texture."""
    },
]

BACKGROUNDS = [
    ("1. Tirai Abu-abu (default - vibe Pinterest)",
     "BACKGROUND: plain pleated curtain in muted grey, soft vertical folds, slightly out of focus, no decoration, completely simple."),
    ("2. Tirai Putih Krem",
     "BACKGROUND: plain pleated curtain in soft cream or warm white tone, soft vertical folds, slightly out of focus, no decoration, completely simple."),
    ("3. Tirai Pink Lembut",
     "BACKGROUND: plain pleated curtain in soft dusty pink, soft vertical folds, slightly out of focus, no decoration, completely simple."),
    ("4. Tirai Hijau Sage",
     "BACKGROUND: plain pleated curtain in muted sage green, soft vertical folds, slightly out of focus, no decoration, completely simple."),
    ("5. Tirai Linen Putih (Bright)",
     "BACKGROUND: plain white linen curtain with soft natural folds, slightly translucent, gentle daylight filtering through, dreamy minimal feel."),
    ("6. Dinding Polos Off-White",
     "BACKGROUND: plain matte wall in muted off-white tone, slight natural wall texture, no decoration, completely minimal."),
    ("7. Dinding Polos Beige",
     "BACKGROUND: plain matte wall in soft beige tone, slight natural wall texture, no decoration, completely minimal."),
    ("8. Marmer Putih",
     "BACKGROUND: plain white marble surface as background, smooth elegant texture, minimal and clean, no decoration."),
    ("9. Kayu Light Oak",
     "BACKGROUND: light oak wood surface as background, soft natural wood grain, minimal and warm, no decoration."),
    ("10. Kain Linen Krem",
     "BACKGROUND: plain wrinkled linen fabric in muted beige tone filling the background, slight natural fabric texture, casual at-home feel."),
]


# ---------- Compose document ----------

def build_document():
    pw = PageWriter()

    # ===== Cover =====
    # Top accent bar
    pw.draw_rect_fill(0, pw.PAGE_H - 120, pw.PAGE_W, 120, 0.36, 0.50, 0.90)
    pw.text_at(50, pw.PAGE_H - 70, "PROMPT SKINCARE",
               font="F2", size=28, color=(1, 1, 1))
    pw.text_at(50, pw.PAGE_H - 100, "Set Lengkap dengan Referensi Tangan",
               font="F1", size=14, color=(1, 1, 1))

    pw.y = pw.PAGE_H - 160

    pw.write_paragraph(
        "Template prompt siap pakai untuk AI image generator (Nano Banana, "
        "Gemini, Midjourney, ChatGPT, Flux). Cocok untuk membuat foto produk "
        "skincare yang konsisten dan natural - vibe Pinterest, bukan AI banget.",
        size=11, line_height=15, space_after=12
    )

    pw.heading("Daftar Isi", level=2)
    toc = [
        "Cara Pakai (3 langkah)",
        "Prompt 1 - Produk Tertutup (Botol/Tube/Jar)",
        "Prompt 2 - Cream Jar Terbuka (Tutup Dipegang)",
        "Prompt 3 - Cream Jar Terbuka (Dua Tangan)",
        "Prompt 4 - Jari Colek Cream (Swatch Style)",
        "10 Pilihan Background",
        "Tips Penting",
    ]
    for item in toc:
        pw.bullet(item, size=11, line_height=14)
    pw.y -= 6

    pw.heading("Cara Pakai (3 Langkah)", level=2)
    pw.write_paragraph(
        "1. Buka AI image generator. Rekomendasi: Nano Banana / Google Gemini "
        "(gratis dan paling akurat untuk 2 gambar referensi).",
        size=11, space_after=4
    )
    pw.write_paragraph(
        "2. Upload 2 gambar:  (a) foto produk skincare,  (b) foto tangan referensi.",
        size=11, space_after=4
    )
    pw.write_paragraph(
        "3. Pilih salah satu prompt di halaman berikutnya, copy semua, lalu paste "
        "di kolom prompt. Tinggal ganti background sesuai pilihan jika perlu.",
        size=11, space_after=8
    )
    pw.write_paragraph(
        "Catatan: gunakan foto tangan referensi yang SAMA untuk semua produk "
        "biar hasilnya konsisten kayak satu seri katalog.",
        size=10, color=(0.4, 0.4, 0.4), space_after=10
    )

    pw.new_page()

    # ===== Prompts =====
    pw.heading("4 Prompt Utama", level=1)
    pw.write_paragraph(
        "Pilih sesuai jenis produk dan pose yang Anda butuhkan. "
        "Copy seluruh teks di dalam kotak abu-abu.",
        size=10, color=(0.4, 0.4, 0.4), space_after=10
    )

    for p in PROMPTS:
        pw.heading(p["title"], level=2)
        pw.write_paragraph(p["desc"], size=10,
                           color=(0.3, 0.3, 0.3), space_after=6)
        pw.write_code_block(p["content"], size=8, line_height=10)
        pw.y -= 8

    # ===== Backgrounds =====
    pw.new_page()
    pw.heading("10 Pilihan Background", level=1)
    pw.write_paragraph(
        "Ganti bagian BACKGROUND: di prompt mana pun di atas dengan salah satu "
        "pilihan di bawah. Semua dipilih simple dan tidak ramai.",
        size=10, color=(0.4, 0.4, 0.4), space_after=10
    )

    for title, content in BACKGROUNDS:
        pw.heading(title, level=3)
        pw.write_code_block(content, size=8, line_height=10)
        pw.y -= 4

    # ===== Tips =====
    pw.new_page()
    pw.heading("Tips Penting", level=1)
    tips = [
        "Foto tangan referensi: pose memegang sesuatu, latar polos, cahaya jendela, tangan terlihat jelas.",
        "Foto produk: pastikan label terbaca jelas, latar polos lebih bagus.",
        "Generate 3-4 kali, lalu pilih hasil paling natural.",
        "Untuk Midjourney, tambahkan di akhir prompt: --ar 3:4 --style raw --stylize 50",
        "--style raw: mengurangi efek 'AI banget'.",
        "--stylize 50: lebih realistis, kurang artistic.",
        "Untuk konsistensi: gunakan foto tangan referensi yang SAMA untuk semua produk.",
        "Save prompt ini di Notes HP, jadi tinggal copy kapan saja.",
        "Kalau hasil tangan masih beda, tambahkan di awal prompt: 'EXACT same hand as image 2, copy hand identically'.",
    ]
    for t in tips:
        pw.bullet(t, size=11, line_height=15)

    pw.y -= 10
    pw.heading("Tools Rekomendasi", level=2)
    tools = [
        "Nano Banana / Google Gemini - paling jago untuk 2 gambar referensi (gratis).",
        "ChatGPT (Plus) dengan DALL-E 3 - bisa upload 2 gambar.",
        "Flux Kontext - bagus untuk preserve detail label.",
        "Midjourney - pakai --cref untuk referensi karakter/tangan.",
    ]
    for t in tools:
        pw.bullet(t, size=11, line_height=15)

    # Footer note
    pw.y -= 16
    pw.draw_line(pw.MARGIN_L, pw.y, pw.PAGE_W - pw.MARGIN_R, pw.y,
                 r=0.8, g=0.8, b=0.8)
    pw.y -= 16
    pw.write_paragraph(
        "Dibuat untuk Yanzy - Set Prompt Skincare Final. Selamat berkarya!",
        size=10, color=(0.4, 0.4, 0.4)
    )

    return pw.finalize()


def main():
    pages_content = build_document()

    pdf = PDFBuilder()

    # 1) fonts
    font_id = pdf.add_font("Helvetica", "F1")
    bold_id = pdf.add_font("Helvetica-Bold", "F2")
    mono_id = pdf.add_font("Courier", "F3")

    # 2) reserve pages parent first - we know page count
    # We need to add page objects and pages parent. Trick: add pages first
    # but the parent id needs to be referenced. We'll reserve a parent id
    # by adding parent placeholder LAST and use known id.

    # Strategy: add pages with placeholder parent, then patch.
    parent_placeholder_id = len(pdf.objects) + 1 + len(pages_content)
    # Actually, easier: predict parent id = current + N pages*2 (each page adds
    # content stream + page object). Then we add parent at the end with that id.
    # Let's just calculate: each page = 2 objects (stream, page).
    # So parent id will be current_count + 2*N + 1.
    n_pages = len(pages_content)
    parent_id = len(pdf.objects) + 2 * n_pages + 1

    for content in pages_content:
        pdf.add_page(content, parent_id, font_id, bold_id, mono_id, 595, 842)

    # add pages parent
    kids = " ".join(f"{pid} 0 R" for pid in pdf.pages)
    pages_obj = (
        f"<< /Type /Pages /Kids [{kids}] /Count {len(pdf.pages)} >>"
    ).encode()
    actual_parent_id = pdf.add_object(pages_obj)
    assert actual_parent_id == parent_id, f"parent id mismatch: {actual_parent_id} vs {parent_id}"

    # catalog
    catalog = f"<< /Type /Catalog /Pages {parent_id} 0 R >>".encode()
    catalog_id = pdf.add_object(catalog)
    pdf.catalog_id = catalog_id

    out_bytes = pdf.build()

    out_path = "/projects/sandbox/yanzy17/Prompt-Skincare-Yanzy.pdf"
    with open(out_path, "wb") as f:
        f.write(out_bytes)

    size_kb = os.path.getsize(out_path) / 1024
    print(f"OK: {out_path} ({size_kb:.1f} KB, {n_pages} pages)")


if __name__ == "__main__":
    main()
