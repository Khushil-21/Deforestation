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
                
                Here's the complete prompt and style guide combined:

"As an expert environmental analyst, analyze historical forest and land percentage data from satellite imagery, focusing on deforestation trends. Provide a comprehensive analysis structured as follows:

1. Data Overview:
   - Present the current year's forest and land percentages
   - List historical data for previous years

2. Historical Data Analysis:
   - show them in table ( table width must be full width ) format center align the data.image should not be included in table.percentage should be in rounded off to 2 decimal points its important .

3. Trend Analysis:
   - Identify key trends in forest cover changes
   - Highlight significant fluctuations
   - Discuss potential causes for changes
   - Address any data anomalies or unrealistic entries

4. Impact Assessment:
   - Evaluate ecological, social, and economic impacts
   - Consider implications for biodiversity, climate, and communities

5. Preventive Measures and Recommendations:
   - Suggest strategies to prevent further deforestation
   - Include conservation efforts, sustainable practices, and policy recommendations
   - Emphasize community involvement and international cooperation

Presentation Requirements:
- Use HTML tags with Tailwind CSS for styling in JSX format
- Include all content within a single <div> tag
- Avoid using JavaScript functions, variables, or imports
- Style each element professionally using Tailwind CSS
- Use appropriate HTML tags (ul, ol, p) for structuring content
- Round all percentages to two decimal points every where.
- Maintain consistent spacing, padding, and margins for proper formatting
- Create the table manually without using map or filter functions

Styling Guidelines:

Apply consistent and professional styling throughout the report using Tailwind CSS:

- Use a readable font: 'text-base' for regular text, 'text-lg' for slightly larger text, and 'text-xl' or 'text-2xl' for headings.
- Maintain consistent text colors: 'text-gray-800' for main text, 'text-gray-600' for secondary text.
- Use proper spacing: 'p-4' for general padding, 'my-4' for vertical margins between sections.
- Style headings with 'font-bold' and appropriate size classes.
- For lists (ul, ol):
  - Apply 'list-disc' or 'list-decimal' for bullet or numbered lists
  - Use 'ml-6' for list indentation
  - Add 'mb-2' to list items for spacing
- Style tables:
  - Use 'table-auto w-full' for full-width tables
  - Apply 'border-collapse border border-gray-300' for borders
  - Style table headers with 'bg-gray-100 font-semibold'
  - Add 'px-4 py-2' to table cells for padding
  - Use 'even:bg-gray-50' for alternating row colors
- For image and text layouts:
  - Utilize 'flex' and 'flex-wrap' for responsive designs
  - Apply 'rounded-lg shadow-md' to images for a polished look
- Use 'bg-white' for the main container and 'max-w-4xl mx-auto' for centering content
- Add 'transition duration-300' to interactive elements for smooth hover effects
- Ensure proper contrast with background colors for readability
- Use 'text-center' for centered text and 'text-justify' for long paragraphs
- Apply 'overflow-x-auto' to container divs for tables to ensure responsiveness

Implement these styling guidelines consistently throughout the report to create a cohesive, professional, and visually appealing document.

Note: Adjust section titles as needed based on the provided data. Ensure critical assessment of data quality and highlight any uncertainties or anomalies detected. Provide an informative and actionable analysis to guide environmental conservation and sustainable land use efforts.

JUST RETURN THE DIV TAG WITH ALL THE DATA. NO IMPORTS, COMMENTS, HEAD, BODY, OR SCRIPT TAGS. DO NOT USE MAP, FILTER FUNCTIONS, OR ANY VARIABLES. FOR TABLES, USE THE TABLE TAG AND WRITE ALL DATA MANUALLY.
.
                """,
            ),
            ("human", "{data}"),
        ]
    )
    chat = ChatGroq(temperature=0, model_name="gemma2-9b-it")
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
    
