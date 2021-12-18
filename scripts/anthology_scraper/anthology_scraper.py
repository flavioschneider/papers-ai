import io
import os 
import json
import gzip
import requests
import bibtexparser
from tqdm import tqdm
from requests_futures.sessions import FuturesSession
from concurrent.futures import as_completed

class AnthologyScraper:
    
    URL_ANTHOLOGY_GZ = 'https://aclanthology.org/anthology.bib.gz'
    SS_API_URL = "http://api.semanticscholar.org/graph/v1"    
        
    def _save_to_json(self, obj, file_path=None):
        if file_path is not None:
            json_string = json.dumps(obj, sort_keys=True, indent=2)
            with open(file_path, "w") as file:
                file.write(json_string)
        return obj 
    
    def _load_from_json(self, file_path):
        with open(file_path) as json_file:
            return json.load(json_file)
    
    def _request_many(self, urls):
        session = FuturesSession()
        futures=[session.get(url) for url in urls]
        return [future.result().content for future in tqdm(as_completed(futures))]
    
    def get_papers_meta(self, out_meta_file='papers_meta.json'):
        # Request gzip file 
        response = requests.get(self.URL_ANTHOLOGY_GZ, timeout=30, stream=True)
        # Decompress gzip file to string 
        bibtex_data = gzip.decompress(response.content)
        bibtex_string = str(bibtex_data,'utf-8')
        # Parse bib string to dictionary 
        parser = bibtexparser.bparser.BibTexParser(common_strings=True)
        print('Parsing bibtex metadata to list...')
        metadata = bibtexparser.loads(bibtex_string, parser=parser).entries
        # Save to file if path provided
        return self._save_to_json(metadata, out_meta_file)
    
    
    def get_papers_meta_semantic_scholar(self, out_meta_file='papers_meta_ss.json', limit=100, fields=['paperId'], in_meta_file=None, in_meta=None):
        '''Gets additional semantic scholar metadata e.g. ids.'''
        if in_meta_file is not None: metadata = self._load_from_json(in_meta_file)
        elif in_meta is not None: metadata = in_meta 
        else: metadata = self.get_papers_meta()
        titles = [meta['title'] for meta in metadata][0:limit]
        urls = [f"{self.SS_API_URL}/paper/search?fields={','.join(fields)}&limit=1&query={query}" for query in titles]
        results = [json.loads(str(result, 'utf-8')) for result in self._request_many(urls)]
        for i in range(len(titles)):
            result = results[i]
            # Check if request returned data, if not, error has occured (e.g. max no. requests.)
            if 'data' in result and len(result['data']) > 0: metadata[i] = metadata[i] | result['data'][0] # Merge dicts
            else: print(f"No data for entry {i}: {metadata[i]['ID']}")
        return self._save_to_json(metadata, out_meta_file) 
        
        
    def get_papers_pdfs(self, out_path='./', in_meta_file=None, in_meta=None, start=0, end=None):
        # Get metadata 
        if in_meta_file is not None: metadata_list = self._load_from_json(in_meta_file)
        elif in_meta is not None: metadata_list = in_meta
        else: metadata_list = self.get_papers_meta()
        # Extract urls and ids 
        pdf_urls = [paper['url']+'.pdf' for paper in metadata_list][start:end]
        pdf_names = [paper['ID'] for paper in metadata_list][start:end]
        # Request all pdfs 
        if not os.path.exists(out_path): os.mkdir(out_path) 
        pdf_data = self._request_many(pdf_urls)
        # Save to folder 
        for name, pdf in zip(pdf_names, pdf_data):
            open(f"{out_path}{name}.pdf", 'wb').write(pdf)
            