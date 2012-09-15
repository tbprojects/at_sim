watch( '.bib' )  {|md| system("bibtex szablon_mgr.aux")}
watch( '.tex' )  {|md| system("pdflatex szablon_mgr.tex") }
