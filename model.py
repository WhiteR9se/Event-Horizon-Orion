import torch
from transformers import AutoModel, AutoProcessor
from PIL import Image
import requests

model_name = "IBM/nasa-geospatial-ai-foundation-model"
model = AutoModel.from_pretrained(model_name)
processor = AutoProcessor.from_pretrained(model_name)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

image_url = "https://eoimages.gsfc.nasa.gov/images/imagerecords/149000/149385/indonesia_vir_2020361_lrg.jpg"
image = Image.open(requests.get(image_url, stream=True).raw)
inputs = processor(images=image, return_tensors="pt").to(device)

with torch.no_grad():
    outputs = model(**inputs)

print(outputs)
