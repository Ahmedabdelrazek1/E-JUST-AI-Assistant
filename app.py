from flask import Flask, request, jsonify
from flask_cors import CORS
from rag_engine import get_answer  # Make sure this exists and is correct

app = Flask(__name__)
CORS(app)  # Allows requests from React/Vite frontend (http://localhost:5173)

@app.route('/')
def home():
    return jsonify({"message": "EJUST Flask RAG backend is running!"})

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        query = data.get("query", "")
        if not query:
            return jsonify({"answer": "No query provided."}), 400

        answer = get_answer(query)
        return jsonify({"answer": answer})

    except Exception as e:
        return jsonify({"error": "Something went wrong.", "details": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=8000)
