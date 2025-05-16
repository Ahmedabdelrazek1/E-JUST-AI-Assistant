import os
import traceback
from database import faculty_lookup, faq_lookup
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.chat_models import ChatOpenAI
from langchain_community.embeddings import OpenAIEmbeddings
from dotenv import load_dotenv
load_dotenv()

CHROMA_PATH = "chroma"

PROMPT_TEMPLATE = ChatPromptTemplate.from_template(
    """
You are an expert AI assistant for Egypt-Japan University of Science and Technology (E-JUST).
You are helpful, friendly, and informative.

Answer the following question using the context provided.
If the answer is not in the context, or the context is not helpful, respond:
"I'm sorry, I couldn't find information related to that. Please contact info@ejust.edu.eg for assistance."

Context:
{context}

Question:
{question}
"""
)

# Initialize model and DB
try:
    embedding_function = OpenAIEmbeddings()
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)
    model = ChatOpenAI()
except Exception as init_error:
    print(" Error initializing RAG engine:")
    traceback.print_exc()
    raise init_error

# Optional categorizer
def classify_question_type(query: str) -> str:
    if query.lower().startswith("who is"):
        return "faculty"
    elif any(q in query.lower() for q in ["how to", "steps to", "process of"]):
        return "procedure"
    return "general"

# Main QA logic
def get_answer(query: str) -> str:
    try:
        normalized = query.strip().lower()

        # Step 1: Handle friendly phrases
        greetings = {
            "hi": "Hello! How can I help you regarding E-JUST ",
            "hello": "Hi there! Ask me anything about E-JUST or its academic programs.",
            "thanks": "You're welcome! Let me know if there's anything else.",
            "thank you": "Anytime! 😊",
        }
        if normalized in greetings:
            return greetings[normalized]

        # Step 2: Check dictionaries
        if normalized in faculty_lookup:
            return faculty_lookup[normalized]
        if normalized in faq_lookup:
            return faq_lookup[normalized]

        # Step 3: RAG - Semantic vector search
        results = db.similarity_search_with_relevance_scores(query, k=6)
        context_text = "\n\n---\n\n".join([doc.page_content for doc, _ in results])
        top_score = results[0][1] if results else 0.0

        # Step 4: Fallback if not confident
        if not results or top_score < 0.9:
            fallback_prompt = f"You are an assistant for E-JUST. Answer clearly: {query}"
            return str(model.invoke(fallback_prompt).content)

        # Step 5: Final contextual prompt
        prompt = PROMPT_TEMPLATE.format_messages(context=context_text, question=query)
        response = model.invoke(prompt)
        return str(response.content)

    except Exception as e:
        print("Error while generating response:")
        traceback.print_exc()
        return "An internal error occurred. Please try again or contact support."