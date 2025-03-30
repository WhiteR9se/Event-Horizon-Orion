import torch
from transformers import AutoModel, AutoProcessor
from PIL import Image
import requests

# Configuration
modelName = "IBM/nasa-geospatial-ai-foundation-model"
imageURL = "https://eoimages.gsfc.nasa.gov/images/imagerecords/149000/149385/indonesia_vir_2020361_lrg.jpg"

def load_model_and_processor():
    """Load the model and processor with GPU support if available"""
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")
    
    model = AutoModel.from_pretrained(modelName).to(device)
    processor = AutoProcessor.from_pretrained(modelName)
    
    return model, processor, device

def load_image_from_url(url):
    """Download and open an image from URL"""
    response = requests.get(url, stream=True)
    return Image.open(response.raw)

def main():
    # Load components
    geospatial_model, image_processor, device = load_model_and_processor()
    
    # Load and process image
    satellite_image = load_image_from_url(imageURL)
    model_inputs = image_processor(
        images=satellite_image, 
        return_tensors="pt"
    ).to(device)
    
    # Run inference
    with torch.no_grad():
        model_output = geospatial_model(**model_inputs)
    
    print("Model output:", model_output)

if __name__ == "__main__":
    main()
