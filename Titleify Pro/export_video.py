#!/usr/bin/env python3
"""
Titleify Pro - High Definition 1080p Video Generator
Renders an authentic 17-second Breaking Bad opening title sequence matching Titleify Pro.mp4.
Uses Pillow for rendering and FFmpeg for high-speed H.264/AAC encoding.

Usage:
  python export_video.py
  python export_video.py --title1 "Breaking" --title2 "Bad" --subtitle "Created by Vince Gilligan" -o "MyIntro.mp4"
"""

import os
import sys
import math
import argparse
import subprocess
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

ELEMENTS = {
  "h": {"number": 1, "symbol": "H", "name": "Hydrogen", "mass": "1.008", "electrons": "1", "oxidation": ["+1", "-1"], "col": 1, "row": 1},
  "he": {"number": 2, "symbol": "He", "name": "Helium", "mass": "4.0026", "electrons": "2", "oxidation": ["0"], "col": 18, "row": 1},
  "li": {"number": 3, "symbol": "Li", "name": "Lithium", "mass": "6.94", "electrons": "2-1", "oxidation": ["+1"], "col": 1, "row": 2},
  "be": {"number": 4, "symbol": "Be", "name": "Beryllium", "mass": "9.0122", "electrons": "2-2", "oxidation": ["+2"], "col": 2, "row": 2},
  "b": {"number": 5, "symbol": "B", "name": "Boron", "mass": "10.81", "electrons": "2-3", "oxidation": ["+3"], "col": 13, "row": 2},
  "c": {"number": 6, "symbol": "C", "name": "Carbon", "mass": "12.011", "electrons": "2-4", "oxidation": ["+4", "-4"], "col": 14, "row": 2},
  "n": {"number": 7, "symbol": "N", "name": "Nitrogen", "mass": "14.007", "electrons": "2-5", "oxidation": ["-3", "+5"], "col": 15, "row": 2},
  "o": {"number": 8, "symbol": "O", "name": "Oxygen", "mass": "15.999", "electrons": "2-6", "oxidation": ["-2"], "col": 16, "row": 2},
  "f": {"number": 9, "symbol": "F", "name": "Fluorine", "mass": "18.998", "electrons": "2-7", "oxidation": ["-1"], "col": 17, "row": 2},
  "ne": {"number": 10, "symbol": "Ne", "name": "Neon", "mass": "20.180", "electrons": "2-8", "oxidation": ["0"], "col": 18, "row": 2},
  "na": {"number": 11, "symbol": "Na", "name": "Sodium", "mass": "22.990", "electrons": "2-8-1", "oxidation": ["+1"], "col": 1, "row": 3},
  "mg": {"number": 12, "symbol": "Mg", "name": "Magnesium", "mass": "24.305", "electrons": "2-8-2", "oxidation": ["+2"], "col": 2, "row": 3},
  "al": {"number": 13, "symbol": "Al", "name": "Aluminium", "mass": "26.982", "electrons": "2-8-3", "oxidation": ["+3"], "col": 13, "row": 3},
  "si": {"number": 14, "symbol": "Si", "name": "Silicon", "mass": "28.085", "electrons": "2-8-4", "oxidation": ["+4"], "col": 14, "row": 3},
  "p": {"number": 15, "symbol": "P", "name": "Phosphorus", "mass": "30.974", "electrons": "2-8-5", "oxidation": ["+5", "-3"], "col": 15, "row": 3},
  "s": {"number": 16, "symbol": "S", "name": "Sulfur", "mass": "32.06", "electrons": "2-8-6", "oxidation": ["+6", "-2"], "col": 16, "row": 3},
  "cl": {"number": 17, "symbol": "Cl", "name": "Chlorine", "mass": "35.45", "electrons": "2-8-7", "oxidation": ["-1", "+1"], "col": 17, "row": 3},
  "ar": {"number": 18, "symbol": "Ar", "name": "Argon", "mass": "39.948", "electrons": "2-8-8", "oxidation": ["0"], "col": 18, "row": 3},
  "k": {"number": 19, "symbol": "K", "name": "Potassium", "mass": "39.098", "electrons": "2-8-8-1", "oxidation": ["+1"], "col": 1, "row": 4},
  "ca": {"number": 20, "symbol": "Ca", "name": "Calcium", "mass": "40.078", "electrons": "2-8-8-2", "oxidation": ["+2"], "col": 2, "row": 4},
  "sc": {"number": 21, "symbol": "Sc", "name": "Scandium", "mass": "44.956", "electrons": "2-8-9-2", "oxidation": ["+3"], "col": 3, "row": 4},
  "ti": {"number": 22, "symbol": "Ti", "name": "Titanium", "mass": "47.867", "electrons": "2-8-10-2", "oxidation": ["+4"], "col": 4, "row": 4},
  "v": {"number": 23, "symbol": "V", "name": "Vanadium", "mass": "50.942", "electrons": "2-8-11-2", "oxidation": ["+5"], "col": 5, "row": 4},
  "cr": {"number": 24, "symbol": "Cr", "name": "Chromium", "mass": "51.996", "electrons": "2-8-13-1", "oxidation": ["+2", "+3", "+6"], "col": 6, "row": 4},
  "mn": {"number": 25, "symbol": "Mn", "name": "Manganese", "mass": "54.938", "electrons": "2-8-13-2", "oxidation": ["+2", "+4", "+7"], "col": 7, "row": 4},
  "fe": {"number": 26, "symbol": "Fe", "name": "Iron", "mass": "55.845", "electrons": "2-8-14-2", "oxidation": ["+2", "+3"], "col": 8, "row": 4},
  "co": {"number": 27, "symbol": "Co", "name": "Cobalt", "mass": "58.933", "electrons": "2-8-15-2", "oxidation": ["+2", "+3"], "col": 9, "row": 4},
  "ni": {"number": 28, "symbol": "Ni", "name": "Nickel", "mass": "58.693", "electrons": "2-8-16-2", "oxidation": ["+2"], "col": 10, "row": 4},
  "cu": {"number": 29, "symbol": "Cu", "name": "Copper", "mass": "63.546", "electrons": "2-8-18-1", "oxidation": ["+1", "+2"], "col": 11, "row": 4},
  "zn": {"number": 30, "symbol": "Zn", "name": "Zinc", "mass": "65.38", "electrons": "2-8-18-2", "oxidation": ["+2"], "col": 12, "row": 4},
  "ga": {"number": 31, "symbol": "Ga", "name": "Gallium", "mass": "69.723", "electrons": "2-8-18-3", "oxidation": ["+3"], "col": 13, "row": 4},
  "ge": {"number": 32, "symbol": "Ge", "name": "Germanium", "mass": "72.630", "electrons": "2-8-18-4", "oxidation": ["+4"], "col": 14, "row": 4},
  "as": {"number": 33, "symbol": "As", "name": "Arsenic", "mass": "74.922", "electrons": "2-8-18-5", "oxidation": ["+3", "-3"], "col": 15, "row": 4},
  "se": {"number": 34, "symbol": "Se", "name": "Selenium", "mass": "78.971", "electrons": "2-8-18-6", "oxidation": ["+4", "-2"], "col": 16, "row": 4},
  "br": {"number": 35, "symbol": "Br", "name": "Bromine", "mass": "79.904", "electrons": "2-8-18-7", "oxidation": ["-1", "+1", "+5"], "col": 17, "row": 4},
  "kr": {"number": 36, "symbol": "Kr", "name": "Krypton", "mass": "83.798", "electrons": "2-8-18-8", "oxidation": ["0", "+2"], "col": 18, "row": 4},
  "rb": {"number": 37, "symbol": "Rb", "name": "Rubidium", "mass": "85.468", "electrons": "2-8-18-8-1", "oxidation": ["+1"], "col": 1, "row": 5},
  "sr": {"number": 38, "symbol": "Sr", "name": "Strontium", "mass": "87.62", "electrons": "2-8-18-8-2", "oxidation": ["+2"], "col": 2, "row": 5},
  "y": {"number": 39, "symbol": "Y", "name": "Yttrium", "mass": "88.906", "electrons": "2-8-18-9-2", "oxidation": ["+3"], "col": 3, "row": 5},
  "zr": {"number": 40, "symbol": "Zr", "name": "Zirconium", "mass": "91.224", "electrons": "2-8-18-10-2", "oxidation": ["+4"], "col": 4, "row": 5},
  "nb": {"number": 41, "symbol": "Nb", "name": "Niobium", "mass": "92.906", "electrons": "2-8-18-12-1", "oxidation": ["+5"], "col": 5, "row": 5},
  "mo": {"number": 42, "symbol": "Mo", "name": "Molybdenum", "mass": "95.95", "electrons": "2-8-18-13-1", "oxidation": ["+6"], "col": 6, "row": 5},
  "tc": {"number": 43, "symbol": "Tc", "name": "Technetium", "mass": "[98]", "electrons": "2-8-18-13-2", "oxidation": ["+7"], "col": 7, "row": 5},
  "ru": {"number": 44, "symbol": "Ru", "name": "Ruthenium", "mass": "101.07", "electrons": "2-8-18-15-1", "oxidation": ["+3", "+4"], "col": 8, "row": 5},
  "rh": {"number": 45, "symbol": "Rh", "name": "Rhodium", "mass": "102.91", "electrons": "2-8-18-16-1", "oxidation": ["+3"], "col": 9, "row": 5},
  "pd": {"number": 46, "symbol": "Pd", "name": "Palladium", "mass": "106.42", "electrons": "2-8-18-18", "oxidation": ["+2", "+4"], "col": 10, "row": 5},
  "ag": {"number": 47, "symbol": "Ag", "name": "Silver", "mass": "107.87", "electrons": "2-8-18-18-1", "oxidation": ["+1"], "col": 11, "row": 5},
  "cd": {"number": 48, "symbol": "Cd", "name": "Cadmium", "mass": "112.41", "electrons": "2-8-18-18-2", "oxidation": ["+2"], "col": 12, "row": 5},
  "in": {"number": 49, "symbol": "In", "name": "Indium", "mass": "114.82", "electrons": "2-8-18-18-3", "oxidation": ["+3"], "col": 13, "row": 5},
  "sn": {"number": 50, "symbol": "Sn", "name": "Tin", "mass": "118.71", "electrons": "2-8-18-18-4", "oxidation": ["+4"], "col": 14, "row": 5},
  "sb": {"number": 51, "symbol": "Sb", "name": "Antimony", "mass": "121.76", "electrons": "2-8-18-18-5", "oxidation": ["+3", "+5"], "col": 15, "row": 5},
  "te": {"number": 52, "symbol": "Te", "name": "Tellurium", "mass": "127.60", "electrons": "2-8-18-18-6", "oxidation": ["+4", "-2"], "col": 16, "row": 5},
  "i": {"number": 53, "symbol": "I", "name": "Iodine", "mass": "126.90", "electrons": "2-8-18-18-7", "oxidation": ["-1", "+1", "+5"], "col": 17, "row": 5},
  "xe": {"number": 54, "symbol": "Xe", "name": "Xenon", "mass": "131.29", "electrons": "2-8-18-18-8", "oxidation": ["0", "+2"], "col": 18, "row": 5},
  "cs": {"number": 55, "symbol": "Cs", "name": "Caesium", "mass": "132.91", "electrons": "2-8-18-18-8-1", "oxidation": ["+1"], "col": 1, "row": 6},
  "ba": {"number": 56, "symbol": "Ba", "name": "Barium", "mass": "137.33", "electrons": "2-8-18-18-8-2", "oxidation": ["+2"], "col": 2, "row": 6},
  "la": {"number": 57, "symbol": "La", "name": "Lanthanum", "mass": "138.91", "electrons": "2-8-18-18-9-2", "oxidation": ["+3"], "col": 3, "row": 6},
  "hf": {"number": 72, "symbol": "Hf", "name": "Hafnium", "mass": "178.49", "electrons": "2-8-18-32-10-2", "oxidation": ["+4"], "col": 4, "row": 6},
  "ta": {"number": 73, "symbol": "Ta", "name": "Tantalum", "mass": "180.95", "electrons": "2-8-18-32-11-2", "oxidation": ["+5"], "col": 5, "row": 6},
  "w": {"number": 74, "symbol": "W", "name": "Tungsten", "mass": "183.84", "electrons": "2-8-18-32-12-2", "oxidation": ["+6", "+4"], "col": 6, "row": 6}
}

