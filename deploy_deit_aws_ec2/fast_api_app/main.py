from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import gunicorn
from deit import classify_image
import numpy as np

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/classify/{url:path}")
def classify(url):
    '''
    Distilled data-efficient Image Transformer (DeiT) model pre-trained and fine-tuned on ImageNet-1k (1 million images, 1,000 classes) at resolution 224x224. 
    It was first introduced in the paper Training data-efficient image transformers & distillation through attention by Touvron et al. and first released in this repository. 
    However, the weights were converted from the timm repository by Ross Wightman.

    Results are in the format {'Predicted class': <class>}
    '''

    result = classify_image(url)

    if not result:
        raise HTTPException(status_code=400, detail='Incorrect Image URL')

    return {'Predicted class': result}
