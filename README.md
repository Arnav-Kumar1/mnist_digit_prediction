This README file covers the project's components, installation steps, file descriptions, usage instructions, model details, and acknowledgments.

# Handwritten Digit Recognition System

This project utilizes a Convolutional Neural Network (CNN) trained on the MNIST dataset to recognize and predict handwritten digits. It provides a web-based interface for users to draw digits and get real-time predictions.

## Overview

The system comprises a Flask backend serving a trained CNN model and a frontend interface allowing users to draw digits on a canvas for recognition.

### Key Components

- **Backend:** Flask server (`main.py`) handling prediction requests and model inference.
- **Frontend:** HTML (`digit_recognition.html`) and JavaScript (`digit_recognition.js`) for the user interface and drawing functionalities.
- **Trained Model:** `mnist_cnn_50epochs_latest.h5` file stored in the `models` folder.

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/Arnav-Kumar1/mnist_digit_prediction.git
   cd mnist_digit_prediction


2. pip install -r requirements.txt in python>3.9
3. make sure .h5 model is present in the models folder

### File Descriptions

- **digit_recognition.html**: This HTML file provides the user interface for drawing digits using an HTML canvas element.

- **digit_recognition.js**: JavaScript code handling the canvas drawing functionality and interaction with the backend for digit prediction.

- **main.py**: The Flask backend serving the prediction endpoint and containing the model inference logic.

- **requirements.txt**: This file lists the required Python libraries for running the project.

- **models/mnist_cnn_50epochs_latest.h5**: The trained CNN model for digit recognition.


## Deployment on Amazon EC2

This Handwritten Digit Recognition System is deployed on Amazon EC2 (Elastic Compute Cloud), providing a live web service for users.

### Deployment Details

- **Hosting Platform:** Amazon EC2
- **URL:** [Handwritten Digit Prediction](https://urlzs.com/eS5jY)

### Deployment Guide

For detailed instructions on deploying this project on Amazon EC2, I recommend watching the tutorial video on the Campus X YouTube channel:

- **Deployment Tutorial:** CampusX YT channel
- **URL:** [Model Deployment on EC2](https://www.youtube.com/watch?v=_rwNTY5Mn40)

The video provides step-by-step guidance for setting up and deploying this system on Amazon EC2. It covers installation, configuration, and launching the service.

**Note:** Ensure to follow security best practices and adapt the instructions to your specific EC2 setup.



## Local Server Deployment

To deploy the system locally, follow these steps:

1. **Clone the Repository:** Download or clone the entire repository onto your local machine.

2. **Create a Virtual Environment:** Set up a virtual environment and activate it.

3. **Install Dependencies:** Install all the required dependencies listed in the `requirements.txt` file using the following command:

   ```bash
   pip install -r requirements.txt

4. Run the Flask Server**
     Execute the `main.py` file to start the Flask server.
   ```bash
   python main.py

5. Access the Application**
Once the server is running, open a web browser and navigate to the provided local hyperlink (Ctrl + left click) displayed in your IDE's console.

6. Draw a Digit and Predict**
Use the canvas interface to draw a digit. Click the "Predict" button to receive the predicted digit.

7. Clear the Canvas**
Utilize the "Clear" button to erase the canvas and draw a new digit.





Model Details in handwritten_digit_prediction.ipynb
Model File: mnist_cnn_50epochs_latest.h5
Framework: TensorFlow and Keras
Training: Trained on the MNIST dataset for 50 epochs.
Acknowledgments
Made by: Arnav Kumar
