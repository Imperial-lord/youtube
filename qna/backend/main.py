from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import gunicorn
from roberta import nlp_qna
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


@app.get("/answer/{context}/{question}")
def answer(context, question):
    '''
    GET /answer/{context}/{question}

    Provides a response using the distilled roberta model.
    Sample response:
    {'score': 0.26244664192199707, 'start': 59, 'end': 132, 
    'answer': 'gives freedom to the user and let people easily switch between frameworks'}
    '''

    print("Context: {}\nQuestion: {}\n".format(context, question))

    result = nlp_qna(context, question)

    if not result:
        raise HTTPException(status_code=400)

    return result
