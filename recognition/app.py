from flask import Flask, Response, request

app = Flask(__name__)

@app.route('/recognition', methods=['POST'])
def json_example():
    request_data = request.get_json()

    user_id = request_data['user_id']
    phrase = request_data['phrase']

    return Response (
        status=200
    )
 
# main driver function
if __name__ == '__main__':
    app.run(debug=True, port=5000)