def tokenize_word(word):
    if not word:
        return {"prefix": "", "element": None, "suffix": "", "has_element": False}
    w_low = word.lower()
    for i in range(len(w_low) - 1):
        pair = w_low[i:i+2]
        if pair in ELEMENTS:
            return {"prefix": word[:i], "element": ELEMENTS[pair], "suffix": word[i+2:], "has_element": True}
    for i in range(len(w_low)):
        single = w_low[i:i+1]
        if single in ELEMENTS:
            return {"prefix": word[:i], "element": ELEMENTS[single], "suffix": word[i+1:], "has_element": True}
    return {"prefix": word, "element": None, "suffix": "", "has_element": False}

def tokenize_subtitle(text):
    if not text:
        return {"line1": "", "line2": "", "token1": None, "token1_suffix": ""}
    parts = text.strip().split()
    if len(parts) >= 3 and parts[1].lower() == 'by':
        t1 = tokenize_word(parts[0])
        return {
            "line1": parts[0] + " " + parts[1],
            "line2": " ".join(parts[2:]),
            "token1": t1,
            "token1_suffix": " " + parts[1]
        }
    return {
        "line1": text.strip(),
        "line2": "",
        "token1": tokenize_word(parts[0] if parts else ""),
        "token1_suffix": " " + " ".join(parts[1:]) if len(parts) > 1 else ""
    }

