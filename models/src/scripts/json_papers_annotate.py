import os 
import glob
import json 
import torch 
from transformers import pipeline

class JSONPapersAnnotate:

  def __init__(self, config):
    self.config = config
    # Init model 
    model_name = "deepset/roberta-base-squad2"
    self.pipe = pipeline('question-answering', model=model_name, tokenizer=model_name, device=self.config.device)

  def read_json_files(self, path):
    files = sorted(glob.glob(f"{path}/*.json"), key=str.lower)
    json_files = []
    for file in files:
      with open(file) as json_file:
        json_files.append(json.load(json_file))
    return json_files, files 

  def extract_answer(self, text, question):
    return self.pipe({ 'context': text, 'question': question })

  def extract_best_answer(self, text, questions):
    # Extact most likely annotation from multiple questions
    results = []
    result_best_id = 0
    result_best_score = 0
    for id, question in enumerate(questions):
      res = self.extract_answer(text, question)
      res['question'] = question 
      results.append(res)
      if res['score'] > result_best_score:
        result_best_id = id 
        result_best_score = res['score']
    return results[result_best_id]

  def is_text(self, text):
    return text is not None and text != ''
  
  def get_texts(self, json_file): 
    texts = []
    abstract = str(json_file['abstract'])
    if self.is_text(abstract):
      texts.append(abstract)
    for section in json_file['sections']:
      if self.is_text(section['text']):
        texts.append(section['text'])
    return texts

  def run(self):
    conf = self.config 
    json_files, files = self.read_json_files(conf.in_dir_json)
    annotations = conf.annotations
    accept_score = conf.model_settings.accept_score
    data = []

    for id, file in enumerate(json_files):
      texts = self.get_texts(file)
      data_curr = { 'id': id, 'file': os.path.split(files[id])[1], 'title': file['title'] }
      for annotation in annotations:
        answer_best = None 
        answer_score = 0.0
        for text in texts:
          answer = self.extract_best_answer(text, annotation.questions)
          if answer['score'] > answer_score:
            answer_score = answer['score']
            answer_best = answer 
          if answer['score'] > accept_score: break 
        data_curr[annotation.name] = answer_best
        print(json.dumps(data_curr, indent=2))
      data.append(data_curr)
      with open(conf.out_json, 'w') as outfile:
        json.dump(data, outfile)



    
