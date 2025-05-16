import os
import nltk
import shutil
import openai 
from dotenv import load_dotenv
from langchain.schema import Document
from langchain.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

nltk.download('punkt')
load_dotenv()
 
openai.api_key = os.environ['OPENAI_API_KEY']

CHROMA_PATH = "chroma"
DATA_PATH = "data/books"
    
faculty_lookup = {
    "who is prof sameh nada": "Prof. Sameh Nada is the Vice President and PharmD Program Chairperson at E-JUST.",
    "who is assoc prof ahmed s saad": "Assoc. Prof. Ahmed S. Saad is the PharmD Program Director, specialized in Pharmaceutical Analytical Chemistry.",
    "who is prof mahmoud eid soliman": "Prof. Mahmoud Eid Soliman is Professor of Pharmaceutics and Industrial Pharmacy.",
    "who is prof hisham soliman": "Prof. Hisham Soliman is Professor of Pharmacognosy & Medicinal Plants.",
    "who is assoc prof sherif hammad": "Assoc. Prof. Sherif Hammad specializes in Medicinal Chemistry.",
    "who is assoc prof sally elzahaby": "Assoc. Prof. Sally Elzahaby works in Pharmaceutics & Industrial Pharmacy.",
    "who is assoc prof mennatallah ali": "Assoc. Prof. Mennatallah Ali works in Pharmacology & Toxicology.",
    # Add more if needed...
}
faq_lookup = {
    "how to apply for pharmd": "You can apply through the university portal...",
    
}

def main():
    generate_data_store()


def generate_data_store():
    documents = load_documents()
    chunks = split_text(documents)
    save_to_chroma(chunks)


def load_documents():
    loader = DirectoryLoader(DATA_PATH, glob="*.md")
    documents = loader.load()
    return documents


def split_text(documents: list[Document]):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1100,
        chunk_overlap=100,
        length_function=len,
        add_start_index=True,
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Split {len(documents)} documents into {len(chunks)} chunks.")

    document = chunks[10]
    print(document.page_content)
    print(document.metadata)

    return chunks


def save_to_chroma(chunks: list[Document]):
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)

    db = Chroma.from_documents(
        chunks, OpenAIEmbeddings(), persist_directory=CHROMA_PATH
    )
    db.persist()
    print(f"Saved {len(chunks)} chunks to {CHROMA_PATH}.")


if __name__ == "__main__":
    main()
