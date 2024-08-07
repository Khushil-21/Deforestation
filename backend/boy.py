from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain_core.output_parsers import StrOutputParser, XMLOutputParser
from typing import List, Optional
from langchain_core.pydantic_v1 import BaseModel, Field
import os
from dotenv import load_dotenv

load_dotenv()


def generate_report(data: str) -> str:
    """Generate a report based on the data of deforestation."""
    print("data: ", data)
    # return data
    # data=data['data']
    # data = data["data"].__str__()
    data=data["received_data"].__str__()
    # data=data+
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """

                   You are a specialized environmental data analyst and report generator. Your task is to produce a comprehensive, visually compelling report on deforestation trends based on provided historical forest and land percentage data. The report should include:

A clear and concise executive summary outlining the primary findings, key trends, and significant impacts of deforestation.
A detailed table of contents accurately reflecting the report's structure and page numbers.
An in-depth analysis of historical deforestation trends, including:
Identification of key periods of forest gain or loss.
Quantification of deforestation rates over time.
Correlation of deforestation patterns with potential factors such as climate change, population growth, and economic activities.
A comprehensive assessment of the ecological, social, and economic impacts of deforestation, considering factors like biodiversity loss, climate change, and livelihood impacts.
A strategic section outlining potential solutions and recommendations to mitigate deforestation, including:
Conservation strategies and protected area management.
Sustainable land-use practices and reforestation initiatives.
Policy recommendations and governance improvements.
Community engagement and capacity building.
A forward-looking perspective on future deforestation trends based on historical data and potential scenarios.
The report should be formatted using HTML, JSX, and Tailwind CSS to ensure a professional and visually appealing presentation. Incorporate tables, graphs, and images to effectively communicate complex data. Maintain a clear and concise writing style throughout the report.
                    return me this div tag with all the data in html tags with tailwind css as styling in jsx format 
                    JUST RETURN ME THE DIV TAG WITH ALL THE DATA NO IMPORTS NO COMMENTS NO HEAD BODY SCRIPT TAGS DO NOT USE MAP FILTER FUNCTION OR ANY KIND OF VARIABLES. IF YOU WANT TO MAKE A TABLE THEN USE THE DATA AND THE TABLE TAG AND WRITE ALL DATA MANUALLY
                    MAKE SURE TO STYLE EACH AND EVERY TAG AND MAKE PROFESSIONAL REPORT AND FOR CLOUDINARY LINK USE IMG WITH SRC TAG NOT A TAG
                    STYLE EACH AND EVERY TAG WITH TAILWIND CSS
                MAKE LIST BY UL OL TAGS  MAKE PARAGRAPH BY P TAGS USE PROPER SPACING AND FONT SIZE
                """,
            ),
            ("human", "{data}"),
        ]
    )
    chat = ChatGroq(temperature=0, model_name="llama3-8b-8192")
    print("chat: ", chat)

    # chain = prompt | chat.with_structured_output(schema=generate_report)
    chain = prompt | chat | StrOutputParser()

    response = chain.invoke({"data": data})
    print("response: ", response)
    return response




def chatbot(message1: str, report: str) -> str:
    """Simulate a chatbot conversation based on the generated report."""
    # print(message1)
    # print(type(message1))
    # print(report)
    # print(type(report))
    chat_bot_prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                f"""
                    You are an expert conversational AI chatbot. 
                    You will engage in a conversation with a user who is seeking information on deforestation trends and preventive measures. 
                    The user will ask you questions related to the given report. 
                    Your responses should be informative, engaging, and tailored to the user's queries. 
                    Your responses should be bref and to the point.
                    Response length should 3-4 sentences.
                    The given report is as follows:
                    {report['report']}
                """
            ),

            ("human", "{message}"),
        ]
    )

    chat_bot = ChatGroq(temperature=0, groq_api_key=os.environ.get("GROQ_API_KEY"), model_name="llama3-8b-8192")
    chat_bot_chain = chat_bot_prompt | chat_bot | StrOutputParser()
    
    res = chat_bot_chain.invoke({"message": message1})
    return res
    
