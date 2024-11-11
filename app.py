from flask import Flask, request, jsonify
from cryptography.fernet import Fernet

app = Flask(__name__)

key = Fernet.generate_key()
cipher_suite = Fernet(key)

messages = {}

@app.route('/send_message', methods=['POST'])
def send_message():
    content = request.json.get("message")
    encrypted_message = cipher_suite.encrypt(content.encode())

    message_id = len(messages) + 1
    messages[message_id] = encrypted_message
    return jsonify({"message_id": message_id, "status": "Message encrypted and sent"}), 201

@app.route('/retrieve_message/<int:message_id>', methods=['GET'])
def retrieve_message(message_id):
    encrypted_message = messages.get(message_id)
    if not encrypted_message:
        return jsonify({"error": "Message not found"}), 404
    
    decrypted_message = cipher_suite.decrypt(encrypted_message).decode()
    return jsonify({"message_id": message_id, "message": decrypted_message}), 200

if __name__ == '__main__':
    app.run(debug=True)
