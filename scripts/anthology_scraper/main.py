from anthology_scraper import AnthologyScraper 

scraper = AnthologyScraper() 
scraper.get_papers_pdfs(in_meta_file='papers_meta.json', out_pdfs_path='./pdfs/', limit=10)
