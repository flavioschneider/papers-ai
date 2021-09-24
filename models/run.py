import os
import dotenv
import hydra
import pytorch_lightning as pl
from hydra.utils import call, instantiate
from omegaconf import DictConfig

# Load environment variables from `.env`.
dotenv.load_dotenv(override=True)

@hydra.main(config_path="configs/", config_name="config.yaml")
def main(config: DictConfig) -> None:

  pl.seed_everything(config.seed)

  if config.type == 'script':
    script = instantiate(config.script) 
    script.run() 

  elif config.type == 'model':
    pass

if __name__ == "__main__":
    main()
