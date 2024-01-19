from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import openai
from chat import get_response
import time
app = Flask(__name__)
CORS(app)
import docx2txt

openai.api_type = "azure"
openai.api_version = "2023-05-15"
openai.api_base = "https://punjabbot.openai.azure.com/"  # Your Azure OpenAI resource's endpoint value.

# Set up OpenAI API credentials
openai.api_key = 'd378ad630b34404a9f8d0731f9229566'

file_path= ('Documents.docx')
filee=docx2txt.process(file_path)

@app.get("/")
def index_get():
    return render_template("base.html")


# @app.post("/predict")
@app.route('/predict', methods=['POST'])
def predict():
    # Get the message from the POST request
    # startTime = time.time()
    message = request.get_json().get("message")

    # Send the message to OpenAI's API and receive the response

    completion = openai.ChatCompletion.create(
        engine="punjabbot",
        messages=[
            {"role": "system", "content": filee},
            {"role": "system", "content": "In summary"},
            {"role": "user", "content": message}
        ]
    )
    if completion.choices[0].message != None:
        response = completion.choices[0].message
    else:
        response = 'Failed to Generate response!'
    # endTime = time.time()
    # print((endTime - startTime) * 1000, "milliseconds")
    message = {"answer": response}
    return jsonify(message)


if __name__ == "__main__":
    # app.run(debug=True)
    app.run(debug=True, port=80)