def get_fonts():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    f_cooper = os.path.join(base_dir, "fonts", "BreakingCooper-Medium.ttf")
    f_arial = os.path.join(base_dir, "fonts", "ArialNarrow.ttf")
    return f_cooper, f_arial

def draw_chemical_badge(draw, elem, x, y, size, f_cooper, f_arial, mult=1.0):
    r, g, b = int(28 * mult), int(88 * mult), int(42 * mult)
    draw.rectangle([x, y, x + size, y + size], fill=(r, g, b), outline=(int(220 * mult), int(255 * mult), int(230 * mult)), width=3)
    f_m = ImageFont.truetype(f_arial, int(size * 0.125))
    draw.text((x + int(size * 0.08), y + int(size * 0.07)), str(elem["mass"]), font=f_m, fill=(int(255 * mult), int(255 * mult), int(255 * mult)), anchor="lt")
    if elem.get("oxidation"):
        f_ox = ImageFont.truetype(f_arial, int(size * 0.11))
        draw.text((x + size - int(size * 0.08), y + int(size * 0.07)), elem["oxidation"][0], font=f_ox, fill=(int(255 * mult), int(255 * mult), int(255 * mult)), anchor="rt")
    f_sym = ImageFont.truetype(f_cooper, int(size * 0.54))
    draw.text((x + size // 2, y + int(size * 0.52)), elem["symbol"], font=f_sym, fill=(int(255 * mult), int(255 * mult), int(255 * mult)), anchor="mm")
    f_num = ImageFont.truetype(f_arial, int(size * 0.14))
    draw.text((x + int(size * 0.08), y + size - int(size * 0.16)), str(elem["number"]), font=f_num, fill=(int(255 * mult), int(255 * mult), int(255 * mult)), anchor="lb")
    if elem.get("electrons"):
        f_el = ImageFont.truetype(f_arial, int(size * 0.095))
        draw.text((x + int(size * 0.08), y + size - int(size * 0.06)), elem["electrons"], font=f_el, fill=(int(220 * mult), int(255 * mult), int(230 * mult)), anchor="lb")

def render_frame(t, width, height, token1, token2, sub_data, f_cooper, f_arial):
    img = Image.new("RGB", (width, height), (7, 18, 10))
    draw = ImageDraw.Draw(img)
    cx, cy = width // 2, int(height * 0.46)

    if t < 2.5:
        formulas = ["C10H15N", "149.24", "meth", "CH3NH2", "C10", "H15", "N", "149.24"]
        fade = min(1.0, t / 0.5) if t < 2.0 else max(0.0, (2.5 - t) / 0.5)
        for i, ftext in enumerate(formulas):
            z = (500 + i * 160 - t * 240) % 1200 + 40
            scale = 450 / (450 + z)
            px = int(cx + (math.sin(i * 1.7) * 550) * scale)
            py = int(cy + (math.cos(i * 2.3) * 350) * scale)
            sz = max(10, int(32 * scale * 2.5))
            fnt = ImageFont.truetype(f_cooper, sz)
            col = (int(140 * fade), int(210 * fade), int(160 * fade)) if ftext != "meth" else (int(80 * fade), int(160 * fade), int(100 * fade))
            draw.text((px, py), ftext, font=fnt, fill=col, anchor="mm")

    elif t < 5.5:
        p2 = t - 2.5
        e1 = token1["element"] if token1["has_element"] else ELEMENTS["br"]
        e2 = token2["element"] if token2["has_element"] else ELEMENTS["ba"]
        if p2 < 1.3:
            interp = p2 / 1.3
            cam_col = 14.0 + (e1["col"] - 14.0) * interp
            cam_row = 3.5 + (e1["row"] - 3.5) * interp
            zoom = 0.9 + 0.6 * interp
        elif p2 < 2.3:
            interp = (p2 - 1.3) / 1.0
            cam_col = e1["col"] + (e2["col"] - e1["col"]) * interp
            cam_row = e1["row"] + (e2["row"] - e1["row"]) * interp
            zoom = 1.5 + 0.2 * math.sin(interp * math.pi)
        else:
            interp = (p2 - 2.3) / 0.7
            cam_col = e2["col"] + (9.5 - e2["col"]) * interp
            cam_row = e2["row"] + (4.0 - e2["row"]) * interp
            zoom = 1.7 + interp * 1.5

        cell_size = int(140 * zoom)
        gap = int(8 * zoom)

        for sym, el in ELEMENTS.items():
            gx = cx + int((el["col"] - cam_col) * (cell_size + gap))
            gy = cy + int((el["row"] - cam_row) * (cell_size + gap))
            if gx < -200 or gx > width + 200 or gy < -200 or gy > height + 200:
                continue
            is_e1 = el["symbol"].lower() == e1["symbol"].lower() and p2 >= 0.7
            is_e2 = el["symbol"].lower() == e2["symbol"].lower() and p2 >= 1.7
            is_lock = is_e1 or is_e2

            bg_col = (28, 95, 46) if is_lock else (12, 28, 16)
            outline_col = (98, 246, 142) if is_lock else (45, 90, 55)
            draw.rectangle([gx, gy, gx + cell_size, gy + cell_size], fill=bg_col, outline=outline_col, width=max(1, int(2 * zoom)))

            f_sym = ImageFont.truetype(f_cooper, max(8, int(cell_size * 0.44)))
            draw.text((gx + cell_size // 2, gy + int(cell_size * 0.52)), el["symbol"], font=f_sym, fill=(255, 255, 255), anchor="mm")
            f_num = ImageFont.truetype(f_arial, max(6, int(cell_size * 0.13)))
            draw.text((gx + int(cell_size * 0.1), gy + cell_size - int(cell_size * 0.08)), str(el["number"]), font=f_num, fill=(220, 255, 230), anchor="ls")

    elif t < 12.2:
        p3 = t - 5.5
        font_size = 145
        tile_size = int(font_size * 1.08)
        line_height = int(font_size * 1.2)
        f_title = ImageFont.truetype(f_cooper, font_size)

        row1_y = cy - int(line_height * 0.55)
        row2_y = cy + int(line_height * 0.55)

        p1 = token1["prefix"]
        s1 = token1["suffix"]
        p1_w = int(draw.textlength(p1, font=f_title)) if p1 else 0
        s1_w = int(draw.textlength(s1, font=f_title)) if s1 else 0
        row1_w = p1_w + (tile_size + 14 if token1["has_element"] else 0) + s1_w

        row1_x = cx - int(row1_w * 0.52)
        row2_x = row1_x + p1_w + int(tile_size * 0.85)

        cur_x = row1_x
        if p1:
            draw.text((cur_x, row1_y), p1, font=f_title, fill=(245, 246, 237), anchor="lm")
            cur_x += p1_w + 4
        if token1["has_element"]:
            draw_chemical_badge(draw, token1["element"], cur_x, row1_y - tile_size // 2, tile_size, f_cooper, f_arial)
            cur_x += tile_size + 12
        if s1:
            draw.text((cur_x, row1_y), s1, font=f_title, fill=(245, 246, 237), anchor="lm")

        p2 = token2["prefix"]
        s2 = token2["suffix"]
        cur_x2 = row2_x
        if p2:
            draw.text((cur_x2, row2_y), p2, font=f_title, fill=(245, 246, 237), anchor="lm")
            cur_x2 += int(draw.textlength(p2, font=f_title)) + 4
        if token2["has_element"]:
            draw_chemical_badge(draw, token2["element"], cur_x2, row2_y - tile_size // 2, tile_size, f_cooper, f_arial)
            cur_x2 += tile_size + 12
        if s2:
            draw.text((cur_x2, row2_y), s2, font=f_title, fill=(245, 246, 237), anchor="lm")

        if p3 > 1.2:
            smoke_t = p3 - 1.2
            flow_x = min(900, int(smoke_t * 180))
            for i in range(35):
                spx = 1500 - flow_x + int(math.sin(smoke_t * 2 + i) * 60)
                spy = 700 - int(smoke_t * 45) + int(math.cos(smoke_t * 1.5 + i) * 40)
                srad = int(120 + smoke_t * 18 + i * 2)
                draw.ellipse([spx - srad, spy - srad, spx + srad, spy + srad], fill=None, outline=(210, 190, 35), width=max(1, int(3 * (1.0 - i/35.0))))

    else:
        p4 = t - 12.2
        fade_in = min(1.0, p4 / 0.8)
        black_fade = min(1.0, (p4 - 3.2) / 1.5) if p4 > 3.2 else 0.0
        mult = fade_in * (1.0 - black_fade)

        f_size = 90
        tile_sz = int(f_size * 1.05)
        f_sub = ImageFont.truetype(f_cooper, f_size)
        f_sub2 = ImageFont.truetype(f_cooper, int(f_size * 0.88))

        token = sub_data["token1"]
        line1_y = cy - int(f_size * 0.75) if sub_data["line2"] else cy
        line2_y = cy + int(f_size * 0.75)

        prefix = token["prefix"] if token else ""
        suffix = (token["suffix"] if token else "") + sub_data.get("token1_suffix", "")
        pw = int(draw.textlength(prefix, font=f_sub)) if prefix else 0
        sw = int(draw.textlength(suffix, font=f_sub)) if suffix else 0
        tw = tile_sz + 12 if (token and token["has_element"]) else 0
        tot_w = pw + tw + sw
        cx_sub = cx - tot_w // 2

        val = int(245 * mult)
        col = (val, val, int(val * 0.95))

        if prefix:
            draw.text((cx_sub, line1_y), prefix, font=f_sub, fill=col, anchor="lm")
            cx_sub += pw + 4
        if token and token["has_element"]:
            draw_chemical_badge(draw, token["element"], cx_sub, line1_y - tile_sz // 2, tile_sz, f_cooper, f_arial, mult)
            cx_sub += tile_sz + 10
        if suffix:
            draw.text((cx_sub, line1_y), suffix, font=f_sub, fill=col, anchor="lm")

        if sub_data["line2"]:
            draw.text((cx, line2_y), sub_data["line2"], font=f_sub2, fill=col, anchor="mm")

    return img

def main():
    parser = argparse.ArgumentParser(description="Titleify Pro Video Generator")
    parser.add_argument("--title1", default="Breaking", help="First title word")
    parser.add_argument("--title2", default="Bad", help="Second title word")
    parser.add_argument("--subtitle", default="Created by Vince Gilligan", help="Subtitle / Credits")
    parser.add_argument("-o", "--output", default="Titleify-Intro.mp4", help="Output MP4 file")
    parser.add_argument("--fps", type=int, default=30, help="Frames per second")
    args = parser.parse_args()

    width, height = 1920, 1080
    duration = 17.1
    total_frames = int(duration * args.fps)

    f_cooper, f_arial = get_fonts()
    token1 = tokenize_word(args.title1)
    token2 = tokenize_word(args.title2)
    sub_data = tokenize_subtitle(args.subtitle)

    audio_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "audio", "theme.mp3")
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

    cmd = [
        ffmpeg, "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{width}x{height}",
        "-pix_fmt", "rgb24",
        "-r", str(args.fps),
        "-i", "-",
        "-i", audio_file,
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        args.output
    ]

    print(f"Rendering '{args.title1}' & '{args.title2}' ({total_frames} frames @ {args.fps}fps) -> {args.output}...")
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)

    for f_idx in range(total_frames):
        t = f_idx / args.fps
        img = render_frame(t, width, height, token1, token2, sub_data, f_cooper, f_arial)
        proc.stdin.write(img.tobytes())
        if f_idx % (args.fps * 2) == 0 or f_idx == total_frames - 1:
            pct = int((f_idx / total_frames) * 100)
            print(f"Progress: {pct}% [{f_idx}/{total_frames}]", end="\r", flush=True)

    proc.stdin.close()
    proc.wait()
    print(f"\n[DONE] Successfully created {args.output} with authentic theme soundtrack!")

if __name__ == "__main__":
    main()
