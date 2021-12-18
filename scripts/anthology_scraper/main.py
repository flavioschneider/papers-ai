from anthology_scraper import AnthologyScraper 

scraper = AnthologyScraper() 
scraper.get_papers_pdfs(in_meta_file='papers_meta.json', out_path='./pdfs/', start=0, end=5000)
