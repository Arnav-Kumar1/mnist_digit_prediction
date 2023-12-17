from flask import Flask, render_template, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io, os
import base64
from PIL import ImageOps
import matplotlib.pyplot as plt
from tensorflow.keras.models import load_model

app = Flask(__name__, static_url_path='/static')

MODEL_PATH = "models/mnist_cnn_50epochs_latest.h5"
CONFIDENCE_THRESHOLD = 0.65 # confidence threshold 

try:
    # Load your trained model
    model =load_model(MODEL_PATH)  # Replace with the path to your saved model  # Replace with the path to your saved model

    # If the model loaded successfully, print its summary
    print("Model loaded successfully! Here's the summary:")
    # model.summary()

except Exception as e:
    print("An error occurred while loading the model:", e)
    

# Create a temporary directory to store images
UPLOAD_FOLDER = 'static'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/')
def index():
    return render_template('digit_recognition.html')



@app.route('/predict', methods=['POST'])

def predict():
    # Receive image data from the front-end
    data = request.get_json()
    image_data = data['image_data'].split(',')[1]  # Remove the 'data:image/png;base64,' prefix

    # Convert image data to an image object which is an actual image itself
    image = Image.open(io.BytesIO(base64.b64decode(image_data)))


    ##  Save the original drawn digit image if you want to visualize

    # digit_image_name = 'digit_image.png'  # set image name
    # digit_image = os.path.join(app.config['UPLOAD_FOLDER'], digit_image_name)  # set path to which image will be saved to 
    # image.save(digit_image)  # save the image at that path

    # Create a new white canvas of the same size as the original image
    white_canvas = Image.new("RGB", image.size, (255, 255, 255))

    # Paste the original image onto the white canvas
    white_canvas.paste(image, (0, 0), image)



    ##  Save the original image if you want to visualize

    # org_image_filename = 'original_image.png'
    # org_image_path = os.path.join(app.config['UPLOAD_FOLDER'], org_image_filename)
    # white_canvas.save(org_image_path)



    # Invert the colors of the original image
    inverted_image = ImageOps.invert(white_canvas)

    # Convert the inverted image to grayscale 
    image_gray = ImageOps.grayscale(inverted_image)


    # Save the grayscale image if you want to visualize

    # gray_image_filename = 'gray_image.png'
    # gray_image_path = os.path.join(app.config['UPLOAD_FOLDER'], gray_image_filename)
    # image_gray.save(gray_image_path)



    # Convert image to a NumPy array and investigate its shape
    image_np = np.array(image_gray)

    # Resize the image
    image_resized = image_gray.resize((28, 28))
    image_resized = np.array(image_resized).astype(np.float32)
    image_resized = np.expand_dims(image_resized, axis=-1)  # Add channel dimension

    # Save the resized image (this is the image in mnist dataset originally)
    
    #pixel_28x28_img = '28x28_Grayscale.png'
    #resized_image_path =  os.path.join(app.config['UPLOAD_FOLDER'], pixel_28x28_img)
    #image_resized_pil = Image.fromarray(np.uint8(image_resized.squeeze() * 255), 'L')
    #image_resized_pil.save(resized_image_path)
    


    # Standardize the image data using mean and std deviation from training data
    image_resized = (image_resized - 33.34004) / 78.59439

    # Add batch dimension
    image_resized = np.expand_dims(image_resized, axis=0)

    # Make prediction using the loaded model
    prediction = model.predict(image_resized)

   
    def temperature_scale(logits, temperature):
        scaled_logits = logits / temperature
        return np.exp(scaled_logits) / np.sum(np.exp(scaled_logits), axis=-1, keepdims=True)

    # Assuming `prediction` contains the raw logits from your model

    temperature = 0.35  # You can experiment with different temperature values

    # Apply temperature scaling to the logits

    scaled_prediction = temperature_scale(prediction, temperature)

    # Get the predicted digit based on the scaled prediction
    predicted_digit = np.argmax(scaled_prediction, axis=1)[0]

    confidence = np.max(scaled_prediction) 

    if confidence < CONFIDENCE_THRESHOLD:
        return "Hmm, not a digit, but I give you 10 points for artistic ingenuity!"  # this Indicates that the input doesn't belong to any known class

    return f'{predicted_digit}'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
