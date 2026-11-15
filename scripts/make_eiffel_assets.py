"""Generate authentic 1920s vintage period-accurate graphical assets for Eiffel Tower heist."""
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = Path("public/eiffel-con")
OUT_DIR.mkdir(parents=True, exist_ok=True)

SERIF = "projects/one-dollar-bank/fonts/Caladea-Bold.ttf"
SANS = "projects/one-dollar-bank/fonts/Inter-Black.otf"

def f_serif(size):
    try: return ImageFont.truetype(SERIF, size)
    except: return ImageFont.load_default()

def f_sans(size):
    try: return ImageFont.truetype(SANS, size)
    except: return ImageFont.load_default()

W, H = 1920, 1080

def create_vintage_newspaper():
    img = Image.new("RGB", (W, H), (236, 228, 210))
    draw = ImageDraw.Draw(img)
    
    draw.rectangle([50, 40, W-50, H-40], outline=(70, 50, 40), width=4)
    draw.rectangle([60, 50, W-60, H-50], outline=(120, 100, 80), width=1)
    
    draw.text((W//2, 105), "LE FIGARO", fill=(30, 25, 20), anchor="mm", font=f_serif(84))
    draw.text((W//2, 160), "EDITION DU MATIN - PARIS, MARS 1925 - 50 CENTIMES", fill=(80, 70, 60), anchor="mm", font=f_sans(20))
    draw.line([80, 185, W-80, 185], fill=(50, 40, 30), width=3)
    
    draw.text((W//2, 255), "FAUT-IL DEMOLIR LA TOUR EIFFEL ?", fill=(20, 15, 10), anchor="mm", font=f_serif(62))
    draw.text((W//2, 320), "7,000 TONNES DE FERRAILLE EN DANGER - COUTS D'ENTRETIEN IMPOSSIBLES", fill=(110, 40, 30), anchor="mm", font=f_sans(24))
    draw.line([80, 355, W-80, 355], fill=(70, 55, 45), width=2)
    
    draw.text((120, 395), "LA ROUILLE ENVAHIT LE GIGANTIQUE MONUMENT", fill=(40, 30, 25), font=f_serif(30))
    col1 = (
        "Construite pour l'Exposition de 1889,\n"
        "la Tour ne devait durer que vingt ans.\n"
        "Aujourd'hui, la peinture s'ecaille et la\n"
        "rouille ronge chaque poutrelle d'acier.\n\n"
        "La Ville de Paris refuse de financer\n"
        "les millions necessaires aux travaux.\n"
        "Des voix s'elevent deja pour vendre le\n"
        "monument aux encheres pour sa ferraille."
    )
    draw.multiline_text((120, 455), col1, fill=(50, 45, 40), font=f_serif(26), spacing=12)
    
    draw.rectangle([1120, 400, 1820, 950], fill=(225, 215, 195), outline=(120, 100, 80), width=2)
    draw.text((1470, 445), "RAPPORT OFFICIEL", fill=(50, 40, 30), anchor="mm", font=f_serif(30))
    draw.text((1470, 490), "COMMISSION DES FINANCES DE PARIS", fill=(100, 80, 60), anchor="mm", font=f_sans(18))
    
    report_text = (
        "Le demontage complet de la Tour Eiffel\n"
        "pourrait rapporter des millions de francs\n"
        "sur le marche des metaux de recuperation.\n\n"
        "Des demarches discretes aupres des\n"
        "industriels de la ferraille sont ouvertes\n"
        "dans le plus grand secret."
    )
    draw.multiline_text((1160, 545), report_text, fill=(40, 35, 30), font=f_serif(25), spacing=12)
    
    # Red slanted stamp
    stamp_img = Image.new("RGBA", (660, 160), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(stamp_img)
    sdraw.rectangle([8, 8, 645, 145], outline=(190, 30, 30, 220), width=7)
    sdraw.text((325, 45), "DOSSIER CONFIDENTIEL", fill=(190, 30, 30, 220), anchor="mm", font=f_sans(34))
    sdraw.text((325, 105), "DEMOLITION ET VENTE", fill=(190, 30, 30, 220), anchor="mm", font=f_sans(30))
    stamp_rot = stamp_img.rotate(12, expand=True, resample=Image.BICUBIC)
    
    img.paste(stamp_rot, (1150, 720), stamp_rot)
    img.save(OUT_DIR / "scene2_newspaper_demolition.jpg", quality=95)
    print("Created scene2_newspaper_demolition.jpg")

def create_forged_ministry_document():
    img = Image.new("RGB", (W, H), (243, 237, 222))
    draw = ImageDraw.Draw(img)
    
    draw.rectangle([45, 35, W-45, H-35], outline=(60, 50, 40), width=3)
    draw.rectangle([60, 50, W-60, H-50], outline=(170, 150, 120), width=1)
    
    draw.text((W//2, 95), "REPUBLIQUE FRANCAISE", fill=(40, 35, 30), anchor="mm", font=f_serif(44))
    draw.text((W//2, 145), "MINISTERE DES POSTES ET DES TELEGRAPHES", fill=(90, 45, 35), anchor="mm", font=f_sans(26))
    draw.text((W//2, 185), "DIRECTION GENERALE DES BATIMENTS ET MONUMENTS", fill=(100, 90, 80), anchor="mm", font=f_sans(18))
    draw.line([250, 215, W-250, 215], fill=(90, 70, 50), width=2)
    
    draw.text((140, 270), "AVIS STRICTEMENT CONFIDENTIEL - CESSION EXCEPTIONNELLE", fill=(160, 30, 30), font=f_sans(30))
    
    contract_lines = (
        "Par decision speciale du Gouvernement de la Republique,\n"
        "la structure metallique de la Tour Eiffel (7 300 tonnes de fer forgé)\n"
        "est mise en adjudication privee pour demontage et recuperation.\n\n"
        "Afin d'eviter tout mouvement de panique ou scandale public,\n"
        "les negociations demeurent sous le sceau du secret d'Etat absolu.\n\n"
        "Representant accredite de l'Etat Francais :\n"
        "Monsieur le Comte Victor LUSTIG, Delegue General Extraordinaire.\n\n"
        "Negociant invite : Monsieur Andre POISSON, Metallurgie Parisienne."
    )
    draw.multiline_text((140, 345), contract_lines, fill=(35, 30, 25), font=f_serif(26), spacing=12)
    
    draw.line([120, 800, W-120, 800], fill=(120, 100, 80), width=1)
    draw.text((280, 840), "Le Delegue Ministeriel :", fill=(80, 70, 60), font=f_serif(24))
    draw.text((280, 890), "Count Victor Lustig", fill=(20, 30, 80), font=f_serif(42))
    
    draw.text((1320, 840), "L'Adjudicataire Agréé :", fill=(80, 70, 60), font=f_serif(24))
    draw.text((1320, 890), "Andre Poisson", fill=(70, 35, 25), font=f_serif(40))
    
    # Red Seal
    seal_img = Image.new("RGBA", (280, 280), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(seal_img)
    sdraw.ellipse([15, 15, 265, 265], fill=(160, 30, 25, 230), outline=(110, 20, 15, 255), width=6)
    sdraw.ellipse([35, 35, 245, 245], outline=(210, 80, 60, 200), width=2)
    sdraw.text((140, 95), "SCEAU", fill=(245, 230, 210, 240), anchor="mm", font=f_sans(28))
    sdraw.text((140, 140), "D'ETAT", fill=(245, 230, 210, 240), anchor="mm", font=f_sans(28))
    sdraw.text((140, 185), "* 1925 *", fill=(245, 230, 210, 230), anchor="mm", font=f_sans(22))
    
    img.paste(seal_img, (W//2 - 140, 735), seal_img)
    img.save(OUT_DIR / "scene3_forged_credentials.jpg", quality=95)
    print("Created scene3_forged_credentials.jpg")

def create_poisson_silent_shame():
    img = Image.new("RGB", (W, H), (20, 18, 24))
    draw = ImageDraw.Draw(img)
    
    draw.rectangle([W//2 - 450, 180, W//2 + 450, 880], fill=(218, 208, 188), outline=(70, 50, 40), width=3)
    draw.text((W//2, 245), "CONFIDENTIEL - DOSSIER POISSON", fill=(130, 30, 30), anchor="mm", font=f_sans(36))
    draw.text((W//2, 300), "AFFAIRE DE L'ACHAT DE LA TOUR EIFFEL (1925)", fill=(60, 50, 40), anchor="mm", font=f_serif(24))
    draw.line([W//2 - 380, 340, W//2 + 380, 340], fill=(120, 100, 80), width=2)
    
    poisson_notes = (
        "Constat : L'acheteur s'est apercu de la supercherie.\n"
        "Montant verse : Plusieurs millions de francs + pot-de-vin.\n\n"
        "Reaction de la victime :\n"
        "- Aucune plainte deposee aupres de la Prefecture de Police.\n"
        "- Terreur absolue du ridicule public et du deshonneur social.\n"
        "- Les documents de cession ont ete brules en secret.\n\n"
        "Conclusion : Silence total. L'escroc a quitte le territoire."
    )
    draw.multiline_text((W//2 - 380, 385), poisson_notes, fill=(35, 30, 25), font=f_serif(26), spacing=12)
    
    stamp_img = Image.new("RGBA", (840, 180), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(stamp_img)
    sdraw.rectangle([8, 8, 825, 165], outline=(195, 25, 25, 230), width=9)
    sdraw.text((415, 55), "JAMAIS SIGNALE A LA POLICE", fill=(195, 25, 25, 230), anchor="mm", font=f_sans(38))
    sdraw.text((415, 115), "PARALYSE PAR LA HONTE", fill=(195, 25, 25, 230), anchor="mm", font=f_sans(32))
    stamp_rot = stamp_img.rotate(-11, expand=True, resample=Image.BICUBIC)
    
    img.paste(stamp_rot, (W//2 - 420, 560), stamp_rot)
    img.save(OUT_DIR / "scene8_poisson_silent_shame.jpg", quality=95)
    print("Created scene8_poisson_silent_shame.jpg")

def create_second_sale_stamp():
    base_path = OUT_DIR / "scene4_crillon_secret_meeting.jpg"
    img = Image.open(base_path).convert("RGBA").resize((W, H), Image.Resampling.LANCZOS)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    
    stamp_img = Image.new("RGBA", (980, 240), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(stamp_img)
    sdraw.rectangle([8, 8, 965, 225], fill=(18, 14, 14, 220), outline=(230, 185, 45, 255), width=8)
    sdraw.text((485, 70), "6 MONTHS LATER - PARIS", fill=(245, 205, 55, 255), anchor="mm", font=f_sans(42))
    sdraw.text((485, 155), "SOLD THE TOWER A SECOND TIME!", fill=(255, 65, 65, 255), anchor="mm", font=f_sans(38))
    stamp_rot = stamp_img.rotate(5, expand=True, resample=Image.BICUBIC)
    
    overlay.paste(stamp_rot, (W//2 - 460, H//2 - 130), stamp_rot)
    final = Image.alpha_composite(img, overlay)
    final.convert("RGB").save(OUT_DIR / "scene10_sold_second_time.jpg", quality=95)
    print("Created scene10_sold_second_time.jpg")

def create_the_lesson_card():
    img = Image.new("RGB", (W, H), (14, 17, 24))
    draw = ImageDraw.Draw(img)
    
    draw.rectangle([100, 70, W-100, H-70], outline=(180, 150, 90), width=4)
    draw.rectangle([118, 88, W-118, H-88], outline=(90, 75, 50), width=1)
    
    draw.text((W//2, 190), "THE HISTORICAL LESSON", fill=(225, 185, 75), anchor="mm", font=f_sans(34))
    draw.line([W//2 - 250, 230, W//2 + 250, 230], fill=(180, 150, 90), width=2)
    
    quote1 = "In the end, Mr. Victor Lustig wasn't selling an iron tower..."
    quote2 = "HE WAS SELLING HUMAN GREED."
    
    draw.text((W//2, 400), quote1, fill=(240, 230, 215), anchor="mm", font=f_serif(40))
    draw.text((W//2, 520), quote2, fill=(255, 75, 75), anchor="mm", font=f_sans(58))
    
    draw.text((W//2, 690), "PARIS, 1925 - THE GREATEST CON IN HUMAN HISTORY", fill=(175, 165, 145), anchor="mm", font=f_sans(26))
    draw.text((W//2, 750), "Mr. Victor Lustig (1890 - 1947)", fill=(130, 120, 100), anchor="mm", font=f_serif(22))
    
    img.save(OUT_DIR / "scene11_lustig_legacy_lesson.jpg", quality=95)
    print("Created scene11_lustig_legacy_lesson.jpg")

if __name__ == "__main__":
    create_vintage_newspaper()
    create_forged_ministry_document()
    create_poisson_silent_shame()
    create_second_sale_stamp()
    create_the_lesson_card()
