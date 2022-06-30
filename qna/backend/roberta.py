'''
    This is the distilled version of the deepset/roberta-base-squad2 model. 
    This model has a comparable prediction quality and runs at twice the speed of the base model.

    The roberta-base model is fine-tuned using the SQuAD2.0 dataset. 
    It's been trained on question-answer pairs, including unanswerable questions, for the task of Question Answering.
'''

from transformers import AutoModelForQuestionAnswering, AutoTokenizer, pipeline

model_name = "deepset/tinyroberta-squad2"

# Hardcoded context, question
context = 'The option to convert models between FARM and transformers gives freedom to the user and let people easily switch between frameworks.'
question = 'Why is model conversion important?'

nlp = pipeline('question-answering', model=model_name, tokenizer=model_name)


def nlp_qna(context, question):
    QA_input = {
        'question': question,
        'context': context
    }
    res = nlp(QA_input)

    return res
