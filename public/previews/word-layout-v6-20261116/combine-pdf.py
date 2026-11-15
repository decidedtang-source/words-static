from pathlib import Path
from pypdf import PdfReader,PdfWriter
p=Path(__file__).parent;w=PdfWriter()
for suffix,label in [('', '默认折叠'),('-expanded','历史联系展开')]:
 for word in ['scope','leverage','absorb']:
  r=PdfReader(p/'pdf-parts'/(word+suffix+'.pdf'));assert len(r.pages)==1
  w.add_outline_item(word+' · '+label,len(w.pages));w.add_page(r.pages[0])
w.write(p/'review.pdf')
