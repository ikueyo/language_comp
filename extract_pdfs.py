import os
import sys

try:
    from pypdf import PdfReader
except ImportError:
    print("pypdf is not installed. Please install it with: pip install pypdf")
    sys.exit(1)

def extract_text(pdf_path):
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        return ""
    
    print(f"Extracting: {pdf_path}")
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

files = [
    r"c:\Users\Username\Desktop\language competition\語文競賽\高雄市大寮區忠義國小114學年度校內語文競賽實施計畫(公告版).pdf",
    r"c:\Users\Username\Desktop\language competition\語文競賽\高雄市忠義國小114學年度校內語文競賽參賽名冊.報到表1209.pdf"
]

output_file = r"c:\Users\Username\Desktop\language competition\pdf_content_analysis.txt"

with open(output_file, "w", encoding="utf-8") as f:
    for pdf_file in files:
        f.write(f"--- START OF {os.path.basename(pdf_file)} ---\n")
        content = extract_text(pdf_file)
        f.write(content)
        f.write(f"\n--- END OF {os.path.basename(pdf_file)} ---\n\n")

print(f"Extraction complete. Saved to {output_file}")
