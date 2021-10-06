import json
import torch
import hdbscan
from ..datamodules.apis.semantic_scholar_api import SemanticScholarAPI
from sklearn.manifold import TSNE
from transformers import AutoTokenizer, AutoModel


class PapersAbstractToTSNE:

  def __init__(self, config) -> None:
    self.config = config
    self.api = SemanticScholarAPI()

  def get_papers(self):
    with open(self.config.papers_in_dir) as f:
      d = json.load(f)
    return d

  def add_metadata(self, papers): 
    ids = [paper['paperId'] for paper in papers]
    papers = self.api.papers(ids, fields=['title', 'abstract', 'year', 'authors', 'url'])
    return papers 

  def compute_embeddings(self, sentences):

    def mean_pooling(model_output, attention_mask):
      token_embeddings = model_output[0] #First element of model_output contains all token embeddings
      input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
      return torch.sum(token_embeddings * input_mask_expanded, 1) / torch.clamp(input_mask_expanded.sum(1), min=1e-9)

    # Load model from HuggingFace Hub (https://www.sbert.net/docs/pretrained_models.html)
    tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/all-mpnet-base-v2')
    model = AutoModel.from_pretrained('sentence-transformers/all-mpnet-base-v2')
    # Tokenize sentences
    encoded_input = tokenizer(sentences, padding=True, truncation=True, return_tensors='pt')
    # Compute token embeddings
    with torch.no_grad():
        model_output = model(**encoded_input)
    return mean_pooling(model_output, encoded_input['attention_mask'])

  def store(self, papers, embeddings): 
    # Save papers 
    with open(self.config.papers_store_dir+'papers_store.json', 'w') as fp:
      json.dump(papers, fp)
    # Save embeddings 
    torch.save(embeddings, self.config.papers_store_dir+'embeddings_store.pt')

  def load(self):
    with open(self.config.papers_store_dir+'papers_store.json') as f:
      papers = json.load(f)
    embeddings = torch.load(self.config.papers_store_dir+'embeddings_store.pt')
    return papers, embeddings

  def add_tsne_and_cluster(self, papers, embeddings):
    print(embeddings.shape)
    dim_reduced_embeddings = TSNE(n_components=2, perplexity=4.0, early_exaggeration=5.0, metric='cosine', square_distances=True).fit_transform(embeddings)
    cluster = hdbscan.HDBSCAN(min_cluster_size=2, metric='euclidean').fit(dim_reduced_embeddings)
    for i in range(len(papers)):
      papers[i]['cluster'] = int(cluster.labels_[i])
      papers[i]['position'] = { 
        'x': float(dim_reduced_embeddings[i][0]), 
        'y': float(dim_reduced_embeddings[i][1]) 
      }
      # papers[i]['embedding'] = embeddings[i]
    return papers 

  def run(self):
    if (self.config.from_store):
      print('Loading papers/embeddings from store...')
      papers, embeddings = self.load()    
    else: 
      print('Getting papers...')
      papers = self.get_papers()
      papers = self.add_metadata(papers)
      papers = list(filter(lambda paper: paper['abstract'] != None, papers)) # Remove papers without abstract 
      text = [paper['title']+' '+paper['abstract'] for paper in papers] 
      print('Computing paper embeddings...')
      embeddings = self.compute_embeddings(text) 
      print('Saving papers/embeddings to store...')
      self.store(papers, embeddings)

    print('Computing clusters and t-sne...')
    papers = self.add_tsne_and_cluster(papers, embeddings)
    print('Saving augmented papers to: ', self.config.papers_out_dir) 
    with open(self.config.papers_out_dir, 'w') as fp:
      json.dump(papers, fp)
    
