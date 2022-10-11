from flask import Flask, request

app = Flask(__name__)

@app.route('/save-phrase', methods=['POST'])
def save_phrase():
    request_data = request.get_json()

    return request_data

# main driver function
if __name__ == '__main__':
    app.run(debug=True, port=3030)