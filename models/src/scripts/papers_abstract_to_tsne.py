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

    # Load model from HuggingFace Hub
    tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/all-mpnet-base-v2')
    model = AutoModel.from_pretrained('sentence-transformers/all-mpnet-base-v2')
    # Tokenize sentences
    encoded_input = tokenizer(sentences, padding=True, truncation=True, return_tensors='pt')
    # Compute token embeddings
    with torch.no_grad():
        model_output = model(**encoded_input)
    return mean_pooling(model_output, encoded_input['attention_mask'])

  def add_tsne_and_cluster(self, papers, embeddings):
    dim_reduced_embeddings = TSNE(n_components=2, perplexity=5.0, early_exaggeration=10.0, metric='cosine', square_distances=True).fit_transform(embeddings)
    cluster = hdbscan.HDBSCAN(min_cluster_size=3, metric='euclidean').fit(dim_reduced_embeddings)
    for i in range(len(papers)):
      papers[i]['cluster'] = int(cluster.labels_[i])
      papers[i]['position'] = { 
        'x': float(dim_reduced_embeddings[i][0]), 
        'y': float(dim_reduced_embeddings[i][1]) 
      }
    return papers 

  def run(self):
    papers = self.get_papers()
    papers = self.add_metadata(papers)
    papers = list(filter(lambda paper: paper['abstract'] != None, papers)) # Remove papers without abstract 
    abstracts = [paper['abstract'] for paper in papers] 
    abstracts_embeddings = self.compute_embeddings(abstracts) 
    papers = self.add_tsne_and_cluster(papers, abstracts_embeddings)

    print('Augmented papers saved to: ', self.config.papers_out_dir) 
    with open(self.config.papers_out_dir, 'w') as fp:
      json.dump(papers, fp)
    
