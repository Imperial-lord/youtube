from transformers import AutoFeatureExtractor, DeiTForImageClassificationWithTeacher
from PIL import Image
import requests


def classify_image(url):
    image = Image.open(requests.get(url, stream=True).raw)

    feature_extractor = AutoFeatureExtractor.from_pretrained('facebook/deit-base-distilled-patch16-224')
    model = DeiTForImageClassificationWithTeacher.from_pretrained('facebook/deit-base-distilled-patch16-224')

    inputs = feature_extractor(images=image, return_tensors="pt")

    # forward pass
    outputs = model(**inputs)
    logits = outputs.logits

    # model predicts one of the 1000 ImageNet classes
    predicted_class_idx = logits.argmax(-1).item()
    return model.config.id2label[predicted_class_idx]
