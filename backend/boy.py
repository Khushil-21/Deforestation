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
    data = data["data"].__str__()
    # data=data["received_data"].__str__()
    # data=data+
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """

                    You are an expert environmental analyst. You will analyze the provided historical data on forest and land percentages from satellite imagery, focusing on deforestation trends. Your analysis should include a comprehensive overview of the changes in forest cover over the years, identifying significant patterns, fluctuations, and potential causes of these changes. Additionally, provide actionable recommendations for preventing further deforestation, considering environmental, social, and economic factors. The data for analysis is as follows:
<div className="report-container">
                    Year Data:

                    Year: [Insert Year]
                    Forest Percentage: [Insert Percentage]%
                    Land Percentage: [Insert Percentage]%
                    Historical Data:

                    [List historical years with corresponding forest and land percentages]
                    In your response, consider including the following aspects:

                    Trend Analysis:

                    Identify and describe key trends in forest cover change over the years.
                    Highlight any years with notable increases or decreases in forest percentage.
                    Discuss possible reasons for these changes, such as natural disasters, policy changes, economic activities, etc.
                    Note: Be vigilant for unrealistic data entries (e.g., abrupt and extreme changes that do not align with natural patterns or known events) and address these anomalies in your analysis. Provide possible explanations for these discrepancies, such as data errors, unusual events, or limitations in data collection methods.
                    Impact Assessment:

                    Evaluate the ecological, social, and economic impacts of the observed deforestation trends.
                    Consider the implications for biodiversity, climate change, and local communities.
                    Preventive Measures:

                    Suggest strategies for preventing further deforestation, including conservation efforts, sustainable land management practices, reforestation programs, and policy recommendations.
                    Highlight the importance of community involvement, education, and international cooperation in combating deforestation.
                    Long-Term Outlook:

                    Provide a projection of future forest cover trends based on the historical data.
                    Discuss the potential consequences if current trends continue or if preventive measures are implemented effectively.
                    Use the data provided to generate a detailed, informative, and actionable analysis that can guide efforts in environmental conservation and sustainable land use. Ensure to critically assess the data quality and highlight any uncertainties or anomalies detected.
                    
                </div>
                    return me this div tag with all the data in html tags with tailwind css as styling in jsx format 
                    JUST RETURN ME THE DIV TAG WITH ALL THE DATA NO IMPORTS NO COMMENTS NO HEAD BODY SCRIPT TAGS DO NOT USE MAP FILTER FUNCTION OR ANY KIND OF VARIABLES. IF YOU WANT TO MAKE A TABLE THEN USE THE DATA AND THE TABLE TAG AND WRITE ALL DATA MANUALLY
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
    
