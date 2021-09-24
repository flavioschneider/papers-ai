import requests
from requests_futures.sessions import FuturesSession
from concurrent.futures import as_completed

class SemanticScholarAPI:

    API_URL = "http://api.semanticscholar.org/graph/v1"    

    FIELDS_QUERY_ALL = [
        'paperId', 
        'title', 
        'abstract',
        'externalIds', 
        'url',  
        'venue', 
        'year', 
        'referenceCount', 
        'citationCount', 
        'influentialCitationCount',
        'isOpenAccess',
        'fieldsOfStudy',
        'authors'    
    ]

    FIELDS_PAPER_ALL = FIELDS_QUERY_ALL + [     
        'citations',
        'references',
        'embedding'
    ]

    FIELDS_AUTHOR_ALL = [
        'authorId',
        'externalIds',
        'url',
        'name', 
        'aliases',
        'affiliations',
        'homepage',
        'papers'
    ]

    def query(self, query, fields=['title'], offset=0, limit=10):
        url = f"{self.API_URL}/paper/search?fields={','.join(fields)}&offset={offset}&limit={limit}&query={query}"
        return self.request(url)

    def paper(self, paper_id, fields=['title']): 
        url = f"{self.API_URL}/paper/{paper_id}?fields={','.join(fields)}"
        return self.request(url) 
    
    def papers(self, paper_ids, fields=['title']): 
        urls = [f"{self.API_URL}/paper/{paper_id}?fields={','.join(fields)}" for paper_id in paper_ids] 
        return self.requests(urls) 

    def author(self, author_id, fields=['name']):
        url = f"{self.API_URL}/author/{author_id}?fields={','.join(fields)}"
        return self.request(url) 

    def request(self, url):
        r = requests.get(url, timeout=2)
        if r.status_code == 200:
            return r.json()
        else: 
            raise Exception('Unsuccessful request', r.status_code, r.text)

    def requests(self, urls):
        session = FuturesSession()
        futures=[session.get(url) for url in urls]
        return [future.result().json() for future in as_completed(futures)]